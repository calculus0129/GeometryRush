export class GameRenderer {
  constructor(ctx, camera) {
    this.ctx = ctx;
    this.camera = camera;
    this.canvas = ctx.canvas;
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  renderGround() {
    // Render ground line
    const groundY = this.camera.worldToScreen(0, 0, this.canvas.width, this.canvas.height).y;
    
    this.ctx.strokeStyle = '#4a4a4a';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, groundY);
    this.ctx.lineTo(this.canvas.width, groundY);
    this.ctx.stroke();
  }
  
  renderPlayer(player) {
    if (!this.camera.isInView(player.x, player.y, player.width, player.height)) {
      return;
    }
    
    const screenPos = this.camera.worldToScreen(player.x, player.y, this.canvas.width, this.canvas.height);
    const screenSize = this.camera.worldToScreenSize(player.width, player.height, this.canvas.width, this.canvas.height);
    
    // Draw player as blue cube
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.strokeStyle = '#2c5aa0';
    this.ctx.lineWidth = 2;
    
    this.ctx.fillRect(screenPos.x, screenPos.y - screenSize.height, screenSize.width, screenSize.height);
    this.ctx.strokeRect(screenPos.x, screenPos.y - screenSize.height, screenSize.width, screenSize.height);
  }
  
  renderSpike(spike) {
    if (!this.camera.isInView(spike.x, spike.y, spike.width, spike.height)) {
      return;
    }
    
    const screenPos = this.camera.worldToScreen(spike.x, spike.y, this.canvas.width, this.canvas.height);
    const screenSize = this.camera.worldToScreenSize(spike.width, spike.height, this.canvas.width, this.canvas.height);
    
    // Draw spike as red triangle
    this.ctx.fillStyle = '#e74c3c';
    this.ctx.strokeStyle = '#c0392b';
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(screenPos.x, screenPos.y); // Bottom left
    this.ctx.lineTo(screenPos.x + screenSize.width, screenPos.y); // Bottom right
    this.ctx.lineTo(screenPos.x + screenSize.width / 2, screenPos.y - screenSize.height); // Top center
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw collision box for debugging (optional)
    if (false) {
      const collisionPos = this.camera.worldToScreen(spike.collisionX, spike.collisionY, this.canvas.width, this.canvas.height);
      const collisionSize = this.camera.worldToScreenSize(spike.collisionWidth, spike.collisionHeight, this.canvas.width, this.canvas.height);
      
      this.ctx.strokeStyle = '#ff0000';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(collisionPos.x, collisionPos.y - collisionSize.height, collisionSize.width, collisionSize.height);
    }
  }
  
  renderBlock(block) {
    if (!this.camera.isInView(block.x, block.y, block.width, block.height)) {
      return;
    }
    
    const screenPos = this.camera.worldToScreen(block.x, block.y, this.canvas.width, this.canvas.height);
    const screenSize = this.camera.worldToScreenSize(block.width, block.height, this.canvas.width, this.canvas.height);
    
    // Draw block as gray cube
    this.ctx.fillStyle = '#7f8c8d';
    this.ctx.strokeStyle = '#34495e';
    this.ctx.lineWidth = 2;
    
    this.ctx.fillRect(screenPos.x, screenPos.y - screenSize.height, screenSize.width, screenSize.height);
    this.ctx.strokeRect(screenPos.x, screenPos.y - screenSize.height, screenSize.width, screenSize.height);
  }
  
  renderFinishLine(x) {
    if (!this.camera.isInView(x, 0, 1, 20)) {
      return;
    }
    
    const screenPos = this.camera.worldToScreen(x, 0, this.canvas.width, this.canvas.height);
    const topPos = this.camera.worldToScreen(x, 20, this.canvas.width, this.canvas.height);
    
    // Draw finish line as checkered pattern
    this.ctx.strokeStyle = '#f39c12';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([10, 10]);
    
    this.ctx.beginPath();
    this.ctx.moveTo(screenPos.x, screenPos.y);
    this.ctx.lineTo(topPos.x, topPos.y);
    this.ctx.stroke();
    
    this.ctx.setLineDash([]); // Reset line dash
  }
}
