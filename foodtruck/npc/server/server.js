import * as alt from 'alt-server';

alt.log('==================================================');
alt.log('[FOODTRUCK] Server-Script wird geladen');
alt.log('==================================================');

// Globale Variable für den NPC
let globalPed = null;

// Direkter Spawn-Versuch beim Laden
setTimeout(() => {
    alt.log('[FOODTRUCK] Versuche direkten NPC Spawn...');
    createNPC();
}, 1000);

function createNPC() {
    try {
        // Spawn in der Nähe vom Legion Square
        const pos = new alt.Vector3(90.80, 298.54, 110.211);
        
        // Konvertiere die Z-Rotation in Grad und dann in ein Heading
        const zRotation = -0.25;
        const headingInDegrees = zRotation * (180 / Math.PI);
        const heading = headingInDegrees * (Math.PI / 180);
        
        alt.log('[FOODTRUCK] Spawn-Versuch mit Position:', pos);
        alt.log('[FOODTRUCK] Berechnetes Heading:', heading);
        
        globalPed = new alt.Ped(
            1885233650,
            pos,
            heading
        );
        
        if(globalPed && globalPed.valid) {
            alt.log('[FOODTRUCK] NPC erfolgreich erstellt!');
            
            // Zusätzliche Rotation über natives
            alt.emitClient(null, 'setNPCRotation', globalPed);
            
            alt.log('[FOODTRUCK] NPC ID:', globalPed.id);
            alt.log('[FOODTRUCK] NPC Position:', globalPed.pos);
            alt.log('[FOODTRUCK] NPC Rotation:', globalPed.rot);
        } else {
            alt.log('[FOODTRUCK] NPC konnte nicht erstellt werden');
        }
        
    } catch(error) {
        alt.log('[FOODTRUCK] Fehler beim NPC Spawn:', error.message);
    }
}

// Status Check
alt.setInterval(() => {
    alt.log('[FOODTRUCK] Server-Script läuft...');
    
    // Überprüfe NPC Status
    if(globalPed && globalPed.valid) {
        alt.log('[FOODTRUCK] NPC existiert und ist valid');
        alt.log('[FOODTRUCK] NPC Position:', globalPed.pos);
    } else {
        alt.log('[FOODTRUCK] Kein valider NPC vorhanden');
    }
}, 5000);

// Cleanup bei Resource Stop
alt.on('resourceStop', (resourceName) => {
    if(resourceName === 'foodtruck' && globalPed && globalPed.valid) {
        alt.log('[FOODTRUCK] Entferne NPC...');
        globalPed.destroy();
        globalPed = null;
    }
});

alt.log('[FOODTRUCK] Server-Script vollständig geladen');