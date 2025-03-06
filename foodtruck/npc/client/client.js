import * as alt from 'alt-client';

alt.log('[FOODTRUCK] Client-Skript geladen');

alt.on('streamSyncedMetaChange', (entity, key, value) => {
    if (entity instanceof alt.Ped) {
        alt.log(`[FOODTRUCK] Ped Update: ${entity.id} - ${key}: ${value}`);
    }
});