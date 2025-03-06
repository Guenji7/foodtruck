import * as alt from 'alt-client';
import * as native from 'natives';

alt.log('==================================================');
alt.log('[FOODTRUCK] Client-Script wird geladen');
alt.log('==================================================');

let isNearNPC = false;
const interactionDistance = 2.0; // Maximale Distanz für Interaktion

// Handler für neue Entities
alt.on('gameEntityCreate', (entity) => {
    if (entity instanceof alt.Ped) {
        alt.log('[FOODTRUCK] Neuer Ped erkannt:', entity.id);
        
        try {
            // Basis-Setup
            native.freezeEntityPosition(entity, true);
            native.setEntityInvincible(entity, true);
            native.setEntityDynamic(entity, false);
            native.setEntityCollision(entity, false, false);
            native.setBlockingOfNonTemporaryEvents(entity, true);
            native.setEntityAsMissionEntity(entity, true, true);
            native.setPedCanRagdoll(entity, false);
            native.setPedCanBeTargetted(entity, false);
            native.setPedFleeAttributes(entity, 0, false);
            native.setPedCombatAttributes(entity, 46, false);
            native.setEntityProofs(entity, true, true, true, true, true, true, true, true);
            
            // Hole die exakte Rotation aus den Metadaten
            const exactRotation = entity.getStreamSyncedMeta('exactRotation');
            if (exactRotation) {
                // Setze die Rotation über natives
                native.setEntityRotation(
                    entity,
                    exactRotation.x,
                    exactRotation.y,
                    exactRotation.z * (180 / Math.PI), // Konvertiere in Grad für natives
                    2, // rotationOrder (2 = YXZ)
                    true // p4
                );
                
                // Zusätzlicher Versuch über heading
                const heading = (-exactRotation.z * (180 / Math.PI) + 360) % 360;
                native.setEntityHeading(entity, heading);
                
                alt.log('[FOODTRUCK] Rotation gesetzt auf:', exactRotation.z);
            }
            
            // Marker und Blip Setup
            const blip = native.addBlipForEntity(entity);
            native.setBlipSprite(blip, 280);
            native.setBlipColour(blip, 2);
            native.setBlipScale(blip, 1.0);
            native.setBlipAsShortRange(blip, false);
            
            // Marker unter dem NPC
            alt.setInterval(() => {
                if (entity && entity.valid) {
                    const pos = entity.pos;
                    native.drawMarker(
                        1,
                        pos.x, pos.y, pos.z - 1.0,
                        0, 0, 0,
                        0, 0, 0,
                        1.0, 1.0, 1.0,
                        83, 0, 143, 100,
                        false,
                        false,
                        0,
                        false,
                        undefined,
                        undefined,
                        false
                    );

                    // Prüfe Distanz zum Spieler
                    const player = alt.Player.local;
                    const distance = distance2d(player.pos, pos);
                    
                    // Wenn Spieler in der Nähe ist
                    if (distance <= interactionDistance) {
                        if (!isNearNPC) {
                            isNearNPC = true;
                        }
                        // Zeige E-Prompt
                        drawText3d('', pos.x, pos.y, pos.z);
                    } else if (isNearNPC) {
                        isNearNPC = false;
                    }
                }
            }, 0);
            
        } catch(error) {
            alt.log('[FOODTRUCK] Fehler beim Ped Setup:', error);
        }
    }
});

// Event Handler für Rotation Updates
alt.on('streamSyncedMetaChange', (entity, key, value) => {
    if (key === 'exactRotation' && entity instanceof alt.Ped) {
        try {
            native.setEntityRotation(
                entity,
                value.x,
                value.y,
                value.z * (180 / Math.PI),
                2,
                true
            );
            native.setEntityHeading(entity, (-value.z * (180 / Math.PI) + 360) % 360);
        } catch(error) {
            alt.log('[FOODTRUCK] Fehler beim Update der Rotation:', error);
        }
    }
});

// Hilfsfunktion für 2D Distanz
function distance2d(pos1, pos2) {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

// Die drawText3d Funktion - nur der relevante Teil der client.js
function drawText3d(msg, x, y, z) {
    // Einzelne Zeile mit E links
    native.beginTextCommandDisplayHelp('STRING');
    native.addTextComponentSubstringPlayerName('Sprich mit ~p~Fat Joe~w~, um als ~p~Foodtrucker~w~ zu arbeiten.');
    native.endTextCommandDisplayHelp(2, false, false, -1);
    native.setFloatingHelpTextWorldPosition(1, x, y, z + 0.85);
    native.setFloatingHelpTextStyle(1, 1, 4, -1, 3, 1);
}

// Event Handler für Tastendrücke
alt.on('keyup', (key) => {
    if (key === 69 && isNearNPC) { // 69 ist der Keycode für 'E'
        alt.emit('foodtruck:openMenu');
        alt.log('[FOODTRUCK] Menu wurde geöffnet');
    }
});

// Event Handler für das Öffnen des Menüs
alt.on('foodtruck:openMenu', () => {
    alt.emit('webview:show'); // Dies würde Ihr HTML-Interface öffnen
});

alt.on('resourceStart', () => {
    alt.log('[FOODTRUCK] Client-Resource wurde gestartet');
});