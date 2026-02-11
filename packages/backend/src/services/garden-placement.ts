/**
 * Garden placement algorithm using Poisson disc sampling
 * Ensures flowers are evenly distributed without overlapping
 */

import { GARDEN_CONFIG } from '@wallflower/shared';
import type { GardenBounds, FlowerPosition, PlacementResult, FlowerData } from '@wallflower/shared';
import { SpatialHash } from '../utils/spatial-hash.js';

export class GardenPlacement {
  private spatialHash: SpatialHash;
  private flowerPositions: Map<string, FlowerPosition>;
  private bounds: GardenBounds;
  private minDistance: number;

  constructor(
    bounds: GardenBounds,
    minDistance: number = GARDEN_CONFIG.MIN_DISTANCE
  ) {
    this.bounds = bounds;
    this.minDistance = minDistance;
    this.spatialHash = new SpatialHash(GARDEN_CONFIG.SPATIAL_CELL_SIZE);
    this.flowerPositions = new Map();
  }

  /**
   * Load existing flowers into the spatial hash
   */
  loadExistingFlowers(flowers: FlowerData[]): void {
    this.spatialHash.clear();
    this.flowerPositions.clear();

    for (const flower of flowers) {
      this.spatialHash.insert(flower.id, flower.position);
      this.flowerPositions.set(flower.id, flower.position);
    }
  }

  /**
   * Find a valid placement for a new flower
   */
  findPlacement(): PlacementResult | null {
    const maxAttempts = GARDEN_CONFIG.MAX_PLACEMENT_ATTEMPTS;
    const margin = GARDEN_CONFIG.MARGIN;

    // Place flowers in the ground area (bottom 70% of screen)
    const skyHeight = this.bounds.height * 0.3;
    const groundStartY = skyHeight + margin;
    const groundHeight = this.bounds.height - skyHeight - 2 * margin;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate random position within ground bounds
      const x = margin + Math.random() * (this.bounds.width - 2 * margin);
      const y = groundStartY + Math.random() * groundHeight;

      // Check if position is valid (no nearby flowers)
      if (this.isValidPosition({ x, y })) {
        return {
          x,
          y,
          rotation: Math.random() * 360, // Random rotation
          scale: GARDEN_CONFIG.MIN_SCALE + Math.random() * (GARDEN_CONFIG.MAX_SCALE - GARDEN_CONFIG.MIN_SCALE),
        };
      }
    }

    // Fallback: grid placement if Poisson disc fails
    return this.findGridPlacement();
  }

  /**
   * Check if a position is valid (far enough from other flowers)
   */
  private isValidPosition(position: FlowerPosition): boolean {
    const nearbyIds = this.spatialHash.getNearby(position, this.minDistance);

    for (const flowerId of nearbyIds) {
      const flowerPos = this.flowerPositions.get(flowerId);
      if (!flowerPos) continue;

      const distance = this.distance(position, flowerPos);
      if (distance < this.minDistance) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate distance between two positions
   */
  private distance(a: FlowerPosition, b: FlowerPosition): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Fallback grid placement when Poisson disc fails
   */
  private findGridPlacement(): PlacementResult | null {
    const gridSize = this.minDistance * 1.5;

    // Only place in ground area (bottom 70%)
    const skyHeight = this.bounds.height * 0.3;
    const groundStartY = skyHeight;
    const groundHeight = this.bounds.height - skyHeight;

    const cols = Math.floor(this.bounds.width / gridSize);
    const rows = Math.floor(groundHeight / gridSize);

    // Try grid positions with some randomness
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize + gridSize / 2 + (Math.random() - 0.5) * gridSize * 0.3;
        const y = groundStartY + row * gridSize + gridSize / 2 + (Math.random() - 0.5) * gridSize * 0.3;

        if (this.isValidPosition({ x, y })) {
          return {
            x,
            y,
            rotation: Math.random() * 360,
            scale: GARDEN_CONFIG.MIN_SCALE + Math.random() * (GARDEN_CONFIG.MAX_SCALE - GARDEN_CONFIG.MIN_SCALE),
          };
        }
      }
    }

    return null;
  }

  /**
   * Add a flower to the spatial hash (after successful placement)
   */
  addFlower(flowerId: string, position: FlowerPosition): void {
    this.spatialHash.insert(flowerId, position);
    this.flowerPositions.set(flowerId, position);
  }

  /**
   * Get current flower count
   */
  getFlowerCount(): number {
    return this.flowerPositions.size;
  }

  /**
   * Update bounds (when display resizes)
   */
  updateBounds(bounds: GardenBounds): void {
    this.bounds = bounds;
  }
}
