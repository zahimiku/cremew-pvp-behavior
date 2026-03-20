import { Player, system, Entity, Dimension, Vector3 } from "@minecraft/server";
import { MageBase } from "./mage_base";
import { DamageSystem } from "../damage_system";
import { changeMp, ctCheck, mpCheck, startCt } from "../function";
import { ProjectileList } from "../projectile_list";

/**
 * @description 水魔法使い用のclass
 */
export class WaterMage extends MageBase {
    constructor() { };
    static mageName = "水魔法使い";
    static weaponId = "cremew:blue_wand";

    static {
        this.register();
        ProjectileList.register(this.leftClickStatus.mcid, this.waterBallExplosion.bind(this), true);
    };

    static get leftClickStatus() {
        return {
            /** @description 発射体のid */
            mcid: "cremew:water_ball",
            /** @description 基礎ダメージ */
            damage: 20,
            /** @description 消費MP */
            mp: 2,
            /** @description 直撃ダメージ乗数　*/
            hitMultiplier: 1.5,
            /** @description 爆発範囲　*/
            scale: 1.5,
            /** @description 最大存在時間(tick)　*/
            time: 20,
            /** @description クールタイム(tick) */
            cooltime: 15
        }
    };

    static leftClick(player) {
        if (player) {
            if (this.checkMainhand(player) && mpCheck(player, this.leftClickStatus.mp) && ctCheck(player, this.leftClick.name)) {
                changeMp(player, -this.leftClickStatus.mp);
                startCt(player, this.leftClick.name, this.leftClickStatus.cooltime);
                const head = player.getHeadLocation();
                const entity = player.dimension.spawnEntity(this.leftClickStatus.mcid, head);
                const projectile = entity.getComponent("projectile");
                projectile.owner = player;
                projectile.shoot(player.getViewDirection());
                player.dimension.playSound("bucket.fill_water", head, { pitch: 1.5, volume: 1 });
                system.runTimeout(() => {
                    if (entity.isValid) {
                        this.waterBallExplosion({ dimension: player.dimension, location: entity.location, projectile: entity, source: player }, entity);
                    };
                }, this.leftClickStatus.time);
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

    /**
     * 
     * @param {{dimension: Dimension, location: Vector3, projectile: Entity, source: Entity}} ev projectile系のeventはそのまま入れることも可
     * @param {Entity} entity entityにhitした場合に限る
     * @returns 
     */
    static waterBallExplosion(ev, entity) {
        if (entity && !entity.isValid) return;


        ev.dimension.playSound("mob.dolphin.splash", ev.location,  { pitch: 1.3, volume: 1.2 });
        ev.dimension.playSound("mob.squid.ink_squirt", ev.location, { pitch: 1.6, volume: 0.5 });
        try {
            ev.dimension.spawnParticle("cremew:water_explosion", ev.location);
        } catch {

        };

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
        if (ev.projectile.isValid) {
            ev.projectile.remove();
        };
    };
};