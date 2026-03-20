/**
 * @description DynamicPropertyで使う魔法使い名とclassを紐づけるclass
 */
export class MageList {

    /**
     * @description 配列の構造は [ 魔法使い名, 魔法使いのclass ]が連なっている形
     */
    static list = [];

    /**
     * @description DynamicPropertyで使う魔法使い名とclassを登録する関数
     * @param {string} mageName 
     * @param {class} mageClass 
     */
    static register(mageName, mageClass) {
        this.list.push([mageName, mageClass]);
    };
};