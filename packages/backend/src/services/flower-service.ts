/**
 * Database operations for flowers
 */

import { prisma } from '../config/database.js';
import type { FlowerData, FlowerCustomization } from '@wallflower/shared';
import type { PlacementResult } from '@wallflower/shared';

export class FlowerService {
  /**
   * Get all flowers from the database
   */
  async getAllFlowers(): Promise<FlowerData[]> {
    const flowers = await prisma.flower.findMany({
      orderBy: { plantedAt: 'asc' },
    });

    return flowers.map(this.mapFlowerToData);
  }

  /**
   * Get recent flowers (last N)
   */
  async getRecentFlowers(limit: number): Promise<FlowerData[]> {
    const flowers = await prisma.flower.findMany({
      take: limit,
      orderBy: { plantedAt: 'desc' },
    });

    return flowers.map(this.mapFlowerToData);
  }

  /**
   * Create a new flower
   */
  async createFlower(
    customization: FlowerCustomization,
    placement: PlacementResult
  ): Promise<FlowerData> {
    const flower = await prisma.flower.create({
      data: {
        flowerType: customization.flowerType,
        colorR: customization.color.r,
        colorG: customization.color.g,
        colorB: customization.color.b,
        leaves: customization.leaves,
        petalCount: customization.petalCount,
        positionX: placement.x,
        positionY: placement.y,
        rotation: placement.rotation,
        scale: placement.scale,
      },
    });

    return this.mapFlowerToData(flower);
  }

  /**
   * Get total flower count
   */
  async getFlowerCount(): Promise<number> {
    return prisma.flower.count();
  }

  /**
   * Delete oldest flowers (for cleanup if max limit reached)
   */
  async deleteOldestFlowers(count: number): Promise<void> {
    const oldestFlowers = await prisma.flower.findMany({
      take: count,
      orderBy: { plantedAt: 'asc' },
      select: { id: true },
    });

    const ids = oldestFlowers.map((f) => f.id);
    await prisma.flower.deleteMany({
      where: { id: { in: ids } },
    });
  }

  /**
   * Map database flower to FlowerData type
   */
  private mapFlowerToData(flower: any): FlowerData {
    return {
      id: flower.id,
      flowerType: flower.flowerType,
      color: {
        r: flower.colorR,
        g: flower.colorG,
        b: flower.colorB,
      },
      leaves: flower.leaves,
      petalCount: flower.petalCount,
      position: {
        x: flower.positionX,
        y: flower.positionY,
      },
      rotation: flower.rotation,
      scale: flower.scale,
      plantedAt: flower.plantedAt,
    };
  }
}

export const flowerService = new FlowerService();
