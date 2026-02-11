/**
 * Customization options and presets
 */

import type { FlowerColor } from '../types/flower.js';

export const PRESET_COLORS: { name: string; color: FlowerColor }[] = [
  { name: 'Rose Red', color: { r: 220, g: 20, b: 60 } },
  { name: 'Sunflower Yellow', color: { r: 255, g: 215, b: 0 } },
  { name: 'Sky Blue', color: { r: 135, g: 206, b: 235 } },
  { name: 'Lavender', color: { r: 230, g: 190, b: 255 } },
  { name: 'Coral Pink', color: { r: 255, g: 127, b: 80 } },
  { name: 'Mint Green', color: { r: 152, g: 251, b: 152 } },
  { name: 'Peach', color: { r: 255, g: 218, b: 185 } },
  { name: 'Violet', color: { r: 148, g: 0, b: 211 } },
  { name: 'White', color: { r: 255, g: 255, b: 255 } },
  { name: 'Deep Purple', color: { r: 138, g: 43, b: 226 } },
];

export const CUSTOMIZATION_STEPS = [
  'flower-type',
  'color',
  'leaves',
  'petals',
  'confirm',
] as const;

export type CustomizationStep = (typeof CUSTOMIZATION_STEPS)[number];
