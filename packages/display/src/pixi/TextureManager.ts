/**
 * Texture loading and caching for PixiJS
 * Creates dynamic flower textures based on type and customization
 */

import { Texture, Graphics } from 'pixi.js';
import type { FlowerType, FlowerColor } from '@wallflower/shared';

export class TextureManager {
  private loaded: boolean = false;

  /**
   * Load all flower textures (no-op for procedural generation)
   */
  async loadTextures(): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;
    console.log('✓ Texture manager ready');
  }

  /**
   * Create a flower graphics object based on type, color, and petal count
   */
  createFlowerGraphics(type: FlowerType, color: FlowerColor, petalCount: number): Graphics {
    const graphics = new Graphics();
    const flowerColor = (color.r << 16) | (color.g << 8) | color.b;

    // Draw based on flower type
    switch (type) {
      case 'rose':
        this.drawRose(graphics, flowerColor, petalCount);
        break;
      case 'tulip':
        this.drawTulip(graphics, flowerColor, petalCount);
        break;
      case 'daisy':
        this.drawDaisy(graphics, flowerColor, petalCount);
        break;
      case 'sunflower':
        this.drawSunflower(graphics, flowerColor, petalCount);
        break;
      case 'lily':
        this.drawLily(graphics, flowerColor, petalCount);
        break;
      case 'poppy':
        this.drawPoppy(graphics, flowerColor, petalCount);
        break;
    }

    return graphics;
  }

  /**
   * Draw a rose with layered circular petals
   */
  private drawRose(graphics: Graphics, color: number, petalCount: number): void {
    const size = 25;

    // Draw petals in a circular pattern
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.6;
      const y = Math.sin(angle) * size * 0.6;

      graphics.circle(x, y, size * 0.5);
      graphics.fill({ color, alpha: 0.8 });
    }

    // Center
    graphics.circle(0, 0, size * 0.35);
    graphics.fill({ color: 0xFFD700, alpha: 1 });

    // Stem
    graphics.rect(-3, 0, 6, 50);
    graphics.fill({ color: 0x2E7D32 });
  }

  /**
   * Draw a tulip with elongated teardrop petals
   */
  private drawTulip(graphics: Graphics, color: number, petalCount: number): void {
    const size = 30;
    const adjustedPetals = Math.max(4, Math.min(petalCount, 8)); // Tulips have 4-8 petals

    for (let i = 0; i < adjustedPetals; i++) {
      const angle = (i / adjustedPetals) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * size * 0.3;
      const y = Math.sin(angle) * size * 0.3 - size * 0.3;

      // Teardrop shape
      graphics.ellipse(x, y, size * 0.4, size * 0.7);
      graphics.fill({ color, alpha: 0.9 });
    }

    // Stem
    graphics.rect(-3, 0, 6, 50);
    graphics.fill({ color: 0x2E7D32 });
  }

  /**
   * Draw a daisy with thin rectangular petals
   */
  private drawDaisy(graphics: Graphics, color: number, petalCount: number): void {
    const size = 28;

    // Draw thin petals (calculate rotated rectangles manually)
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;

      // Calculate the four corners of the rotated rectangle
      const innerRadius = size * 0.3;
      const outerRadius = size * 0.9;
      const width = 6;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const perpCos = Math.cos(angle + Math.PI / 2);
      const perpSin = Math.sin(angle + Math.PI / 2);

      // Four corners of the rectangle
      const x1 = cos * innerRadius - perpCos * width / 2;
      const y1 = sin * innerRadius - perpSin * width / 2;
      const x2 = cos * innerRadius + perpCos * width / 2;
      const y2 = sin * innerRadius + perpSin * width / 2;
      const x3 = cos * outerRadius + perpCos * width / 2;
      const y3 = sin * outerRadius + perpSin * width / 2;
      const x4 = cos * outerRadius - perpCos * width / 2;
      const y4 = sin * outerRadius - perpSin * width / 2;

      graphics.poly([x1, y1, x2, y2, x3, y3, x4, y4]);
      graphics.fill({ color, alpha: 0.95 });
    }

    // Large center
    graphics.circle(0, 0, size * 0.4);
    graphics.fill({ color: 0xFFD700 });

    // Stem
    graphics.rect(-3, 0, 6, 50);
    graphics.fill({ color: 0x2E7D32 });
  }

  /**
   * Draw a sunflower with triangular petals and large center
   */
  private drawSunflower(graphics: Graphics, color: number, petalCount: number): void {
    const size = 35;
    const adjustedPetals = Math.max(10, petalCount); // Sunflowers have many petals

    // Draw triangular petals
    for (let i = 0; i < adjustedPetals; i++) {
      const angle = (i / adjustedPetals) * Math.PI * 2;
      const x1 = Math.cos(angle) * size * 0.4;
      const y1 = Math.sin(angle) * size * 0.4;
      const x2 = Math.cos(angle) * size;
      const y2 = Math.sin(angle) * size;

      const perpAngle = angle + Math.PI / 2;
      const width = 8;

      graphics.poly([
        x1 + Math.cos(perpAngle) * width, y1 + Math.sin(perpAngle) * width,
        x1 - Math.cos(perpAngle) * width, y1 - Math.sin(perpAngle) * width,
        x2, y2,
      ]);
      graphics.fill({ color: 0xFFA500, alpha: 0.9 }); // Orange petals
    }

    // Large brown center
    graphics.circle(0, 0, size * 0.5);
    graphics.fill({ color: 0x8B4513 });

    // Thick stem
    graphics.rect(-4, 0, 8, 55);
    graphics.fill({ color: 0x2E7D32 });
  }

  /**
   * Draw a lily with star-shaped pointed petals
   */
  private drawLily(graphics: Graphics, color: number, petalCount: number): void {
    const size = 32;
    const adjustedPetals = Math.max(5, Math.min(petalCount, 8)); // Lilies typically have 5-6 petals

    for (let i = 0; i < adjustedPetals; i++) {
      const angle = (i / adjustedPetals) * Math.PI * 2 - Math.PI / 2;

      // Pointed petal shape
      const x1 = 0;
      const y1 = 0;
      const x2 = Math.cos(angle) * size;
      const y2 = Math.sin(angle) * size;
      const x3 = Math.cos(angle + 0.3) * size * 0.4;
      const y3 = Math.sin(angle + 0.3) * size * 0.4;
      const x4 = Math.cos(angle - 0.3) * size * 0.4;
      const y4 = Math.sin(angle - 0.3) * size * 0.4;

      graphics.poly([x1, y1, x4, y4, x2, y2, x3, y3]);
      graphics.fill({ color, alpha: 0.9 });
    }

    // Center stamens (small dots)
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const x = Math.cos(angle) * 5;
      const y = Math.sin(angle) * 5;
      graphics.circle(x, y, 2);
      graphics.fill({ color: 0xFFD700 });
    }

    // Stem
    graphics.rect(-3, 0, 6, 50);
    graphics.fill({ color: 0x2E7D32 });
  }

  /**
   * Draw a poppy with delicate overlapping rounded petals
   */
  private drawPoppy(graphics: Graphics, color: number, petalCount: number): void {
    const size = 30;
    const adjustedPetals = Math.max(4, Math.min(petalCount, 8)); // Poppies have 4-6 petals typically

    for (let i = 0; i < adjustedPetals; i++) {
      const angle = (i / adjustedPetals) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.5;
      const y = Math.sin(angle) * size * 0.5;

      // Rounded petal - draw ellipse (PixiJS v8 doesn't support rotation parameter)
      graphics.ellipse(x, y, size * 0.7, size * 0.6);
      graphics.fill({ color, alpha: 0.85 });
    }

    // Dark center
    graphics.circle(0, 0, size * 0.25);
    graphics.fill({ color: 0x1A1A1A });

    // Thin stem
    graphics.rect(-2, 0, 4, 50);
    graphics.fill({ color: 0x2E7D32 });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.loaded = false;
  }
}
