import * as alt from 'alt-server';

alt.log('==================================================');
alt.log('[FOODTRUCK] Vehicle Server-Script wird geladen');
alt.log('==================================================');

let globalVehicle = null;

alt.on('resourceStart', (resourceName) => {
    alt.log(`[FOODTRUCK] Resource ${resourceName} wurde gestartet`);
    if (resourceName === 'foodtruck') {
        alt.log('[FOODTRUCK] Starte Fahrzeug-Spawn in 1 Sekunde...');
        setTimeout(createVehicle, 1000);
    }
});

function createVehicle() {
    try {
        // Position und Rotation für das Fahrzeug
        const pos = new alt.Vector3(92.37, 309.30, 110.01);
        
        // Rotation in Radiant
        const zRotationRad = +0.45;
        const zRotationDeg = (zRotationRad * 180 / Math.PI);
        
        // Normalisiere auf positiven Gradwert (0-360)
        const heading = ((zRotationDeg % 360) + 360) % 360;
        
        alt.log('[FOODTRUCK] Versuche Fahrzeug zu spawnen...');
        alt.log('[FOODTRUCK] Position:', JSON.stringify(pos));
        alt.log('[FOODTRUCK] Heading:', heading);
        
        // Prüfe ob Fahrzeugmodell valid ist
        if (!alt.hasModel('taco')) {
            alt.log('[FOODTRUCK] WARNUNG: Fahrzeugmodell "taco" nicht gefunden, versuche "speedo"');
            if (!alt.hasModel('speedo')) {
                throw new Error('Weder "taco" noch "speedo" Modelle gefunden!');
            }
        }
        
        // Taco Van: "taco" oder alternativ "speedo"
        globalVehicle = new alt.Vehicle(
            'taco',
            pos.x,
            pos.y, 
            pos.z,
            0,
            0,
            heading
        );
        
        if(globalVehicle && globalVehicle.valid) {
            alt.log('[FOODTRUCK] Fahrzeug erfolgreich erstellt!');
            alt.log('[FOODTRUCK] Fahrzeug Details:', {
                id: globalVehicle.id,
                position: globalVehicle.pos,
                model: globalVehicle.model
            });
            
            globalVehicle.setStreamSyncedMeta('exactRotation', {
                x: 0,
                y: 0,
                z: zRotationRad
            });
            
            globalVehicle.engineOn = false;
            globalVehicle.lockState = 2;
            globalVehicle.numberPlateText = 'FOODTRK';
            globalVehicle.primaryColor = 83;
            globalVehicle.secondaryColor = 0;
        } else {
            throw new Error('Fahrzeug wurde erstellt aber ist nicht valid!');
        }
        
    } catch(error) {
        alt.log('[FOODTRUCK] KRITISCHER FEHLER beim Fahrzeug Spawn:', error);
        alt.log('[FOODTRUCK] Error Stack:', error.stack);
    }
}

// Status Check alle 5 Sekunden
alt.setInterval(() => {
    alt.log('[FOODTRUCK] Status Check:');
    if(globalVehicle) {
        alt.log('[FOODTRUCK] Fahrzeug Objekt existiert');
        alt.log('[FOODTRUCK] Valid:', globalVehicle.valid);
        if(globalVehicle.valid) {
            alt.log('[FOODTRUCK] Position:', globalVehicle.pos);
        }
    } else {
        alt.log('[FOODTRUCK] Kein Fahrzeug-Objekt vorhanden!');
    }
}, 5000);