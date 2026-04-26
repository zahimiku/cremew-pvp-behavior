import { system, world } from "@minecraft/server";

/**
 * @description playerのspeedに関するclass
 */
export class SpeedSystem {
    static defaultSpeed = 0.12;
    static maxSpeed = 0.2;
    static minSpeed = 0.08;
    static players = new Map();

    /**
     * @description スピードバフ、デバフのリスト
     */
    static list = {};

    static updateSpeed() {
        this.players.forEach((value, key) => {
            let speed = this.defaultSpeed;
            value.forEach((time, speedKey) => {
                if (time <= system.currentTick) value.delete(speedKey);
                else speed += this.defaultSpeed * (this.list[speedKey] ?? 1);
            });
            if (this.minSpeed > speed) speed = this.minSpeed;
            else if (this.maxSpeed < speed) speed = this.maxSpeed;
            key.getComponent("minecraft:movement").setCurrentValue(speed);
        });
    };

    /**
     * @description スピードのバフとデバフを付与する関数
     * @param {Player} player 
     * @param {string} name 
     * @param {number} time tick
     */
    static addBuff(player, name, time) {
        const buffList = this.players.get(player) ?? new Map();
        buffList.set(name, system.currentTick + time);
        this.players.set(player, buffList);
    };

    static resetBuff(player) {
        this.players.set(player, new Map());
    };

    static setList(name, speed) {
        if (!this.list[name]) {
            this.list[name] = speed;
        }
    };
};