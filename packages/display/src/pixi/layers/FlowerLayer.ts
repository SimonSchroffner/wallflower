/**
 * Main flower rendering layer
 */

import { Container } from 'pixi.js';
import { FlowerSprite } from '../FlowerSprite';
import type { FlowerData } from '@wallflower/shared';
import type { TextureManager } from '../TextureManager';

export class FlowerLayer extends Container {
  private flowers: Map<string, FlowerSprite> = new Map();
  private textureManager: TextureManager;

  constructor(textureManager: TextureManager) {
    super();
    this.textureManager = textureManager;
    this.sortableChildren = true; // Enable depth sorting
  }

  /**
   * Add a new flower
   */
  addFlower(data: FlowerData): FlowerSprite {
    // Check if flower already exists
    if (this.flowers.has(data.id)) {
      return this.flowers.get(data.id)!;
    }

    // Create flower graphics based on type, color, and petal count
    const flowerGraphics = this.textureManager.createFlowerGraphics(
      data.flowerType,
      data.color,
      data.petalCount
    );

    // Create flower sprite
    const flower = new FlowerSprite(data, flowerGraphics);

    // Set z-index based on Y position (further back = lower z)
    flower.zIndex = data.position.y;

    this.flowers.set(data.id, flower);
    this.addChild(flower);

    return flower;
  }

  /**
   * Update all flowers
   */
  update(deltaTime: number): void {
    for (const flower of this.flowers.values()) {
      flower.update(deltaTime);
    }
  }

  /**
   * Remove a flower
   */
  removeFlower(id: string): void {
    const flower = this.flowers.get(id);
    if (flower) {
      this.removeChild(flower);
      flower.destroy();
      this.flowers.delete(id);
    }
  }

  /**
   * Clear all flowers
   */
  clearFlowers(): void {
    for (const flower of this.flowers.values()) {
      this.removeChild(flower);
      flower.destroy();
    }
    this.flowers.clear();
  }

  /**
   * Get flower count
   */
  getFlowerCount(): number {
    return this.flowers.size;
  }

  /**
   * Get a flower by ID
   */
  getFlower(id: string): FlowerSprite | undefined {
    return this.flowers.get(id);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.clearFlowers();
    super.destroy({ children: true });
  }
}
