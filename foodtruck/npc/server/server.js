import * as alt from 'alt-server';

alt.log("[TEST] Server-Skript gestartet!");

alt.on('start', () => {
    const npc = new alt.Ped(
        1057201338, // Hash für A_M_M_FatLatin_01
        new alt.Vector3(0, 0, 72), // Einfache Position (Mount Chiliad)
        new alt.Vector3(0, 0, 0)
    );
    alt.log("[TEST] NPC gespawnt!");
});