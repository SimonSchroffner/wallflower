/**
 * Socket.io client for mobile
 */

import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents, FlowerCustomization } from '@wallflower/shared';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class MobileSocket {
  private socket: TypedSocket | null = null;

  connect(url: string): TypedSocket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✓ Connected to backend');
    });

    this.socket.on('disconnect', () => {
      console.log('✗ Disconnected from backend');
    });

    this.socket.on('connection_established', (data) => {
      console.log('Connection established:', data);
    });
  }

  /**
   * Plant a flower
   */
  async plantFlower(customization: FlowerCustomization): Promise<{ success: boolean; flowerId?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Not connected to server' });
        return;
      }

      // Set up one-time listeners for response
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Request timeout' });
      }, 10000);

      this.socket.once('mobile:plant_success', (data) => {
        clearTimeout(timeout);
        resolve({ success: true, flowerId: data.flowerId });
      });

      this.socket.once('mobile:plant_error', (data) => {
        clearTimeout(timeout);
        resolve({ success: false, error: data.message });
      });

      // Emit the event
      this.socket.emit('mobile:plant_flower', customization);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const mobileSocket = new MobileSocket();
