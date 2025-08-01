import { Bound } from "./types";

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  onGround: boolean;
  rotation: number;
  initialX: number;
  initialY: number;
  isJumping: boolean;

  constructor(x: number, y: number, width: number, height: number, v0: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = v0;
    this.vy = 0;
    this.onGround = true;
    this.rotation = 0; // For future use

    // Store initial position for reset
    this.initialX = x;
    this.initialY = y;
    this.isJumping = false;

    console.log("Player created at position:", x, y);
  }

  jump(jumpVelocity: number) {
    // if (this.onGround) {
    this.vy = jumpVelocity;
    this.onGround = false;
    console.log("Player jumped with velocity:", jumpVelocity);
    // }
  }

  reset(x: number | undefined, y: number | undefined) {
    this.x = x || this.initialX;
    this.y = y || this.initialY;
    this.isJumping = false;
    // this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.rotation = 0;
    console.log("Player reset to position:", this.x, this.y);
  }

  getBounds(): Bound {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y + this.height,
      bottom: this.y,
    };
  }
}
