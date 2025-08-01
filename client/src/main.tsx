import { Game } from './game/Game';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Canvas element not found or is not a HTMLCanvasElement');
  }

  const game = new Game(canvas);
  game.start();
});