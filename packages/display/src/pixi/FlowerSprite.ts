/**
 * Individual flower sprite class
 */

import { Container, Graphics } from 'pixi.js';
import type { FlowerData } from '@wallflower/shared';
import { GARDEN_CONFIG } from '@wallflower/shared';

export class FlowerSprite extends Container {
  private flowerGraphics: Graphics;
  private data: FlowerData;
  private swayPhase: number;
  private growthProgress: number = 0;
  private targetScale: number;

  constructor(data: FlowerData, flowerGraphics: Graphics) {
    super();

    this.data = data;
    this.targetScale = data.scale;
    this.swayPhase = Math.random() * Math.PI * 2;

    // Use the provided graphics
    this.flowerGraphics = flowerGraphics;
    this.flowerGraphics.pivot.set(0, 0); // Pivot at stem base
    this.addChild(this.flowerGraphics);

    // Set position
    this.position.set(data.position.x, data.position.y);
    this.rotation = (data.rotation * Math.PI) / 180;

    // Start with scale 0 for grow animation
    this.scale.set(0);
  }

  /**
   * Update animation
   */
  update(deltaTime: number): void {
    // Grow animation
    if (this.growthProgress < 1) {
      this.growthProgress += deltaTime / GARDEN_CONFIG.GROW_DURATION;
      if (this.growthProgress > 1) this.growthProgress = 1;

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - this.growthProgress, 3);
      this.scale.set(eased * this.targetScale);
    }

    // Gentle sway animation
    this.swayPhase += GARDEN_CONFIG.SWAY_SPEED * deltaTime;
    const swayAngle = Math.sin(this.swayPhase) * GARDEN_CONFIG.SWAY_AMPLITUDE;
    this.flowerGraphics.rotation = (swayAngle * Math.PI) / 180;
  }

  /**
   * Get flower data
   */
  getData(): FlowerData {
    return this.data;
  }

  /**
   * Check if flower is fully grown
   */
  isFullyGrown(): boolean {
    return this.growthProgress >= 1;
  }
}
