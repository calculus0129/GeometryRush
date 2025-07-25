import { Bound } from "./types";

export class Spike {
  x: number;
  y: number;
  width: number;
  height: number;
  
  collisionWidth: number;
  collisionHeight: number;
  collisionX: number;
  collisionY: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    // Collision box (2x6 units centered at base)
    this.collisionWidth = 2;
    this.collisionHeight = 6;
    this.collisionX = x + (width - this.collisionWidth) / 2;
    this.collisionY = y;
  }
  
  getBounds(): Bound {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y + this.height,
      bottom: this.y
    };
  }
  
  getCollisionBounds(): Bound {
    return {
      left: this.collisionX,
      right: this.collisionX + this.collisionWidth,
      top: this.collisionY + this.collisionHeight,
      bottom: this.collisionY
    };
  }
}
