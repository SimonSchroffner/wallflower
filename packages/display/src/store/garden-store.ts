/**
 * Zustand store for garden state management
 */

import { create } from 'zustand';
import type { FlowerData } from '@wallflower/shared';

interface GardenState {
  flowers: Map<string, FlowerData>;
  connected: boolean;
  displayId: string;

  // Actions
  addFlower: (flower: FlowerData) => void;
  setFlowers: (flowers: FlowerData[]) => void;
  setConnected: (connected: boolean) => void;
  setDisplayId: (id: string) => void;
}

export const useGardenStore = create<GardenState>((set) => ({
  flowers: new Map(),
  connected: false,
  displayId: '',

  addFlower: (flower) =>
    set((state) => {
      const newFlowers = new Map(state.flowers);
      newFlowers.set(flower.id, flower);
      return { flowers: newFlowers };
    }),

  setFlowers: (flowers) =>
    set({
      flowers: new Map(flowers.map((f) => [f.id, f])),
    }),

  setConnected: (connected) => set({ connected }),

  setDisplayId: (id) => set({ displayId: id }),
}));
