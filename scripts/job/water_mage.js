import { Player, system } from "@minecraft/server";
import { MageBase } from "./mage_base";
import { DamageSystem } from "../damage_system";

/**
 * @description 水魔法使い用のclass
 */
export class WaterMage extends MageBase {
    constructor() { };
    static mageName = "水魔法使い";
    static weaponId = "cremew:blue_wand";

    static {

    };

    static leftClickStatus = {
        /** @description 基礎ダメージ */
        damage: 20,
        /** @description 消費MP */
        mp: 2,
        /** @description 直撃ダメージ乗数　*/
        hitMultiplier: 1.5,
        /** @description 爆発範囲　*/
        scale: 0.7,
        /** @description 最大存在時間(tick)　*/
        time: 20,
        /** @description クールタイム(tick) */
        cooltime: 15
    };

    static leftClick(player) {
        if (player) {
            if (this.checkMainhand(player)) {

            };
        }
        else {
            const status = this.leftClickStatus;
            return `<通常攻撃>
基礎ダメージ : ${status.damage}
消費MP : ${status.mp}
何かに衝突するか${status.time * system.currentTick}秒経つと爆発する水球を放つ
敵に水球が直撃するとその敵に${status.hitMultiplier}倍のダメージを与える
クールタイム : ${status.cooltime * system.currentTick}秒`
        };
    };

    static waterBallExplosion(ev, entity) {
        let hit;
        if (entity) {
            if (entity.team === (ev.source?.team ?? false)) return
            hit = entity;
        }
        
        for (const explosionEntity of ev.dimension.getEntities({ location: ev.location, maxDistance: this.leftClickStatus.scale, families: ["player"] })) {
            if (explosionEntity.team !== (ev.source?.team ?? explosionEntity.team) && explosionEntity.hp > 0) {
                let damage = this.leftClickStatus.damage;
                if (explosionEntity.id === hit?.id) damage *= this.leftClickStatus.hitMultiplier;

                DamageSystem.applyDamage(explosionEntity, damage, ev.source);
            }
        }
    };
};