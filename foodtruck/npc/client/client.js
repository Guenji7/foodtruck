import * as alt from 'alt-client';
import * as native from 'natives';

alt.log('==================================================');
alt.log('[FOODTRUCK] Client-Script wird geladen');
alt.log('==================================================');

// Handler für neue Entities
alt.on('gameEntityCreate', (entity) => {
    if (entity instanceof alt.Ped) {
        alt.log('[FOODTRUCK] Neuer Ped erkannt:', entity.id);
        alt.log('[FOODTRUCK] Ped Position:', entity.pos);
        
        try {
            // Basis-Setup für den Ped
            native.freezeEntityPosition(entity, true);
            native.setEntityInvincible(entity, true);
            
            // Bessere Sichtbarkeit
            const blip = native.addBlipForEntity(entity);
            native.setBlipSprite(blip, 280); // Anderes Blip-Symbol
            native.setBlipColour(blip, 2); // Grün
            native.setBlipScale(blip, 1.0);
            native.setBlipAsShortRange(blip, false); // Sichtbar aus größerer Entfernung
            
            // Füge einen Marker hinzu
            alt.setInterval(() => {
                if (entity && entity.valid) {
                    const pos = entity.pos;
                    native.drawMarker(
                        1, // MarkerType
                        pos.x, pos.y, pos.z - 1.0,
                        0, 0, 0, // Direction
                        0, 0, 0, // Rotation
                        1.0, 1.0, 1.0, // Scale
                        255, 255, 0, 100, // Color (Gelb)
                        false, // Bob up/down
                        false, // Face Camera
                        0, // p19
                        false, // Rotate
                        undefined, // TextureDict
                        undefined, // TextureName
                        false // DrawOnEnts
                    );
                }
            }, 0);
            
            alt.log('[FOODTRUCK] Ped Setup erfolgreich');
        } catch(error) {
            alt.log('[FOODTRUCK] Fehler beim Ped Setup:', error);
        }
    }
});

alt.on('resourceStart', () => {
    alt.log('[FOODTRUCK] Client-Resource wurde gestartet');
});