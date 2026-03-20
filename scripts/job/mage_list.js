import { Player } from "@minecraft/server";

/**
 * @description DynamicPropertyで使う魔法使い名とclassを紐づけるclass
 */
export class MageList {

    /** @type {Map<string, any>} */
    static map = new Map();

    /**
     * @description DynamicPropertyで使う魔法使い名とclassを登録する関数
     * @param {string} mageName 
     * @param {class} mageClass 
     */
    static register(mageName, mageClass) {
        if (!mageName) {
            throw new Error("mageName is required");
        }

        if (this.map.has(mageName)) {
            console.warn(`Mage already registered: ${mageName}`);
        }

        this.map.set(mageName, mageClass);
    };

    /**
     * @description 魔法使いのclassをstring、もしくはPlayerから取得
     * @param {string | Player} mageName
     * @returns {any | undefined}
     */
    static get(mageName) {
        if (mageName instanceof Player) return this.map.get(mageName.getDynamicProperty("job"));
        else return this.map.get(mageName);
    }

    /**
     * @description 魔法使いが登録されているか
     * @param {string} mageName
     * @returns 
     */
    static has(mageName) {
        return this.map.has(mageName);
    }
};