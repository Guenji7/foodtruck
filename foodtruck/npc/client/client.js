import * as alt from 'alt-client';
import * as native from 'natives';

alt.log('==================================================');
alt.log('[FOODTRUCK] Client-Script wird geladen');
alt.log('==================================================');

// Handler für neue Entities
alt.on('gameEntityCreate', (entity) => {
    if (entity instanceof alt.Ped) {
        alt.log('[FOODTRUCK] Neuer Ped erkannt:', entity.id);
        
        try {
            // Basis-Setup
            native.freezeEntityPosition(entity, true);
            native.setEntityInvincible(entity, true);
            
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

alt.on('resourceStart', () => {
    alt.log('[FOODTRUCK] Client-Resource wurde gestartet');
});