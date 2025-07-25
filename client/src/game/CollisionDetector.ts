import { Block } from "./Block";
import { Player } from "./Player";
import { Spike } from "./Spike";
import { Bound } from "./types";

export class CollisionDetector {
  checkPlayerSpikeCollision(player: Player, spike: Spike) {
    const playerBounds = player.getBounds();
    const spikeBounds = spike.getCollisionBounds();
    
    return this.checkAABBCollision(playerBounds, spikeBounds);
  }
  
  checkPlayerBlockCollision(player: Player, block: Block) {
    const playerBounds = player.getBounds();
    const blockBounds = block.getBounds();
    
    return this.checkAABBCollision(playerBounds, blockBounds);
  }
  
  isPlayerOnBlock(player: Player, block: Block) {
    const playerBounds = player.getBounds();
    const blockBounds = block.getBounds();
    
    // Check if player is on top of the block
    return (
      playerBounds.bottom <= blockBounds.top + 1 && // Small tolerance
      playerBounds.bottom >= blockBounds.top - 1 &&
      playerBounds.right > blockBounds.left &&
      playerBounds.left < blockBounds.right
    );
  }
  
  getPlayerBlockCollisionType(player: Player, block: Block) {
    const playerBounds = player.getBounds();
    const blockBounds = block.getBounds();
    
    const overlapX = Math.min(playerBounds.right, blockBounds.right) - Math.max(playerBounds.left, blockBounds.left);
    const overlapY = Math.min(playerBounds.top, blockBounds.top) - Math.max(playerBounds.bottom, blockBounds.bottom);
    
    if (overlapX < overlapY) {
      // Horizontal collision
      return 'side';
    } else {
      // Vertical collision
      if (player.vy <= 0) {
        return 'top'; // Player landing on block
      } else {
        return 'bottom'; // Player hitting block from below
      }
    }
  }
  
  checkAABBCollision(bounds1: Bound, bounds2: Bound) {
    return (
      bounds1.left < bounds2.right &&
      bounds1.right > bounds2.left &&
      bounds1.bottom < bounds2.top &&
      bounds1.top > bounds2.bottom
    );
  }
}
