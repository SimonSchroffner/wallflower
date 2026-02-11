/**
 * Garden configuration constants
 */

export const GARDEN_CONFIG = {
  // Placement
  MIN_DISTANCE: 30,
  MAX_PLACEMENT_ATTEMPTS: 50,
  MARGIN: 20,

  // Scaling
  MIN_SCALE: 0.8,
  MAX_SCALE: 1.2,

  // Animation
  GROW_DURATION: 500, // ms
  SWAY_AMPLITUDE: 2, // degrees
  SWAY_SPEED: 0.001, // radians per frame

  // Performance
  MAX_FLOWERS: 10000,
  CULLING_MARGIN: 100, // px offscreen before culling

  // Spatial hashing
  SPATIAL_CELL_SIZE: 50,
} as const;
