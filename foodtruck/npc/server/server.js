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
        
        alt.log('[FOODTRUCK] Spawn-Versuch mit Position:', pos);
        
        // Verwende numerischen Hash
        globalPed = new alt.Ped(
           1641152947, // Hash-Wert für mp_m_freemode_01
            pos,
            0 // Initiales Heading auf 0
        );
        
        if(globalPed && globalPed.valid) {
            alt.log('[FOODTRUCK] NPC erfolgreich erstellt!');
            
            // Setze die genaue Rotation
            globalPed.rot = new alt.Vector3(0, 0, -0.25);
            
            // Setze die Position nochmal zur Sicherheit
            globalPed.pos = pos;
            
            alt.log('[FOODTRUCK] NPC ID:', globalPed.id);
            alt.log('[FOODTRUCK] NPC Position:', globalPed.pos);
            alt.log('[FOODTRUCK] NPC Rotation gesetzt auf:', globalPed.rot);
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