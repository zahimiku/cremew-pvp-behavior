export class ProjectileList {

    /**
     * @description 配列の構造は [ projectileのid, ヒット時関数 ]が連なっている形
     */
    static list = [];

    /**
     * @description projectileとヒット時関数を登録する関数
     * @param {string} projectileId
     * @param {function} projectileFunc 
     */
    static register(projectileId, projectileFunc) {
        this.list.push([projectileId, projectileFunc]);
    };
}