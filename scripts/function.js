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

/**
 * @description playerのactionbarを変更する関数 ステータス変更時に行うと良き
 * @param {Player} player 
 */
export function setActionBar(player) {
    player.onScreenDisplay.setActionBar(`h_${(((player.hp / player.m_hp) * 100 ?? 0).toFixed()).padStart(3, "0")}H_${((player.hp ?? 0).toFixed()).padStart(3, "_")}m_${(((player.mp / player.m_mp) * 100 ?? 0).toFixed()).padStart(3, "0")}M_${((player.mp ?? 0).toFixed()).padStart(3, "_")}s_${(((player.sp / player.m_sp) * 100 ?? 0).toFixed()).padStart(3, "0")}S_${((player.sp / player.m_sp * 100 ?? 0).toFixed()).padStart(3, "_")}§@`);
};

/**
 * @description チームが影響する場合のspawnParticle
 * @param {*} player 起点となるプレイヤー
 * @param {*} particleId
 * @param {*} location 
 * @param {*} molang molang
 */
export function customSpawnParticle(player, particleId, location, molang) {
    const players = GameList.getAllVisiblePlayer(player);
    molang.setFloat("color", 0);
    for (const ally of players[0]) {
        ally.spawnParticle(particleId, location, molang);
    }
    molang.setFloat("color", 1);
    for (const enemy of players[1]) {
        enemy.spawnParticle(particleId, location, molang);
    }
};

/**
 * @description チームが影響する場合のEntityの処理
 * @param {*} player 起点となるプレイヤー
 * @param {*} entity
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

export function upDirectionY(Vector3) {
    Vector3.y += 0.1;
    return Vector3;
}