export class InputHandler {
  onJump: null | (() => void);
  onJumpStop: null | (() => void);
  constructor() {
    this.onJump = null;
    this.onJumpStop = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Mouse events
    document.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        // Left click
        this.startJump();
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        // Left click
        this.endJump();
      }
    });

    // Touch events for mobile
    document.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.startJump();
    });

    document.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.endJump();
    });

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        this.startJump();
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        this.endJump();
      }
    });
  }

  startJump() {
    if (this.onJump) this.onJump();
  }

  endJump() {
    if (this.onJumpStop) this.onJumpStop();
  }
}
