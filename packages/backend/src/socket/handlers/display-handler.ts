/**
 * Socket.io event handlers for display clients
 */

import type { Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@wallflower/shared';
import { DisplayReadySchema } from '@wallflower/shared';
import { flowerService } from '../../services/flower-service.js';
import type { GardenPlacement } from '../../services/garden-placement.js';

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export class DisplayHandler {
  /**
   * Handle display client connection
   */
  handleConnection(socket: TypedSocket): void {
    console.log(`Display client connected: ${socket.id}`);

    socket.data.clientType = 'display';

    socket.emit('connection_established', { clientType: 'display' });
  }

  /**
   * Handle display ready event (sends initial garden state)
   */
  async handleDisplayReady(
    socket: TypedSocket,
    data: any,
    gardenPlacement: GardenPlacement
  ): Promise<void> {
    try {
      // Validate data
      const validation = DisplayReadySchema.safeParse(data);
      if (!validation.success) {
        console.error('Invalid display ready data:', validation.error);
        return;
      }

      const { displayId, bounds } = validation.data;
      socket.data.displayId = displayId;

      // Update garden bounds
      gardenPlacement.updateBounds(bounds);

      // Load all flowers from database
      const flowers = await flowerService.getAllFlowers();

      // Reload spatial hash with existing flowers
      gardenPlacement.loadExistingFlowers(flowers);

      // Send initial state to display
      socket.emit('display:initial_state', { flowers });

      console.log(
        `Display ${displayId} ready: ${bounds.width}x${bounds.height}, ${flowers.length} flowers`
      );
    } catch (error) {
      console.error('Error handling display ready:', error);
    }
  }

  /**
   * Handle display request sync (manual refresh)
   */
  async handleRequestSync(socket: TypedSocket): Promise<void> {
    try {
      const flowers = await flowerService.getAllFlowers();
      socket.emit('display:initial_state', { flowers });
      socket.emit('display:sync_complete');
      console.log(`Display ${socket.id} synced: ${flowers.length} flowers`);
    } catch (error) {
      console.error('Error syncing display:', error);
    }
  }
}
