import { Player } from "./Player";
import { Spike } from "./Spike";
import { Block } from "./Block";
import { Camera } from "./Camera";
import { Physics } from "./Physics";
import { CollisionDetector } from "./CollisionDetector";
import { GameRenderer } from "./GameRenderer";
import { InputHandler } from "./InputHandler";
import { AudioManager } from "./AudioManager";
import { GameState, ParamType } from "./types";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  params: ParamType;
  gameState: GameState;
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
  audioManager: AudioManager;

  // UI Element?
  gameStateElement: HTMLElement;
  playerPosElement: HTMLElement;
  onGroundElement: HTMLElement;
  debugElement: HTMLElement;

  gameOverlay: HTMLElement;
  overlayMessage: HTMLElement;
  countdownElement: HTMLElement;
  muteButton: HTMLElement;
  levelEnd: number = 0;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!; // The writer is not actually sure if this is not null.

    // Game parameters (configurable)
    this.params = {
      g: -18 * 8, // Gravity (units/s²) - negative for downward
      v0: 5 * 8, // Initial horizontal speed (units/s)
      vj: 9 * 8, // Jump speed (units/s)
      wj: 0, // Rotation speed (rad/s) - unused for now
    };

    // Game state
    this.gameState = GameState.READY; // 'ready', 'active', 'dead', 'complete'
    this.restartCountdown = 0;
    this.lastTime = 0;

    // Game objects
    this.player = new Player(0, 0, 8, 8, this.params.v0);
    this.spikes = [];
    this.blocks = [];
    this.camera = new Camera(-2 * 8, -3 * 8, 16 * 8, 9 * 8);

    // Game systems
    this.physics = new Physics(this.params);
    this.collisionDetector = new CollisionDetector();
    this.renderer = new GameRenderer(this.ctx, this.camera);
    this.inputHandler = new InputHandler();
    this.audioManager = new AudioManager();

    // Create level
    this.createLevel();

    // UI elements
    this.gameStateElement = document.getElementById("gameState")!;
    this.playerPosElement = document.getElementById("playerPos")!;
    this.onGroundElement = document.getElementById("onGround")!;
    this.debugElement = document.getElementById("debug")!;

    this.gameOverlay = document.getElementById("gameOverlay")!;
    this.overlayMessage = document.getElementById("overlayMessage")!;
    this.countdownElement = document.getElementById("countdown")!;
    this.muteButton = document.getElementById("muteButton")!;

    const handleInput = () => {
      switch (this.gameState) {
        case GameState.READY:
          // this.gameState = GameState.ACTIVE;
          // this.updateUI();
          break;
        case GameState.ACTIVE:
          this.player.isJumping = true;
      }
      // this.player.jump(this.params.vj)
    };

    // Bind methods
    this.gameLoop = this.gameLoop.bind(this);
    // this.handleInput = handleInput.bind(this); // IDK what this does

    // Set up input handling
    this.inputHandler.onJump = handleInput;
    this.inputHandler.onJumpStop = () => {
      switch (this.gameState) {
        case GameState.READY:
          this.gameState = GameState.ACTIVE;
          this.audioManager.startBackgroundMusic();
          this.updateUI();
          break;
        case GameState.ACTIVE:
          this.player.isJumping = false;
          break;
        // Retry for Complete
        case GameState.COMPLETE:
          this.restart();
      }
    };

    // Set up mute button
    this.muteButton.addEventListener('click', () => {
      const isMuted = this.audioManager.toggleMute();
      this.muteButton.textContent = isMuted ? '🔇 Sound OFF' : '🔊 Sound ON';
    });

    console.log("Game initialized");
  }

  createLevel() {
    // Create a simple level with obstacles
    this.spikes.push(new Spike(40, 0));

    this.spikes.push(new Spike(80, 0));
    this.spikes.push(new Spike(88, 0));

    this.spikes.push(new Spike(120, 0));
    this.spikes.push(new Spike(128, 0));
    this.spikes.push(new Spike(136, 0));

    // Ground blocks for platforms
    this.blocks.push(new Block(240, 0));
    this.blocks.push(new Block(248, 0));
    this.blocks.push(new Block(256, 0));

    this.blocks.push(new Block(280, 8));
    this.blocks.push(new Block(288, 8));

    this.blocks.push(new Block(320, 0));
    this.blocks.push(new Block(328, 0));

    // Spikes
    this.spikes.push(new Spike(264, 0));
    this.spikes.push(new Spike(272, 0));
    this.spikes.push(new Spike(296, 0));
    this.spikes.push(new Spike(304, 0));
    this.spikes.push(new Spike(312, 0));
    this.spikes.push(new Spike(336, 0));
    this.spikes.push(new Spike(344, 0));
    this.spikes.push(new Spike(352, 0));

    // End marker
    this.levelEnd = 480;
  }

  start() {
    console.log("Game started");
    this.gameState = GameState.READY;
    this.updateUI();
    this.gameLoop();
  }

  restart() {
    console.log("Game restarted");
    this.player.reset(0, 0);
    this.camera.x = -2 * 8;
    this.camera.y = -3 * 8;
    this.gameState = GameState.READY;
    this.restartCountdown = 0;
    this.gameOverlay.classList.add("hidden");
    
    // Stop any playing music when restarting
    this.audioManager.stopBackgroundMusic();
    
    this.updateUI();
  }

  gameLoop(currentTime = 0) {
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap at 60fps
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime: number) {
    if (this.gameState === GameState.ACTIVE) {
      this.player.onGround = false;

      // Check Spike collisions
      for (const spike of this.spikes) {
        if (
          this.collisionDetector.checkPlayerSpikeCollision(this.player, spike)
        ) {
          this.crash();
          return;
        }
      }

      // Check block collisions
      for (const block of this.blocks) {
        switch (
          this.collisionDetector.getPlayerBlockCollisionType(this.player, block)
        ) {
          case "top":
            this.player.y = block.y + block.height;
            this.player.onGround = true;
          case null:
            break;
          case "bottom":
          case "side":
            this.crash();
            return;
        }
      }

      // Check ground collision
      if (this.player.y <= 0) {
        this.player.y = 0;
        this.player.onGround = true;
      }

      // Update physics
      this.physics.updatePlayer(this.player, deltaTime);

      // Update camera to follow player
      this.camera.follow(this.player, 2 * 8);

      // Check for level completion
      if (this.player.x >= this.levelEnd) {
        this.complete();
      }

      this.updateUI();
    }

    // Handle restart countdown
    if (this.gameState === GameState.DEAD && this.restartCountdown > 0) {
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
    this.gameState = GameState.DEAD;
    this.restartCountdown = 2;
    this.overlayMessage.textContent = "Game Over";
    this.gameOverlay.classList.remove("hidden");
    
    // Stop background music and play crash sound
    this.audioManager.stopBackgroundMusic();
    this.audioManager.playCrashSound();
    
    this.updateUI();
  }

  complete() {
    console.log("Level completed!");
    this.gameState = GameState.COMPLETE;
    this.overlayMessage.textContent = "Level Complete!";
    this.gameOverlay.classList.remove("hidden");
    
    // Fade out background music and play success sound
    this.audioManager.fadeOutBackgroundMusic(1500);
    this.audioManager.playSuccessSound();
    
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

  // Just update textboxes that pops up on the top of the screen.
  updateUI() {
    this.gameStateElement.textContent = GameState[this.gameState];
    this.playerPosElement.textContent = this.player.x.toFixed(1);
    this.onGroundElement.textContent = `${this.player.onGround}`;
    this.debugElement.textContent = `\n
    player.isJumping: ${this.player.isJumping} \n
    `;
  }
}
