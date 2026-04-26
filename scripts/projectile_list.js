export class ProjectileList {

    /**
     * @type {Map<string, any>} 
     * @description { projectileのid : { func: ヒット時関数, ground: hitBlockで発動するか否か }}
     */
    static map = new Map();

    /**
     * @description projectileとヒット時関数を登録する関数
     * @param {string} projectileId
     * @param {function} projectileFunc bindしてください
     * @param {boolean} ground
     */
    static register(projectileId, projectileFunc, ground) {
        if (!projectileId) {
            throw new Error("projectileId is required");
        }

        if (this.map.has(projectileId)) {
            console.warn(`Mage already registered: ${projectileId}`);
        }

        this.map.set(projectileId, { func: projectileFunc, ground: ground });
    };

    /**
     * @description projectileのclassを取得
     * @param {string} projectileId
     * @returns {any | undefined}
     */
    static get(projectileId) {
        return this.map.get(projectileId);
    }
}