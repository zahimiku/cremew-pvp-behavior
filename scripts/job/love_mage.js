import { Player, system, Entity, Dimension, Vector3, MolangVariableMap, TicksPerSecond } from "@minecraft/server";
import { MageBase } from "./mage_base";
import { addVector3, changeCt, changeMp, ctCheck, customEntity, customSpawnParticle, directionPlus, distanceVector3, mpCheck, multiVector3, southEastUpPlus, startCt } from "../function";
import { GameList } from "../game/game_list";
import { DamageSystem } from "../damage_system";
import { ProjectileList } from "../projectile_list";

/**
 * @description 恋魔法使い用のclass
 */
export class LoveMage extends MageBase {
    constructor() { };
    static mageName = "恋魔法使い";
    static weaponId = "cremew:pink_heart_wand";

    static {
        this.register();
        ProjectileList.register(this.rightClickStatus.mcid, this.loveGrenadeExplosion.bind(this), true);
    };

    static get leftClickStatus() {
        return {
            /** @description ダメージ・回復 */
            damage: 18,
            /** @description 消費MP */
            mp: 1,
            /** @description 範囲　*/
            scale: 2,
            /** @description 射程　*/
            range: 16,
            /** @description クールタイム(tick) */
            cooltime: 15
        }
    };

    static leftClick(player) {
        const status = this.leftClickStatus;
        if (player) {
            if (this.checkMainhand(player) && mpCheck(player, status.mp) && ctCheck(player, this.leftClick.name)) {
                changeMp(player, -status.mp);
                startCt(player, this.leftClick.name, status.cooltime);
                const head = player.getHeadLocation();
                const view = player.getViewDirection();
                let loc;
                let laycast = player.getEntitiesFromViewDirection({ maxDistance: status.range, families: ["player"], excludeGameModes: ["Spectator", "Creative", "Survival"] });
                if (laycast.length) {
                    loc = addVector3(multiVector3(view, laycast[0].distance), head);
                } else {
                    laycast = player.getBlockFromViewDirection({ maxDistance: status.range });
                    if (laycast) loc = addVector3(laycast.block.location, southEastUpPlus(laycast.faceLocation, laycast.face));

                    else loc = addVector3(head, multiVector3(view, status.range));
                };
                const length = distanceVector3(head, loc);

                const molang = new MolangVariableMap();
                molang.setVector3("vec", view);
                molang.setFloat("amount", Math.floor(length));
                customSpawnParticle(player, "cremew:heart_beam", head, molang);
                customSpawnParticle(player, "cremew:heart_explosion", laycast?.face ? directionPlus(loc, laycast.face) : loc, new MolangVariableMap());

                for (const explosionEntity of player.dimension.getEntities({ location: loc, maxDistance: status.scale, families: ["player"], excludeGameModes: ["Spectator", "Creative", "Survival"] })) {
                    if (GameList.isEnemy(player, explosionEntity)) {
                        DamageSystem.applyDamage(explosionEntity, status.damage, player);
                    }
                    else if (GameList.isAlly(player, explosionEntity)) {
                        DamageSystem.applyHeal(explosionEntity, status.damage, player);
                    };
                }
            };
        }
        else {
            return `<通常攻撃>
基礎ダメージ : ${status.damage}
消費MP : ${status.mp}
何かに衝突するか${status.range}m先で破裂する<ラブビーム>を放つ
破裂した<ラブビーム>は範囲内の敵にダメージを与え、味方には基礎ダメージ分の回復を与える
クールタイム : ${status.cooltime / TicksPerSecond}秒`
        };
    };


    static get rightClickStatus() {
        return {
            /** @description 発射体のid */
            mcid: "cremew:heart_grenade",
            /** @description ダメージ */
            damage: 25,
            /** @description 消費MP */
            mp: 25,
            /** @description ヒール乗数　*/
            healMultiplier: 2,
            /** @description 爆発範囲　*/
            scale: 3.5,
            /** @description ヒットした人数あたりのCT短縮時間(tick)　*/
            shortCooltime: 40,
            /** @description クールタイム(tick) */
            cooltime: 400
        }
    };

    static rightClick(player) {
        const status = this.rightClickStatus;
        if (player) {
            if (this.checkMainhand(player) && mpCheck(player, status.mp) && ctCheck(player, this.rightClick.name)) {
                changeMp(player, -status.mp);
                startCt(player, this.rightClick.name, status.cooltime);
                const head = player.getHeadLocation();
                const entity = player.dimension.spawnEntity(status.mcid, head);
                customEntity(player, entity);
                const projectile = entity.getComponent("projectile");
                projectile.owner = player;
                projectile.shoot(player.getViewDirection());
                player.dimension.playSound("mob.witch.throw", head, { pitch: 1, volume: 1 });
            };
        }
        else {
            return `<アビリティ>
基礎ダメージ : ${status.damage}
消費MP : ${status.mp}
何かに衝突すると弾ける<ラブグレネード>を投げる
弾けた<ラブグレネード>は敵にダメージを与え
味方には基礎ダメージの${status.healMultiplier}倍の回復を与える
ダメージか回復を与えた場合、当たった人数×${status.shortCooltime / TicksPerSecond}秒クールタイムが短縮される
クールタイム : ${status.cooltime / TicksPerSecond}秒`
        };
    };

    /**
     * 
     * @param {{dimension: Dimension, location: Vector3, projectile: Entity, source: Entity}} ev projectile系のeventはそのまま入れることも可
     * @returns 
     */
    static loveGrenadeExplosion(ev, entity) {
        if ((entity && !entity?.matches({ families: ["player"] })) || !ev.projectile.isValid) return;
        ev.projectile.remove();
        ev.dimension.playSound("random.explode", ev.location, { pitch: 2.1, volume: 1 });
        const molang = new MolangVariableMap();
        customSpawnParticle(ev.source, "cremew:heart_explosion_emitter", ev.location, molang);

        const status = this.rightClickStatus;

        let count = 0;
        for (const explosionEntity of ev.dimension.getEntities({ location: ev.location, maxDistance: status.scale, families: ["player"], excludeGameModes: ["Spectator", "Creative", "Survival"] })) {
            if (GameList.isEnemy(ev.source, explosionEntity)) {
                DamageSystem.applyDamage(explosionEntity, status.damage, ev.source);
                count += 1;
            }
            else if (GameList.isAlly(ev.source, explosionEntity)) {
                DamageSystem.applyHeal(explosionEntity, status.damage * status.healMultiplier, ev.source);
                count += 1;
            };
        }
        changeCt(ev.source, this.rightClick.name, -count * status.shortCooltime);
    };
}