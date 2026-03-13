import { EquipmentSlot } from "@minecraft/server";
import { MageBase } from "./mage_base";

/**
 * @description 水魔法使い用のclass
 */
export class WaterMage extends MageBase {
    constructor() { };
    static mage_name = "水魔法使い";
    static weapon_id = "cremew:blue_wand";

    static leftClick(player) {
        if (player) {
            const mainhand = player.getComponent("equippable").getEquipment(EquipmentSlot.Mainhand) ?? false;
        }
        else {
            return `<通常攻撃>
基礎ダメージ : 20
消費MP : 2
何かに衝突するか1秒経つと爆発する水球を放つ
敵に水球が衝突するとその敵に1.5倍のダメージを与える
クールタイム : 0.75秒`
        }
    };
}