export class Physics {
  constructor(params) {
    this.params = params;
  }
  
  updatePlayer(player, deltaTime) {
    // Apply gravity
    player.vy += this.params.g * deltaTime;
    
    // Update position
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;
    
    // Simple ground collision
    if (player.y < 0) {
      player.y = 0;
      player.vy = 0;
      player.onGround = true;
    }
  }
}
