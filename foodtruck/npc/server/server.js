import * as alt from 'alt-server';

alt.log("[FOODTRUCK] Server-Skript gestartet!");

// Bessere Position (z.B. in der Nähe des Legion Square)
const SPAWN_POSITION = {
    x: 90.80,
    y: 298.54,
    z: 110.211
};

let globalNPC = null;

alt.on('resourceStart', (resourceName) => {
    if(resourceName !== 'foodtruck') return;
    
    alt.log(`[FOODTRUCK] Ressource ${resourceName} wird gestartet...`);
    
    try {
        // Verwenden des Ped-Models als String
        const pedModel = 'a_m_m_fatlatin_01';
        alt.log(`[FOODTRUCK] Versuche NPC zu spawnen mit Model: ${pedModel}`);
        
        globalNPC = new alt.Ped(
            pedModel, // String statt Hash
            new alt.Vector3(SPAWN_POSITION.x, SPAWN_POSITION.y, SPAWN_POSITION.z),
            new alt.Vector3(0, 0, 0)
        );

        if(globalNPC && globalNPC.valid) {
            alt.log(`[FOODTRUCK] NPC erfolgreich gespawnt! ID: ${globalNPC.id}`);
            alt.log(`[FOODTRUCK] NPC Position: ${JSON.stringify(globalNPC.pos)}`);
        } else {
            alt.log('[FOODTRUCK] NPC konnte nicht gespawnt werden!');
        }
    } catch(error) {
        alt.log(`[FOODTRUCK] Fehler beim Spawnen: ${error.message}`);
    }
});