export class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.rotation = 0; // For future use
    
    // Store initial position for reset
    this.initialX = x;
    this.initialY = y;
    
    console.log('Player created at position:', x, y);
  }
  
  jump(jumpVelocity) {
    if (this.onGround) {
      this.vy = jumpVelocity;
      this.onGround = false;
      console.log('Player jumped with velocity:', jumpVelocity);
    }
  }
  
  reset(x, y) {
    this.x = x || this.initialX;
    this.y = y || this.initialY;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.rotation = 0;
    console.log('Player reset to position:', this.x, this.y);
  }
  
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y + this.height,
      bottom: this.y
    };
  }
}
