import { Block } from "./Block";
import { Player } from "./Player";
import { Spike } from "./Spike";
import { BlockCollisionType, Bound } from "./types";

// To be used later.
export enum CollisionType {
  BLOCK,
  SPIKE,
}

export class CollisionDetector {
  checkPlayerSpikeCollision(player: Player, spike: Spike) {
    const playerBounds = player.getBounds();
    const spikeBounds = spike.getCollisionBounds();

    return this.checkAABBCollision(playerBounds, spikeBounds);
  }

  getPlayerBlockCollisionType(
    player: Player,
    block: Block
  ): BlockCollisionType | null {
    const playerBounds = player.getBounds();
    const blockBounds = block.getBounds();

    if (this.checkAABBCollision(playerBounds, blockBounds)) {
      // Toleranced block collision detection for onBlock part.
      const onBlock =
        playerBounds.bottom <= blockBounds.top + 1 && // Small tolerance
        playerBounds.bottom >= blockBounds.top - 1 &&
        playerBounds.right >= blockBounds.left &&
        playerBounds.left <= blockBounds.right;
      if (onBlock) return "top";
      else {
        const overlapX =
          Math.min(playerBounds.right, blockBounds.right) -
          Math.max(playerBounds.left, blockBounds.left);
        const overlapY =
          Math.min(playerBounds.top, blockBounds.top) -
          Math.max(playerBounds.bottom, blockBounds.bottom);

        if (overlapX < overlapY) {
          // Horizontal collision
          return "side";
        } else {
          // Vertical collision
          if (player.y > block.y + block.height) {
            return "top"; // Player landing on block
          } else {
            return "bottom"; // Player hitting block from below
          }
        }
      }
    } else {
      return null;
    }
  }

  checkAABBCollision(bounds1: Bound, bounds2: Bound) {
    return (
      bounds1.left <= bounds2.right &&
      bounds1.right >= bounds2.left &&
      bounds1.bottom <= bounds2.top &&
      bounds1.top >= bounds2.bottom
    );
  }
}
