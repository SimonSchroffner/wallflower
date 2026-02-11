/**
 * Available flower types and their characteristics
 */

import type { FlowerType, LeafStyle } from '../types/flower.js';

export const FLOWER_TYPES: FlowerType[] = [
  'rose',
  'tulip',
  'daisy',
  'sunflower',
  'lily',
  'poppy',
];

export const LEAF_STYLES: LeafStyle[] = [
  'simple',
  'compound',
  'minimal',
];

export const FLOWER_DISPLAY_NAMES: Record<FlowerType, string> = {
  rose: 'Rose',
  tulip: 'Tulip',
  daisy: 'Daisy',
  sunflower: 'Sunflower',
  lily: 'Lily',
  poppy: 'Poppy',
};

export const LEAF_DISPLAY_NAMES: Record<LeafStyle, string> = {
  simple: 'Simple',
  compound: 'Compound',
  minimal: 'Minimal',
};

export const PETAL_COUNT_RANGE = {
  min: 5,
  max: 12,
  default: 8,
} as const;
