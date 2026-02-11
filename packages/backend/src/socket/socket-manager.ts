/**
 * Central WebSocket orchestration with Socket.io
 */

import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@wallflower/shared';
import { MobileHandler } from './handlers/mobile-handler.js';
import { DisplayHandler } from './handlers/display-handler.js';
import { GardenPlacement } from '../services/garden-placement.js';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export class SocketManager {
  private io: TypedServer;
  private mobileHandler: MobileHandler;
  private displayHandler: DisplayHandler;
  private gardenPlacement: GardenPlacement;

  constructor(httpServer: HTTPServer) {
    // Initialize Socket.io with CORS
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        methods: ['GET', 'POST'],
      },
    });

    // Initialize handlers
    this.mobileHandler = new MobileHandler();
    this.displayHandler = new DisplayHandler();

    // Initialize garden placement with default bounds (will be updated by display)
    this.gardenPlacement = new GardenPlacement(
      { width: 1920, height: 1080 },
      parseInt(process.env.PLACEMENT_MIN_DISTANCE || '30')
    );

    this.setupEventHandlers();
  }

  /**
   * Set up Socket.io event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Mobile events
      socket.on('mobile:plant_flower', (data) => {
        this.mobileHandler.handlePlantFlower(socket, data, this.gardenPlacement, this.io);
      });

      // Display events
      socket.on('display:ready', (data) => {
        this.displayHandler.handleDisplayReady(socket, data, this.gardenPlacement);
      });

      socket.on('display:request_sync', () => {
        this.displayHandler.handleRequestSync(socket);
      });

      // Connection handling
      socket.on('disconnect', () => {
        const clientType = socket.data.clientType || 'unknown';
        console.log(`${clientType} client disconnected: ${socket.id}`);
      });

      // Determine client type based on first event
      socket.prependAny((eventName) => {
        if (eventName.startsWith('mobile:') && !socket.data.clientType) {
          this.mobileHandler.handleConnection(socket);
        } else if (eventName.startsWith('display:') && !socket.data.clientType) {
          this.displayHandler.handleConnection(socket);
        }
      });
    });
  }

  /**
   * Get Socket.io server instance
   */
  getIO(): TypedServer {
    return this.io;
  }

  /**
   * Get connection stats
   */
  getStats() {
    const sockets = Array.from(this.io.sockets.sockets.values());
    return {
      total: sockets.length,
      mobile: sockets.filter((s) => s.data.clientType === 'mobile').length,
      display: sockets.filter((s) => s.data.clientType === 'display').length,
      flowers: this.gardenPlacement.getFlowerCount(),
    };
  }
}
