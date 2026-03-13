import { EquipmentSlot, Player } from "@minecraft/server";

/**
 * @description 継承用のclass
 */
export class MageBase {
    constructor() {};

    /**
     * @description 魔法使い名（例：水魔法使い）
     */
    static mage_name;

    /**
     * @description 魔法使いとしての概要・説明文
     */
    static mage_des;

    /**
     * @description 武器のitemid
     */
    static weapon_id;

    /**
     * @description 左クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static leftClick(player) {};

    /**
     * @description 右クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static rightClick(player) {};

    /**
     * @description しゃがみ左クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static sneakLeftClick(player) {};

    /**
     * @description しゃがみ右クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static sneakRightClick(player) {};
    
    /**
     * @description 対応した武器を持っているかチェックする関数
     * @param {Player} player 
     * @returns 
     */
    checkMainhand(player) {
        if (player.getComponent("equippable").getEquipment(EquipmentSlot.Mainhand)?.typeId === this.weapon_id) return true 
        else return false;
    };
};