import { CollisionType } from "./CollisionDetector";
import { Bound } from "./types";

// To be used later.
class GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  colider: CollisionType | undefined;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colider?: CollisionType
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colider = colider;
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
