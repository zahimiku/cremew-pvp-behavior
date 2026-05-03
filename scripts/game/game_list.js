import { Player } from "@minecraft/server";

/**
 * @description playerに対応するGameSystemのclassを管理するclass
 */
export class GameList {

    /** @type {Map<Player, any>} */
    static map = new Map();

    /**
     * @description
     * @param {Player} player 
     * @returns 
     */
    static get(player) {
        return GameList.map.get(player);
    }

    /**
     * @description
     * @param {Player} player 
     * @param {class} any
     */
    static set(player, any) {
        GameList.map.set(player, any);
    }

    /**
     * @description
     * @param {Player} player 
     * @returns 
     */
    static has(player) {
        return GameList.map.has(player);
    }

    /**
     * @description ゲームに参加しているplayerの視覚的エフェクトを制御するためにチームを得れる関数
     * @param {Player} player 
     * @returns 
     */
    static getAllVisiblePlayer(player) {
        const game = this.get(player);
        if (game.team1.includes(player)) return [[...game.team1, ...game.spectators1], [...game.team2, ...game.spectators2]];
        else if (game.team2.includes(player)) return [[...game.team2, ...game.spectators2], [...game.team1, ...game.spectators1]];
        else return;
    };

    static isEnemy(player, target) {
        const game = this.get(player);
        return ((game.team1.includes(player) && game.team2.includes(target)) || (game.team1.includes(target) && game.team2.includes(player)))
    };

    static isAlly(player, target) {
        const game = this.get(player);
        return ((game.team1.includes(player) && game.team1.includes(target)) || (game.team2.includes(target) && game.team2.includes(player)))
    };
};