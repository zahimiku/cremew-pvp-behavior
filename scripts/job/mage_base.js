import { EquipmentSlot, Player, ItemStack } from "@minecraft/server";
import { MageList } from "./mage_list";

/**
 * @description 継承用のclass
 */
export class MageBase {

    static register() {
        if (this.mageName && this !== MageBase) {
            MageList.register(this.mageName, this)
        };
    };

    /**
     * @description 魔法使い名（例：水魔法使い）
     */
    static mageName;

    /**
     * @description 魔法使いとしての概要・説明文
     */
    static mageDescription;

    /**
     * @description 武器のitemId
     */
    static weaponId;

    /**
     * @description leftClick内で使用する数値定数が入ったobject　説明をしっかり書こう
     */
    static leftClickStatus;

    /**
     * @description leftClick内で使用する数値定数が入ったobject　説明をしっかり書こう
     */
    static rightClickStatus;

    /**
     * @description leftClick内で使用する数値定数が入ったobject　説明をしっかり書こう
     */
    static sneakLeftClickStatus;

    /**
     * @description leftClick内で使用する数値定数が入ったobject　説明をしっかり書こう
     */
    static sneakRightClickStatus;

    /**
     * @description 左クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static leftClick(player) { };

    /**
     * @description 右クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static rightClick(player) { };

    /**
     * @description しゃがみ左クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static sneakLeftClick(player) { };

    /**
     * @description しゃがみ右クリック時に発動する関数 playerを入れない場合、説明文を返す
     * @param {Player} player 
     */
    static sneakRightClick(player) { };

    /**
     * @description 対応した武器を持っているかチェックする関数
     * @param {Player | ItemStack} value
     * @returns 
     */
    static checkMainhand(value) {
        if (value instanceof Player) return value.getComponent("equippable").getEquipment(EquipmentSlot.Mainhand)?.typeId === this.weaponId; 
        else return value?.typeId === this.weaponId;
    };

    /**
     * @description click系の関数への橋渡しをする関数　詳しくは使用箇所を参照
     * @param {Player} player 
     * @param {ItemStack} itemStack 
     * @param {string} interact 
     */
    static interact(player, itemStack, interact) {
        if (this.checkMainhand(itemStack) && typeof this[interact] === "function") {
            this[interact](player);
        };
    }
};