import {
    world,
    system
} from "@minecraft/server";
import { MageList } from "./job/mage_list";
import {} from "./job/mage_base";
import { WaterMage } from "./job/water_mage";
import {} from "./damage_system";
import {} from "./function";
import { ProjectileList } from "./projectile_list";

world.afterEvents.worldLoad.subscribe(ev => {
    console.warn("loaded")
})

world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;
    const job = MageList.get(source);

    if (!source.isSneaking) {
        const interact = "rightClick";
        job?.interact(source, itemStack, interact);
    }
    else {
        const interact = "sneakRightClick";
        job?.interact(source, itemStack, interact);
    }
    if (itemStack.typeId === "minecraft:diamond") source.setDynamicProperty("job", WaterMage.mageName);
    else if (itemStack.typeId === "minecraft:iron_ingot") source.setDynamicProperty("job");
});

world.afterEvents.playerSwingStart.subscribe(ev => {
    const { heldItemStack, player, swingSource } = ev;
    const job = MageList.get(player);

    if (!player.isSneaking) {
        const interact = "leftClick";
        job?.interact(player, heldItemStack, interact);
    }
    else {
        const interact = "sneakLeftClick";
        job?.interact(player, heldItemStack, interact);
    }
});

world.afterEvents.projectileHitEntity.subscribe(ev => {
    const { dimension, hitVector, location, projectile, source } = ev;
    const entity = ev.getEntityHit().entity;
    const result = ProjectileList.get(projectile.typeId);
    if (result) {
        result.func(ev, entity);
    }
});

world.afterEvents.projectileHitBlock.subscribe(ev => {
    const { dimension, hitVector, location, projectile, source } = ev;
    const result = ProjectileList.get(projectile.typeId);
    if (result && result.ground) {
        result.func(ev);
    }
});

world.afterEvents.playerSpawn.subscribe(ev => {
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        player.onScreenDisplay.setHudVisibility(0, [1, 6, 7, 8, 10]);
    }
    player.hp = 100;
    player.mp = 100;
});

system.runInterval(() => {
    const players = world.getAllPlayers();
    for (const player of players) {
        player.onScreenDisplay.setActionBar(`h_100H__25m_100M_100s_099S__75すぴぬてんさい§@`);
    }
});