export interface Bound {
  left: number;
  right: number;
  bottom: number;
  top: number;
}
export enum GameState {
  "READY",
  "ACTIVE",
  "DEAD",
  "COMPLETE",
}
export type BlockCollisionType = "top" | "side" | "bottom";
export interface ParamType {
  g: number; // Gravity (units/s²) - negative for downward
  v0: number; // Initial horizontal speed (units/s)
  vj: number; // Jump speed (units/s)
  wj: number;
}
