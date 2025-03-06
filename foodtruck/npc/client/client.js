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
            
            // Setze Blip für bessere Sichtbarkeit
            const blip = native.addBlipForEntity(entity);
            native.setBlipSprite(blip, 1);
            native.setBlipColour(blip, 2);
            
            alt.log('[FOODTRUCK] Ped Setup erfolgreich');
        } catch(error) {
            alt.log('[FOODTRUCK] Fehler beim Ped Setup:', error);
        }
    }
});

alt.on('resourceStart', () => {
    alt.log('[FOODTRUCK] Client-Resource wurde gestartet');
});