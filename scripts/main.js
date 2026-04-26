import {
    world,
    system,
    EntityDamageCause
} from "@minecraft/server";
import { MageList } from "./job/mage_list";
import { } from "./job/mage_base";
import { WaterMage } from "./job/water_mage";
import { } from "./damage_system";
import { } from "./function";
import { ProjectileList } from "./projectile_list";
import { SpeedSystem } from "./game/speed_system";
import { GameSystem } from "./game/game_system";

world.afterEvents.worldLoad.subscribe(ev => {
    console.log("loaded");
})

world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;
    const job = MageList.get(source);

    if (!source.isSneaking) {
        job?.interact(source, itemStack, "rightClick");
    }
    else {
        job?.interact(source, itemStack, "sneakRightClick");
    }
    if (itemStack.typeId === "minecraft:diamond") SpeedSystem.addBuff(source, "av", 30)//source.setDynamicProperty("job", WaterMage.mageName);
    else if (itemStack.typeId === "minecraft:iron_ingot") {
        new GameSystem(world.getAllPlayers());
    } //source.setDynamicProperty("job");
});

world.beforeEvents.entityHurt.subscribe(ev => {
    const { damage, damageSource, hurtEntity } = ev;
});

world.afterEvents.playerSwingStart.subscribe(ev => {
    const { heldItemStack, player, swingSource } = ev;
    const job = MageList.get(player);

    if (!player.isSneaking) {
        job?.interact(player, heldItemStack, "leftClick");
    }
    else {
        job?.interact(player, heldItemStack, "sneakLeftClick");
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
    player.m_hp = 100;
    player.mp = 100;
    player.m_mp = 100;
    player.sp = 20;
    player.m_sp = 150;
});

// 常時処理はここに
system.runInterval(() => {
    SpeedSystem.updateSpeed();
});

// world.afterEvents.entitySpawn.subscribe(ev => {
//     ev.entity.nameTag = "abcd"
//     world.sendMessage(`id: ${ev.entity.typeId}
// name: ${ev.entity.nameTag}`)
// });