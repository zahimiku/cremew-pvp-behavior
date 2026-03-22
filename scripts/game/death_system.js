
export class DeathSystem {
    constructor(player, source) {
        player.setGameMode("spectator");
        player.inputPermissions.setPermissionCategory(2, false);
    };
}