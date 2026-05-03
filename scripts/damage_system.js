import { Entity, EntityDamageCause } from "@minecraft/server";
import { assertNumber, setActionBar } from "./function";
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
            entity.applyDamage(0.000001, { cause: EntityDamageCause.override });
            entity.hp -= finalDamage;
            setActionBar(entity);
            deathCheak(entity, source);
        }
    };
    /**
     * @description ヒールを与える関数
     * @param {Entity} entity ヒールを受けるentity
     * @param {number} baseHeal 与えるヒールのベース
     * @param {Entity} source ヒールを与えるentity
     */
    static applyHeal(entity, baseHeal, source) {
        assertNumber(baseHeal, "[baseHeal]" + entity.name);

        const finalHeal = this.getFinalHeal(entity, baseHeal);
        assertNumber(finalHeal, "[finalHeal]" + entity.name);
        assertNumber(entity.hp, "[entity.hp]" + entity.name);

        if (Number.isFinite(entity.hp) && entity.hp > 0 && entity?.getGameMode() !== "spectator") {
            entity.hp = Math.min(100, entity.hp + finalHeal);
            setActionBar(entity);
        }
    };

    static deathCheak(entity, source) {
        if (Number.isFinite(entity.hp) && entity.hp <= 0) {
            new DeathSystem(entity, source);
        }
    };
}