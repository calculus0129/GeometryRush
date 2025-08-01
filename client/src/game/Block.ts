import { Bound } from "./types";

export class Block {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x: number, y: number, width: number = 8, height: number = 8) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
