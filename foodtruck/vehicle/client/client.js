import * as alt from 'alt-client';
import * as native from 'natives';

alt.log('==================================================');
alt.log('[FOODTRUCK] Vehicle Client-Script wird geladen');
alt.log('==================================================');

// Handler für neue Fahrzeuge
alt.on('gameEntityCreate', (entity) => {
    if (entity instanceof alt.Vehicle) {
        alt.log('[FOODTRUCK] Neues Fahrzeug erkannt:', entity.id);
        
        try {
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
                
                alt.log('[FOODTRUCK] Fahrzeug Rotation gesetzt auf:', exactRotation.z);
            }
            
            // Marker beim Fahrzeug
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
            alt.log('[FOODTRUCK] Fehler beim Fahrzeug Setup:', error);
        }
    }
});

// Event Handler für Rotation Updates
alt.on('streamSyncedMetaChange', (entity, key, value) => {
    if (key === 'exactRotation' && entity instanceof alt.Vehicle) {
        try {
            native.setEntityRotation(
                entity,
                value.x,
                value.y,
                value.z * (180 / Math.PI),
                2,
                true
            );
        } catch(error) {
            alt.log('[FOODTRUCK] Fehler beim Update der Fahrzeug-Rotation:', error);
        }
    }
});

alt.on('resourceStart', () => {
    alt.log('[FOODTRUCK] Vehicle Client-Resource wurde gestartet');
});