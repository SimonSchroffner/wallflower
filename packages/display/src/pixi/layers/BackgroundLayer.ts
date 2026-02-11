/**
 * Background layer with gradient sky and ground
 */

import { Graphics, Container } from 'pixi.js';

export class BackgroundLayer extends Container {
  private background: Graphics;

  constructor(width: number, height: number) {
    super();

    this.background = new Graphics();
    this.drawBackground(width, height);
    this.addChild(this.background);
  }

  /**
   * Draw garden background (sky + ground)
   */
  private drawBackground(width: number, height: number): void {
    this.background.clear();

    // Sky gradient (top 30%) - light blue to lighter blue
    const skyHeight = height * 0.3;

    // Sky top
    this.background.rect(0, 0, width, skyHeight * 0.5);
    this.background.fill({ color: 0xA8D8EA }); // Light blue

    // Sky bottom (transition)
    this.background.rect(0, skyHeight * 0.5, width, skyHeight * 0.5);
    this.background.fill({ color: 0xD4E8F0 }); // Very light blue

    // Ground - Main garden area (70%)
    const groundY = skyHeight;
    const groundHeight = height - skyHeight;

    // Grass layer 1 (lighter green)
    this.background.rect(0, groundY, width, groundHeight * 0.4);
    this.background.fill({ color: 0x8BC34A }); // Light grass green

    // Grass layer 2 (medium green)
    this.background.rect(0, groundY + groundHeight * 0.4, width, groundHeight * 0.35);
    this.background.fill({ color: 0x7CB342 }); // Medium grass green

    // Soil/darker ground at bottom
    this.background.rect(0, groundY + groundHeight * 0.75, width, groundHeight * 0.25);
    this.background.fill({ color: 0x689F38 }); // Dark grass/soil

    // Add subtle grass texture
    this.drawGrassTexture(width, groundY, groundHeight);
  }

  /**
   * Draw simple grass texture overlay
   */
  private drawGrassTexture(width: number, startY: number, height: number): void {
    // Simple vertical lines to simulate grass blades
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = startY + Math.random() * height;
      const lineHeight = 3 + Math.random() * 8;
      const alpha = 0.1 + Math.random() * 0.15;

      // Draw line as a thin rectangle for better compatibility
      this.background.rect(x, y - lineHeight, 1, lineHeight);
      this.background.fill({
        color: 0x558B2F,
        alpha: alpha
      });
    }
  }

  /**
   * Resize background
   */
  resize(width: number, height: number): void {
    this.drawBackground(width, height);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.background.destroy();
    super.destroy({ children: true });
  }
}
