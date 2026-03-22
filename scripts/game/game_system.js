import { Player } from "@minecraft/server";

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
    };

    team1;
    team2;
    spectators;
    round;
    result;

    createTeam(players, rank) {
        const copy = [...players];
        const newTeam = [];
        if (rank) {
            for (const player of copy) {
                player.rank = JSON.parse(player.getDynamicProperty("rank"))[player.getDynamicProperty("job")];
            };
            copy.sort((a, b) => b.rank - a.rank);
            const length = Math.floor(players.length);
            for (let i = 0; i < length; i++) {
                newTeam.push(copy[random]);
                copy.splice(random, 1);
            };
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
};