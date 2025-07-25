import { Player } from "./Player";
import { Spike } from "./Spike";
import { Block } from "./Block";
import { Camera } from "./Camera";
import { Physics } from "./Physics";
import { CollisionDetector } from "./CollisionDetector";
import { GameRenderer } from "./GameRenderer";
import { InputHandler } from "./InputHandler";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  params: {
    g: number; // Gravity (units/s²) - negative for downward
    v0: number; // Initial horizontal speed (units/s)
    vj: number; // Jump speed (units/s)
    wj: number;
  };
  gameState: string;
  restartCountdown: number;
  lastTime: number;
  player: Player;
  spikes: Spike[];
  blocks: Block[];
  camera: Camera;
  physics: Physics;
  collisionDetector: CollisionDetector;
  renderer: GameRenderer;
  inputHandler: InputHandler;

  // UI Element?
  gameStateElement: HTMLElement;
  playerPosElement: HTMLElement;
  onGroundElement: HTMLElement;
  
  gameOverlay: HTMLElement;
  overlayMessage: HTMLElement;
  countdownElement: HTMLElement;
  levelEnd: number = 0;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!; // The writer is not actually sure if this is not null.

    // Game parameters (configurable)
    this.params = {
      g: -18 * 8, // Gravity (units/s²) - negative for downward
      v0: 3 * 8, // Initial horizontal speed (units/s)
      vj: 9 * 8, // Jump speed (units/s)
      wj: 0, // Rotation speed (rad/s) - unused for now
    };

    // Game state
    this.gameState = "ready"; // 'ready', 'active', 'dead', 'complete'
    this.restartCountdown = 0;
    this.lastTime = 0;

    // Game objects
    this.player = new Player(0, 0, 8, 8, this.params.v0);
    this.spikes = [];
    this.blocks = [];
    this.camera = new Camera(-2 * 8, -1 * 8, 16 * 8, 9 * 8);

    // Game systems
    this.physics = new Physics(this.params);
    this.collisionDetector = new CollisionDetector();
    this.renderer = new GameRenderer(this.ctx, this.camera);
    this.inputHandler = new InputHandler();

    // Create level
    this.createLevel();

    // UI elements
    this.gameStateElement = document.getElementById("gameState")!;
    this.playerPosElement = document.getElementById("playerPos")!;
    this.onGroundElement = document.getElementById("onGround")!;
    this.gameOverlay = document.getElementById("gameOverlay")!;
    this.overlayMessage = document.getElementById("overlayMessage")!;
    this.countdownElement = document.getElementById("countdown")!;

    // Bind methods
    this.gameLoop = this.gameLoop.bind(this);
    this.handleInput = this.handleInput.bind(this);

    // Set up input handling
    this.inputHandler.onJump = this.handleInput;

    console.log("Game initialized");
  }

  createLevel() {
    // Create a simple level with obstacles
    // Ground blocks for platforms
    this.blocks.push(new Block(40, 0, 8, 8));
    this.blocks.push(new Block(48, 0, 8, 8));
    this.blocks.push(new Block(56, 0, 8, 8));

    this.blocks.push(new Block(80, 8, 8, 8));
    this.blocks.push(new Block(88, 8, 8, 8));

    this.blocks.push(new Block(120, 0, 8, 8));
    this.blocks.push(new Block(128, 0, 8, 8));

    // Spikes
    this.spikes.push(new Spike(64, 0, 8, 8));
    this.spikes.push(new Spike(72, 0, 8, 8));
    this.spikes.push(new Spike(96, 0, 8, 8));
    this.spikes.push(new Spike(104, 0, 8, 8));
    this.spikes.push(new Spike(112, 0, 8, 8));
    this.spikes.push(new Spike(136, 0, 8, 8));
    this.spikes.push(new Spike(144, 0, 8, 8));
    this.spikes.push(new Spike(152, 0, 8, 8));

    // End marker
    this.levelEnd = 180;
  }

  start() {
    console.log("Game started");
    this.gameState = "ready";
    this.updateUI();
    this.gameLoop();
  }

  restart() {
    console.log("Game restarted");
    this.player.reset(0, 0);
    this.gameState = "ready";
    this.restartCountdown = 0;
    this.gameOverlay.classList.add("hidden");
    this.updateUI();
  }

  handleInput() {
    if (this.gameState === "ready") {
      this.gameState = "active";
      this.updateUI();
    }

    if (this.gameState === "active") {
      // Check if player can jump (on ground or on block)
      if (this.isPlayerOnGround()) this.player.jump(this.params.vj);
    }
  }

  isPlayerOnGround() {
    return this.player.onGround;

    // Check if player is on ground (y <= 0)
    // if (this.player.y <= 0) {
    //   return true;
    // }

    // // Check if player is on top of a block
    // for (const block of this.blocks) {
    //   if (this.collisionDetector.isPlayerOnBlock(this.player, block)) {
    //     return true;
    //   }
    // }

    // return false;
  }

  gameLoop(currentTime = 0) {
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap at 60fps
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime: number) {
    if (this.gameState === "active") {
      // Update physics
      this.physics.updatePlayer(this.player, deltaTime);

      // Check ground collision
      if (this.player.y <= 0) {
        this.player.y = 0;
        this.player.vy = 0;
        this.player.onGround = true;
      } else {
        this.player.onGround = false;
      }

      // Check block collisions
      for (const block of this.blocks) {
        if (
          this.collisionDetector.checkPlayerBlockCollision(this.player, block)
        ) {
          // Player landed on block or crashed into it
          const collision = this.collisionDetector.getPlayerBlockCollisionType(
            this.player,
            block,
          );
          if (collision === "top") {
            this.player.y = block.y + block.height;
            this.player.vy = 0;
            this.player.onGround = true;
          } else if (collision === "side" || collision === "bottom") {
            this.crash();
            return;
          }
        }
      }

      // Check spike collisions
      for (const spike of this.spikes) {
        if (
          this.collisionDetector.checkPlayerSpikeCollision(this.player, spike)
        ) {
          this.crash();
          return;
        }
      }

      // Update camera to follow player
      this.camera.follow(this.player);

      // Check for level completion
      if (this.player.x >= this.levelEnd) {
        this.complete();
      }

      this.updateUI();
    }

    // Handle restart countdown
    if (this.gameState === "dead" && this.restartCountdown > 0) {
      this.restartCountdown -= deltaTime;
      const seconds = Math.ceil(this.restartCountdown);
      this.countdownElement.textContent = seconds.toString();

      if (this.restartCountdown <= 0) {
        this.restart();
      }
    }
  }

  crash() {
    console.log("Player crashed!");
    this.gameState = "dead";
    this.restartCountdown = 2;
    this.overlayMessage.textContent = "Game Over";
    this.gameOverlay.classList.remove("hidden");
    this.updateUI();
  }

  complete() {
    console.log("Level completed!");
    this.gameState = "complete";
    this.overlayMessage.textContent = "Level Complete!";
    this.gameOverlay.classList.remove("hidden");
    this.updateUI();
  }

  render() {
    this.renderer.clear();

    // Render ground
    this.renderer.renderGround();

    // Render game objects
    this.renderer.renderPlayer(this.player);

    for (const block of this.blocks) {
      this.renderer.renderBlock(block);
    }

    for (const spike of this.spikes) {
      this.renderer.renderSpike(spike);
    }

    // Render finish line
    this.renderer.renderFinishLine(this.levelEnd);
  }

  updateUI() {
    this.gameStateElement.textContent = this.gameState;
    this.playerPosElement.textContent = this.player.x.toFixed(1);
    this.onGroundElement.textContent = `${this.player.onGround}`;
  }
}
