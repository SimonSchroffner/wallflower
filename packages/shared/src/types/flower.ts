/**
 * Core flower data types
 */

export type FlowerType = 'rose' | 'tulip' | 'daisy' | 'sunflower' | 'lily' | 'poppy';
export type LeafStyle = 'simple' | 'compound' | 'minimal';

export interface FlowerColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface FlowerPosition {
  x: number;
  y: number;
}

export interface FlowerCustomization {
  flowerType: FlowerType;
  color: FlowerColor;
  leaves: LeafStyle;
  petalCount: number; // 5-12
}

export interface FlowerData extends FlowerCustomization {
  id: string;
  position: FlowerPosition;
  rotation: number; // degrees
  scale: number; // 0.8-1.2
  plantedAt: Date;
}

export interface GardenBounds {
  width: number;
  height: number;
}
