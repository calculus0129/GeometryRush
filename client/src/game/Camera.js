export class Camera {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.targetX = x;
    this.targetY = y;

    console.log("Camera initialized:", { x, y, width, height });
  }

  follow(player) {
    // Camera follows player horizontally and vertically
    this.targetX = player.x - 2 * 8; // Keep player slightly left of center
    this.targetY = player.y - 1 * 8; // Keep player slightly below center

    // Smooth camera movement (optional)
    // this.x += (this.targetX - this.x) * 0.5;
    // this.y += (this.targetY - this.y) * 0.5;
    this.x = this.targetX;
    this.y = this.targetY;
  }

  worldToScreen(worldX, worldY, canvasWidth, canvasHeight) {
    // Convert world coordinates to screen coordinates
    const screenX = ((worldX - this.x) / this.width) * canvasWidth;
    const screenY =
      canvasHeight - ((worldY - this.y) / this.height) * canvasHeight;
    return { x: screenX, y: screenY };
  }

  worldToScreenSize(worldWidth, worldHeight, canvasWidth, canvasHeight) {
    // Convert world size to screen size
    const screenWidth = (worldWidth / this.width) * canvasWidth;
    const screenHeight = (worldHeight / this.height) * canvasHeight;
    return { width: screenWidth, height: screenHeight };
  }

  isInView(worldX, worldY, worldWidth, worldHeight) {
    // Check if object is within camera view
    return (
      worldX + worldWidth >= this.x &&
      worldX <= this.x + this.width &&
      worldY + worldHeight >= this.y &&
      worldY <= this.y + this.height
    );
  }
}
