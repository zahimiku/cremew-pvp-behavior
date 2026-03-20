import { Entity } from "@minecraft/server";
import { assertNumber } from "./function";
import { DeathSystem } from "./game/death_system";

/**
 * @description damageに関するclass
 */
export class DamageSystem {
    /**
     * @description ダメージを与える関数
     * @param {Entity} entity ダメージを受けるentity
     * @param {number} baseDamage 与えるダメージのベース
     * @param {Entity} source ダメージを与えるentity
     */
    static applyDamage(entity, baseDamage, source) {
        assertNumber(baseDamage, "[baseDamage]" + entity.name);

        const finalDamage = this.getFinalDamage(entity, baseDamage);
        assertNumber(finalDamage, "[finalDamage]" + entity.name);
        assertNumber(entity.hp, "[entity.hp]" + entity.name);

        if (Number.isFinite(entity.hp) && entity.hp > 0 && entity?.getGameMode() !== "spectator") {
            entity.hp -= finalDamage;
            deathCheak(entity, source);
        }
    };


    static deathCheak(entity, source) {
        if (Number.isFinite(entity.hp) && entity.hp <= 0) {
            new DeathSystem(entity, source);
        }
    };
}