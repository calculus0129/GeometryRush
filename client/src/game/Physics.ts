import { Player } from "./Player";
import { ParamType } from "./types";

export class Physics {
  params: ParamType;
  constructor(params: ParamType) {
    this.params = params;
  }

  updatePlayer(player: Player, deltaTime: number) {
    // Apply Acceleration
    // gravity
    if (!player.onGround) player.vy += this.params.g * deltaTime;
    // onGround Effect
    else {
      if (player.isJumping) {
        player.jump(this.params.vj);
      } else player.vy = 0;
    }

    // Update position
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;
  }
}
