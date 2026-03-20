import { Entity, Player, system } from "@minecraft/server";

/**
 * @description 有限数か確認する関数、有限数じゃない場合処理を止める（stringの"123"なども処理を止めてしまう）
 * @param {*} value 確認する数値
 * @param {*} name どこでエラーが出たか確認する識別子
 */
export function assertNumber(value, name) {
    if (!Number.isFinite(value)) {
        throw new Error(`${name} is not a number`);
    };
};

/**
 * @description entity1とentity2のteamが違う場合にtrueを返す
 * @param {Entity} entity1 
 * @param {Entity} entity2 
 * @returns 
 */
export function isEnemy(entity1, entity2) {
    return entity1?.team != null && entity2?.team != null && entity1.team !== entity2.team;
};

/**
 * @description playerのmpがvalue以上か見る関数
 * @param {Player} player 
 * @param {number} value 
 * @returns 
 */
export function mpCheck(player, value) {
    return player?.mp != null && player.mp >= value;
};

/**
 * @description playerのmpを変更する関数、必ずmpCheckと一緒に使おう
 * @param {Player} player 
 * @param {number} value 
 */
export function changeMp(player, value) {
    player.mp += value;
};

/**
 * @description playerのclickなどのCTが完了しているかを確認する関数
 * @param {Player} player 
 * @param {string} id
 * @returns 
 */
export function ctCheck(player, id) {
    return system.currentTick - (player[id] ?? 0) > 0;
};

/**
 * @description playerのclickなどのCTを開始する関数
 * @param {Player} player 
 * @param {string} id 
 * @param {number} time 
 */
export function startCt(player, id, time) {
    player[id] = system.currentTick + time;
};