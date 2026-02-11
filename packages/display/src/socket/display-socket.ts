/**
 * Socket.io client for display
 */

import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@wallflower/shared';
import { useGardenStore } from '../store/garden-store';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class DisplaySocket {
  private socket: TypedSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;

  connect(url: string): TypedSocket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✓ Connected to backend');
      this.reconnectAttempts = 0;
      useGardenStore.getState().setConnected(true);

      // Generate display ID and send ready event
      const displayId = `display-${Date.now()}`;
      useGardenStore.getState().setDisplayId(displayId);

      this.socket!.emit('display:ready', {
        displayId,
        bounds: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Disconnected from backend');
      useGardenStore.getState().setConnected(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('connection_established', (data) => {
      console.log('Connection established:', data);
    });

    this.socket.on('display:initial_state', (data) => {
      console.log(`Received initial state: ${data.flowers.length} flowers`);
      useGardenStore.getState().setFlowers(data.flowers);
    });

    this.socket.on('display:flower_planted', (flower) => {
      console.log('New flower planted:', flower.id);
      useGardenStore.getState().addFlower(flower);
    });

    this.socket.on('display:sync_complete', () => {
      console.log('Sync complete');
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): TypedSocket | null {
    return this.socket;
  }
}

export const displaySocket = new DisplaySocket();
