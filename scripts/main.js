import {
    world,
    system
} from "@minecraft/server";

world.afterEvents.worldLoad.subscribe((Load) => {
    console.warn("loaded")
})

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack: item } = ev;
    world.sendMessage(`[itemUse]${player.name} => ${item.typeId}`)
    if (item.typeId === "minecraft:stick") {
        const entity = player.dimension.spawnEntity("cremew:water_ball", player.getHeadLocation());
        const projectile = entity.getComponent("projectile");
        projectile.owner = player;
        projectile.shoot(player.getViewDirection());
        system.runTimeout(() => {
            if (entity.isValid) { 
                player.dimension.spawnParticle("cremew:water_explosion", entity.location);
                entity.remove() };
        }, 20)
    };
})

system.runInterval(() => {
    const players = world.getAllPlayers();
    for (const player of players) {
        player.onScreenDisplay.setActionBar(`h_100H__25m_100M_100s_099S__75すぴぬてんさい§@`);
    }
});