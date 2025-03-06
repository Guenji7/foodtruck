import * as alt from 'alt-server';

alt.log("[FOODTRUCK] Server-Skript gestartet!");

// Bessere Position (Legion Square)
const SPAWN_POSITION = {
    x: 90.80,
    y: 298.54,
    z: 110.211
};

// Globale Variable für unseren NPC
let globalNPC = null;

alt.on('resourceStart', (resourceName) => {
    if (resourceName !== 'foodtruck') {
        alt.log(`[FOODTRUCK] Anderer Resource Start: ${resourceName}`);
        return;
    }
    
    alt.log(`[FOODTRUCK] Ressource foodtruck startet...`);
    
    try {
        // Versuche zuerst alle existierenden NPCs zu zählen
        const existingPeds = alt.Ped.all;
        alt.log(`[FOODTRUCK] Existierende NPCs vor Spawn: ${existingPeds.length}`);
        
        // Model Hash als String (beide Varianten testen)
        const pedModel = 'a_m_m_fatlatin_01';
        const pedHash = alt.hash(pedModel);
        
        alt.log(`[FOODTRUCK] Versuche NPC zu spawnen mit Model: ${pedModel} (Hash: ${pedHash})`);
        alt.log(`[FOODTRUCK] Position: X: ${SPAWN_POSITION.x}, Y: ${SPAWN_POSITION.y}, Z: ${SPAWN_POSITION.z}`);
        
        // Erstelle den NPC
        globalNPC = new alt.Ped(
            pedHash,
            new alt.Vector3(SPAWN_POSITION.x, SPAWN_POSITION.y, SPAWN_POSITION.z),
            new alt.Vector3(0, 0, 0)
        );
        
        // Sofortige Überprüfung
        if (globalNPC && globalNPC.valid) {
            alt.log(`[FOODTRUCK] NPC erfolgreich erstellt! ID: ${globalNPC.id}`);
            
            // Versuche die Position zu setzen
            globalNPC.pos = new alt.Vector3(SPAWN_POSITION.x, SPAWN_POSITION.y, SPAWN_POSITION.z);
            
            // Überprüfe die tatsächliche Position
            const actualPos = globalNPC.pos;
            alt.log(`[FOODTRUCK] Tatsächliche NPC Position: X: ${actualPos.x}, Y: ${actualPos.y}, Z: ${actualPos.z}`);
        } else {
            alt.log(`[FOODTRUCK] FEHLER: NPC wurde erstellt aber ist nicht valid!`);
        }
        
        // Zähle nochmal alle NPCs
        const newPedCount = alt.Ped.all.length;
        alt.log(`[FOODTRUCK] NPCs nach Spawn: ${newPedCount}`);
        
    } catch (error) {
        alt.log(`[FOODTRUCK] KRITISCHER FEHLER beim Spawnen: ${error.message}`);
        alt.log(`[FOODTRUCK] Stack Trace: ${error.stack}`);
    }
});

// Regelmäßige Überprüfung des NPC-Status
alt.setInterval(() => {
    try {
        const peds = alt.Ped.all;
        alt.log(`[FOODTRUCK] Periodische Überprüfung - Gefundene NPCs: ${peds.length}`);
        
        if (globalNPC) {
            alt.log(`[FOODTRUCK] Global NPC Status: Valid=${globalNPC.valid}, ID=${globalNPC.id}`);
            if (globalNPC.pos) {
                const pos = globalNPC.pos;
                alt.log(`[FOODTRUCK] NPC Position: X: ${pos.x}, Y: ${pos.y}, Z: ${pos.z}`);
            }
        } else {
            alt.log(`[FOODTRUCK] Global NPC ist null!`);
        }
        
    } catch (error) {
        alt.log(`[FOODTRUCK] Fehler in der Überprüfung: ${error.message}`);
    }
}, 10000); // Alle 10 Sekunden

// Event Handler für NPC Destruktion
alt.on('pedDestroy', (ped) => {
    alt.log(`[FOODTRUCK] NPC wurde zerstört! ID: ${ped.id}`);
});

// Cleanup bei Resource Stop
alt.on('resourceStop', (resourceName) => {
    if (resourceName === 'foodtruck') {
        alt.log(`[FOODTRUCK] Resource wird gestoppt...`);
        if (globalNPC && globalNPC.valid) {
            alt.log(`[FOODTRUCK] Versuche NPC zu entfernen...`);
            globalNPC.destroy();
        }
    }
});