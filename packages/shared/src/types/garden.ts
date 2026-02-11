/**
 * Garden-related types for placement and rendering
 */

export interface SpatialCell {
  flowers: string[]; // flower IDs in this cell
}

export interface SpatialGrid {
  cellSize: number;
  cells: Map<string, SpatialCell>;
}

export interface PlacementConfig {
  minDistance: number;
  maxAttempts: number;
  margin: number;
}

export interface PlacementResult {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}
