import { Player } from "@minecraft/server";
import { GameList } from "./game_list";

/**
 * @description ゲームの進行をするclass
 */
export class GameSystem {
    /**
     * @param {Player[]} players 参加するプレイヤー
     * @param {boolean} rank ランク戦か否か
     */
    constructor(players, rank) {
        this.rank = rank;
        this.createTeam(players, rank);
        for (const player of players) {
            this.joinGame(player, false);
        };
    };

    spectators1 = [];
    spectators2 = [];
    round;
    result;

    /**
     * @description チームを振り分ける関数
     * @param {Player[]} players 
     * @param {boolean} rank 
     */
    createTeam(players, rank) {
        const copy = [...players];
        const newTeam = [];
        if (rank) {
            const newTeam2 = [];
            let power1 = 0;
            let power2 = 0;
            for (const player of copy) {
                player.rank = JSON.parse(player.getDynamicProperty("rank"))[player.getDynamicProperty("job")];
            };
            copy.sort((a, b) => b.rank - a.rank);
            for (const player of copy) {
                if ((power1 <= power2 || newTeam2.length === 1/*3*/) && newTeam.length !== 1/*3*/) {
                    newTeam.push(player);
                    power1 += player.rank;
                } else {
                    newTeam2.push(player);
                    power2 += player.rank;
                }
            };

            this.team1 = newTeam;
            this.team2 = newTeam2;
        }
        else {
            const length = Math.floor(players.length / 2);
            for (let i = 0; i < length; i++) {
                const random = Math.floor(Math.random() * copy.length);
                newTeam.push(copy[random]);
                copy.splice(random, 1);
            };

            this.team1 = copy;
            this.team2 = newTeam;
        }
    };

    /**
     * @description ゲームに参加（観戦含む）する際に実行する関数
     * @param {Player} player 
     * @param {boolean} spectator 
     */
    joinGame(player, spectator) {
        GameList.set(player, this);
    };
};