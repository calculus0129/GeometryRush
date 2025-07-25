import { Player } from "./Player";

export class Physics {
  params: Record<string, number>;
  constructor(params: Record<string, number>) {
    this.params = params;
  }

  updatePlayer(player: Player, deltaTime: number) {
    if (player.onGround) {
      player.vy = 0;
    } else {
      // Apply gravity
      player.vy += this.params.g * deltaTime;
    }

    // Update position
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;

    // Simple ground collision
    // if (player.y < 0) {
    //   player.y = 0;
    //   player.vy = 0;
    //   player.onGround = true;
    // }
  }
}
