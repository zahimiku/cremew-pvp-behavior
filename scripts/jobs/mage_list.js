/**
 * @description DynamicPropertyで使う魔法使い名とclassを紐づけるclass
 */
export class MageList {

    /**
     * @description 配列の構造は {name: 魔法使い名, class: 魔法使いのclass}が連なっている形
     */
    static list = [];

    /**
     * @description DynamicPropertyで使う魔法使い名とclassを登録する関数
     * @param {string} mage_name 
     * @param {class} mage_class 
     */
    static register(mage_name, mage_class) {
        this.list.push({name: mage_name, class: mage_class});
    };
};