import { Entity } from "@minecraft/server";

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