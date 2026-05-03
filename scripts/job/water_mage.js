import { Player, system, Entity, Dimension, Vector3, MolangVariableMap, TicksPerSecond } from "@minecraft/server";
import { MageBase } from "./mage_base";
import { DamageSystem } from "../damage_system";
import { changeMp, ctCheck, customEntity, customSpawnParticle, mpCheck, startCt, upDirectionY } from "../function";
import { ProjectileList } from "../projectile_list";
import { SpeedSystem } from "../game/speed_system";
import { GameList } from "../game/game_list";

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
        SpeedSystem.setList(this.rightClickStatus.speedUpId, this.rightClickStatus.speedUp);
        SpeedSystem.setList(this.rightClickStatus.speedDownId, -this.rightClickStatus.speedDown);
    };

    static get leftClickStatus() {
        return {
            /** @description 発射体のid */
            mcid: "cremew:water_ball",
            /** @description ダメージ */
            damage: 24,
            /** @description 消費MP */
            mp: 2,
            /** @description 直撃ダメージ乗数　*/
            hitMultiplier: 1.5,
            /** @description 爆発範囲　*/
            scale: 1.5,
            /** @description 最大存在時間(tick)　*/
            time: 20,
            /** @description クールタイム(tick) */
            cooltime: 20
        }
    };

    static leftClick(player) {
        const status = this.leftClickStatus;
        if (player) {
            if (this.checkMainhand(player) && mpCheck(player, status.mp) && ctCheck(player, this.leftClick.name)) {
                changeMp(player, -status.mp);
                startCt(player, this.leftClick.name, status.cooltime);
                const head = player.getHeadLocation();
                const entity = player.dimension.spawnEntity(status.mcid, head);
                customEntity(player, entity);
                const projectile = entity.getComponent("projectile");
                projectile.owner = player;
                projectile.shoot(player.getViewDirection());
                player.dimension.playSound("bucket.fill_water", head, { pitch: 1.5, volume: 1 });
                system.runTimeout(() => {
                    if (entity.isValid) {
                        this.waterBallExplosion({ dimension: player.dimension, location: entity.location, projectile: entity, source: player });
                    };
                }, status.time);
            };
        }
        else {
            return `<通常攻撃>
基礎ダメージ : ${status.damage}
消費MP : ${status.mp}
何かに衝突するか${status.time / TicksPerSecond}秒経つと爆発し、敵にダメージを与える<水球>を放つ
敵に<水球>が直撃するとその敵に${status.hitMultiplier}倍のダメージを与える
クールタイム : ${status.cooltime / TicksPerSecond}秒`
        };
    };

    /**
     * 
     * @param {{dimension: Dimension, location: Vector3, projectile: Entity, source: Entity}} ev projectile系のeventはそのまま入れることも可
     * @param {Entity} entity entityにhitした場合に限る
     * @returns 
     */
    static waterBallExplosion(ev, entity) {
        if (entity && !entity.isValid || !ev.projectile.isValid) return;

        let hit;
        if (entity) {
            if (!GameList.isEnemy(ev.source, entity)) return;
            hit = entity;
        }
        ev.projectile.remove();

        ev.dimension.playSound("mob.dolphin.splash", ev.location, { pitch: 1.3, volume: 1.2 });
        const molang = new MolangVariableMap();
        customSpawnParticle(ev.source, "cremew:water_explosion", ev.location, molang);

        const status = this.leftClickStatus;

        for (const explosionEntity of ev.dimension.getEntities({ location: ev.location, maxDistance: status.scale, families: ["player"], excludeGameModes: ["Spectator", "Creative", "Survival"] })) {
            if (GameList.isEnemy(ev.source, explosionEntity)) {
                let damage = status.damage;
                if (explosionEntity.id === hit?.id) damage *= status.hitMultiplier;

                DamageSystem.applyDamage(explosionEntity, damage, ev.source);
            }
        }
    };

    static get rightClickStatus() {
        return {
            /** @description particleのid */
            mcid: "cremew:water_area",
            /** @description 消費MP */
            mp: 18,
            /** @description 範囲　*/
            scale: 5,
            /** @description 味方への移動速度上昇(%)　*/
            speedUp: 0.35,
            /** @description 敵への移動速度低下(%)　*/
            speedDown: 0.2,
            /** @description 継続時間(tick)　*/
            time: 140,
            /** @description クールタイム(tick) */
            cooltime: 40,
            /** @description SpeedSystem用 */
            speedUpId: "waterUp",
            /** @description SpeedSystem用 */
            speedDownId: "waterDown",
            /** @description バフ・デバフ時間(tick) */
            buffTime: 6,
            /** @description 使用可能回数追加時間(tick) */
            rechargeTime: 340,
            /** @description 使用可能回数 */
            stock: 2
        }
    };

    static rightClick(player) {
        const status = this.rightClickStatus;
        if (player) {
            if (this.checkMainhand(player) && mpCheck(player, status.mp) && ctCheck(player, this.rightClick.name, 2, status.rechargeTime)) {
                changeMp(player, -status.mp);
                startCt(player, this.rightClick.name, status.cooltime, 2, status.rechargeTime);

                const loc = player.location;

                player.dimension.playSound("ambient.underwater.enter", loc, { pitch: 1, volume: 1 });
                const molang = new MolangVariableMap();
                molang.setFloat("time", status.time / TicksPerSecond);
                molang.setFloat("size", status.scale);
                customSpawnParticle(player, "cremew:water_area", upDirectionY(loc), molang);

                let i = 0;
                const run = system.runInterval(() => {
                    if (!(i % 10)) {
                        player.dimension.playSound("bubble.downinside", loc, { pitch: 0.9, volume: 1 });
                    }
                    i++;
                    for (const target of player.dimension.getPlayers({ location: loc, maxDistance: status.scale, excludeGameModes: ["Spectator", "Creative", "Survival"] })) {
                        if (GameList.isEnemy(player, target)) SpeedSystem.addBuff(target, status.speedDownId, status.buffTime);
                        else SpeedSystem.addBuff(target, status.speedUpId, status.buffTime);
                    };
                }, 4);
                system.runTimeout(() => {
                    system.clearRun(run);
                }, status.time);
            };
        }
        else {
            return `<アビリティ>
消費MP : ${status.mp}
${status.time / TicksPerSecond}秒継続する<水の領域>を展開する
<水の領域>の範囲内の味方は、移動速度が${status.speedUp * 100}％上昇し
敵は、移動速度が${status.speedUp * 100}％低下する
クールタイム : ${status.cooltime / TicksPerSecond}秒
ストック : ${status.stock}
リチャージ : ${status.rechargeTime / TicksPerSecond}秒`
        };
    };
};