import * as alt from 'alt-server';

alt.log('==================================================');
alt.log('[FOODTRUCK] Server-Script wird geladen');
alt.log('==================================================');

let globalPed = null;

function createNPC() {
    try {
        const pos = new alt.Vector3(90.90, 298.54, 110.211);
        
        // Konvertiere die gewünschte Rotation (-0.25 rad) in Grad
        // -0.25 Radiant ≈ -14.32 Grad
        const zRotationRad = +0.45;
        const zRotationDeg = (zRotationRad * 180 / Math.PI);
        
        // Normalisiere auf positiven Gradwert (0-360)
        const heading = ((zRotationDeg % 360) + 360) % 360;
        
        alt.log('[FOODTRUCK] Spawn-Versuch mit Position:', pos);
        alt.log('[FOODTRUCK] Heading (Grad):', heading);
        
        globalPed = new alt.Ped(
            261586155, // s_m_y_chef_01
            pos,
            heading
        );
        
        if(globalPed && globalPed.valid) {
            alt.log('[FOODTRUCK] NPC erfolgreich erstellt!');
            
            // Setze exakte Rotation als Metadaten
            globalPed.setStreamSyncedMeta('exactRotation', {
                x: 0,
                y: 0,
                z: zRotationRad
            });
            
            alt.log('[FOODTRUCK] NPC ID:', globalPed.id);
            alt.log('[FOODTRUCK] NPC Position:', globalPed.pos);
            alt.log('[FOODTRUCK] NPC Rotation (rad):', zRotationRad);
        } else {
            alt.log('[FOODTRUCK] NPC konnte nicht erstellt werden');
        }
        
    } catch(error) {
        alt.log('[FOODTRUCK] Fehler beim NPC Spawn:', error.message);
    }
}

setTimeout(createNPC, 1000);

// Status Check
alt.setInterval(() => {
    if(globalPed && globalPed.valid) {
        alt.log('[FOODTRUCK] NPC existiert und ist valid');
        alt.log('[FOODTRUCK] NPC Position:', globalPed.pos);
    }
}, 5000);