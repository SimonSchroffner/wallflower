/**
 * Zod validation schemas for runtime type checking
 */

import { z } from 'zod';

export const FlowerTypeSchema = z.enum(['rose', 'tulip', 'daisy', 'sunflower', 'lily', 'poppy']);
export const LeafStyleSchema = z.enum(['simple', 'compound', 'minimal']);

export const FlowerColorSchema = z.object({
  r: z.number().int().min(0).max(255),
  g: z.number().int().min(0).max(255),
  b: z.number().int().min(0).max(255),
});

export const FlowerCustomizationSchema = z.object({
  flowerType: FlowerTypeSchema,
  color: FlowerColorSchema,
  leaves: LeafStyleSchema,
  petalCount: z.number().int().min(5).max(12),
});

export const FlowerPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const GardenBoundsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

export const DisplayReadySchema = z.object({
  displayId: z.string(),
  bounds: GardenBoundsSchema,
});
