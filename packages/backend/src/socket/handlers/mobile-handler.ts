/**
 * Socket.io event handlers for mobile clients
 */

import type { Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@wallflower/shared';
import { FlowerCustomizationSchema } from '@wallflower/shared';
import { flowerService } from '../../services/flower-service.js';
import { RateLimiter } from '../../services/rate-limiter.js';
import type { GardenPlacement } from '../../services/garden-placement.js';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export class MobileHandler {
  private rateLimiter: RateLimiter;

  constructor() {
    // 1 flower per 5 seconds per client
    this.rateLimiter = new RateLimiter(5000, 1);

    // Cleanup old rate limit entries every minute
    setInterval(() => this.rateLimiter.cleanup(), 60000);
  }

  /**
   * Handle mobile client connection
   */
  handleConnection(socket: TypedSocket): void {
    console.log(`Mobile client connected: ${socket.id}`);

    socket.data.clientType = 'mobile';

    socket.emit('connection_established', { clientType: 'mobile' });
  }

  /**
   * Handle plant flower request
   */
  async handlePlantFlower(
    socket: TypedSocket,
    data: any,
    gardenPlacement: GardenPlacement,
    io: any
  ): Promise<void> {
    try {
      // Rate limiting
      const rateLimitCheck = this.rateLimiter.checkLimit(socket.id);
      if (!rateLimitCheck.allowed) {
        socket.emit('mobile:plant_error', {
          message: `Please wait ${rateLimitCheck.retryAfter} seconds before planting another flower.`,
        });
        return;
      }

      // Validate data
      const validation = FlowerCustomizationSchema.safeParse(data);
      if (!validation.success) {
        socket.emit('mobile:plant_error', {
          message: 'Invalid flower data. Please try again.',
        });
        console.error('Validation error:', validation.error);
        return;
      }

      const customization = validation.data;

      // Check if garden is full
      const flowerCount = await flowerService.getFlowerCount();
      const maxFlowers = parseInt(process.env.MAX_FLOWERS || '10000');

      if (flowerCount >= maxFlowers) {
        socket.emit('mobile:plant_error', {
          message: 'The garden is full! Please try again later.',
        });
        return;
      }

      // Find placement
      const placement = gardenPlacement.findPlacement();
      if (!placement) {
        socket.emit('mobile:plant_error', {
          message: 'Could not find a spot for your flower. The garden might be too crowded.',
        });
        return;
      }

      // Save to database
      const flower = await flowerService.createFlower(customization, placement);

      // Update spatial hash
      gardenPlacement.addFlower(flower.id, flower.position);

      // Notify mobile client
      socket.emit('mobile:plant_success', { flowerId: flower.id });

      // Broadcast to all display clients
      io.emit('display:flower_planted', flower);

      console.log(`Flower planted: ${flower.id} (${flower.flowerType}) by ${socket.id}`);
    } catch (error) {
      console.error('Error planting flower:', error);
      socket.emit('mobile:plant_error', {
        message: 'An error occurred while planting your flower. Please try again.',
      });
    }
  }
}
