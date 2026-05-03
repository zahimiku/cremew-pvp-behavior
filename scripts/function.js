import { Entity, Player, system } from "@minecraft/server";
import { GameList } from "./game/game_list";

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
    setActionBar(player);
};

/**
 * @description playerのclickなどのCTが完了しているかを確認する関数
 * @param {Player} player 
 * @param {string} id
 * @param {number?} maxStock
 * @param {number?} rechageTime 
 * @returns 
 */
export function ctCheck(player, id, maxStock, rechageTime) {
    const now = system.currentTick;
    const value = player[id];
    if (!maxStock) return now - (value ?? 0) > 0;
    else return ((now - (value?.ct ?? 0) > 0) && (value?.time ?? now) - now < rechageTime * (maxStock - 1));
};

/**
 * @description playerのclickなどのCTを開始する関数
 * @param {Player} player 
 * @param {string} id 
 * @param {number} time 
 * @param {number?} maxStock
 * @param {number?} rechageTime 
 */
export function startCt(player, id, time, maxStock, rechageTime) {
    const now = system.currentTick;
    if (!maxStock) player[id] = now + time;
    else player[id] = { time: Math.max((player[id]?.time ?? now), now) + rechageTime, ct: now + time };
};

/**
 * @description playerのclickなどのCTを短縮する関数
 * @param {Player} player 
 * @param {string} id 
 * @param {number} time 
 * @param {number?} maxStock
 */
export function changeCt(player, id, time, maxStock) {
    if (!maxStock) player[id] += time;
    else player[id] = { time: player[id]?.time + time, ct: player[id]?.ct + time };
};

/**
 * @description playerのactionbarを変更する関数 ステータス変更時に行うと良き
 * @param {Player} player 
 */
export function setActionBar(player) {
    player.onScreenDisplay.setActionBar(`h_${(((player.hp / player.m_hp) * 100 ?? 0).toFixed()).padStart(3, "0")}H_${((player.hp ?? 0).toFixed()).padStart(3, "_")}m_${(((player.mp / player.m_mp) * 100 ?? 0).toFixed()).padStart(3, "0")}M_${((player.mp ?? 0).toFixed()).padStart(3, "_")}s_${(((player.sp / player.m_sp) * 100 ?? 0).toFixed()).padStart(3, "0")}S_${((player.sp / player.m_sp * 100 ?? 0).toFixed()).padStart(3, "_")}§@`);
};

/**
 * @description チームが影響する場合のspawnParticle
 * @param {Player} player 起点となるプレイヤー
 * @param {*} particleId
 * @param {*} location 
 * @param {*} molang molang
 */
export function customSpawnParticle(player, particleId, location, molang) {
    const players = GameList.getAllVisiblePlayer(player);
    molang.setFloat("color", 0);
    for (const ally of players[0]) {
        try {
            ally.spawnParticle(particleId, location, molang);
        }
        catch { }
    }
    molang.setFloat("color", 1);
    for (const enemy of players[1]) {
        try {
            enemy.spawnParticle(particleId, location, molang);
        }
        catch { }
    }
};

/**
 * @description チームが影響する場合のEntityの処理
 * @param {Player} player 起点となるプレイヤー
 * @param {Entity} entity
 */
export function customEntity(player, entity) {
    const players = GameList.getAllVisiblePlayer(player);
    for (const ally of players[0]) {
        ally.setPropertyOverrideForEntity(entity, "cremew:team", 0);
    }
    for (const enemy of players[1]) {
        enemy.setPropertyOverrideForEntity(entity, "cremew:team", 1);
    }
};

export function upDirectionY(vector3) {
    vector3.y += 0.1;
    return vector3;
};

export function addVector3(vector3_1, vector3_2) {
    return { x: vector3_1.x + vector3_2.x, y: vector3_1.y + vector3_2.y, z: vector3_1.z + vector3_2.z };
};

export function minusVector3(vector3_1, vector3_2) {
    return { x: vector3_1.x - vector3_2.x, y: vector3_1.y - vector3_2.y, z: vector3_1.z - vector3_2.z };
};

export function multiVector3(vector3, number) {
    return { x: vector3.x * number, y: vector3.y * number, z: vector3.z * number };
};

export function distanceVector3(vector3_1, vector3_2) {
    return Math.abs(Math.sqrt(Math.pow(vector3_1.x - vector3_2.x, 2) + Math.pow(vector3_1.y - vector3_2.y, 2) + Math.pow(vector3_1.z - vector3_2.z, 2)));
};

export function southEastUpPlus(vector3, direction) {
    if (["South", "Up", "East"].includes(direction)) {
        if (!vector3.x) {
            vector3.x = 1;
        }
        else if (!vector3.y) {
            vector3.y = 1;
        }
        else if (!vector3.z) {
            vector3.z = 1;
        };
    };
    return vector3;
};

export function directionPlus(vector3, direction) {
    if ("South" === direction) return { x: vector3.x, y: vector3.y, z: vector3.z + 0.5 }
    else if ("North" === direction) return { x: vector3.x, y: vector3.y, z: vector3.z - 0.5 }
    else if ("East" === direction) return { x: vector3.x + 0.5, y: vector3.y, z: vector3.z }
    else if ("West" === direction) return { x: vector3.x - 0.5, y: vector3.y, z: vector3.z }
    else if ("Up" === direction) return { x: vector3.x, y: vector3.y + 0.5, z: vector3.z }
    else if ("Down" === direction) return { x: vector3.x, y: vector3.y - 0.5, z: vector3.z }
};