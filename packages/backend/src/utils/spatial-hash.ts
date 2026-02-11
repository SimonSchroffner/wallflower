/**
 * Spatial hash grid for efficient collision detection
 */

import type { FlowerPosition, SpatialGrid } from '@wallflower/shared';

export class SpatialHash {
  private cellSize: number;
  private cells: Map<string, Set<string>>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }

  /**
   * Get cell key for a position
   */
  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  /**
   * Insert a flower into the spatial hash
   */
  insert(flowerId: string, position: FlowerPosition): void {
    const key = this.getCellKey(position.x, position.y);
    if (!this.cells.has(key)) {
      this.cells.set(key, new Set());
    }
    this.cells.get(key)!.add(flowerId);
  }

  /**
   * Get all flower IDs within a certain radius of a position
   */
  getNearby(position: FlowerPosition, radius: number): string[] {
    const nearby: string[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);

    const centerCellX = Math.floor(position.x / this.cellSize);
    const centerCellY = Math.floor(position.y / this.cellSize);

    // Check all cells within the radius
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${centerCellX + dx},${centerCellY + dy}`;
        const cell = this.cells.get(key);
        if (cell) {
          nearby.push(...cell);
        }
      }
    }

    return nearby;
  }

  /**
   * Clear all data from the spatial hash
   */
  clear(): void {
    this.cells.clear();
  }

  /**
   * Get total number of flowers in the hash
   */
  size(): number {
    let total = 0;
    for (const cell of this.cells.values()) {
      total += cell.size;
    }
    return total;
  }
}
