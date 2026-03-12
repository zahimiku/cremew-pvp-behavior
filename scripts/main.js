import {
    world,
} from "@minecraft/server";

world.afterEvents.worldLoad.subscribe((Load) => {
    console.warn("loaded")
})

world.afterEvents.itemUse.subscribe((ev) => {
    const { source: player, itemStack: item } = ev;
    world.sendMessage(`[itemUse]${player.name} => ${item.typeId}`)
    }
)