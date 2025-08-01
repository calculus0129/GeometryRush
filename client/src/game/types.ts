export interface Bound {
  left: number;
  right: number;
  bottom: number;
  top: number;
}
export type GameState = "ready" | "active" | "dead" | "complete";
