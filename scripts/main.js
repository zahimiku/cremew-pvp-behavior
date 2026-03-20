import {
    world,
    system
} from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.afterEvents.worldLoad.subscribe(ev => {
    console.warn("loaded")
})

world.afterEvents.itemUse.subscribe(ev => {
    const { source: player, itemStack: item } = ev;
    world.sendMessage(`[itemUse]${player.name} => ${item.typeId}`)
    if (item.typeId === "minecraft:stick") {
        const entity = player.dimension.spawnEntity("cremew:water_ball", player.getHeadLocation());
        //entity.addEffect("levitation", 60, {amplifier: 3, showParticles: false});
        const projectile = entity.getComponent("projectile");
        projectile.owner = player;
        projectile.shoot(player.getViewDirection());
        system.runTimeout(() => {
            if (entity.isValid) {
                try {
                    player.dimension.spawnParticle("cremew:water_explosion", entity.location);
                } catch {

                }
                entity.remove()
            };
        }, 20);
    };
});

world.afterEvents.projectileHitEntity.subscribe(ev => {
    const { dimension, hitVector, location, projectile, source } = ev;
    const entity = ev.getEntityHit().entity;
});

world.afterEvents.projectileHitBlock.subscribe(ev => {
    const { dimension, hitVector, location, projectile, source } = ev;
    world.sendMessage("aaa")
});

world.afterEvents.playerSpawn.subscribe(ev => {
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        player.onScreenDisplay.setHudVisibility(0, [1, 6, 7, 8, 10]);
    }
});

system.runInterval(() => {
    const players = world.getAllPlayers();
    for (const player of players) {
        player.onScreenDisplay.setActionBar(`h_100H__25m_100M_100s_099S__75すぴぬてんさい§@`);
    }
});