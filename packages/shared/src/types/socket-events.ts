/**
 * Socket.io event type definitions for type-safe WebSocket communication
 */

import type { FlowerCustomization, FlowerData, GardenBounds } from './flower.js';

export interface ClientToServerEvents {
  // Mobile client events
  'mobile:plant_flower': (data: FlowerCustomization) => void;

  // Display client events
  'display:ready': (data: { displayId: string; bounds: GardenBounds }) => void;
  'display:request_sync': () => void;
}

export interface ServerToClientEvents {
  // Events to mobile clients
  'mobile:plant_success': (data: { flowerId: string }) => void;
  'mobile:plant_error': (data: { message: string }) => void;

  // Events to display clients
  'display:flower_planted': (flower: FlowerData) => void;
  'display:initial_state': (data: { flowers: FlowerData[] }) => void;
  'display:sync_complete': () => void;

  // Connection events
  'connection_established': (data: { clientType: 'mobile' | 'display' }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  clientType?: 'mobile' | 'display';
  displayId?: string;
  lastPlantTime?: number;
}
