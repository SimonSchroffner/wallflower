/**
 * Main garden component with PixiJS canvas
 */

import { useEffect, useRef } from 'react';
import { GardenRenderer } from '../pixi/GardenRenderer';
import { useGardenStore } from '../store/garden-store';
import { displaySocket } from '../socket/display-socket';

export function Garden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GardenRenderer | null>(null);
  const isInitializedRef = useRef(false);
  const flowers = useGardenStore((state) => state.flowers);
  const previousFlowerCount = useRef(0);

  // Initialize PixiJS renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    let mounted = true;
    const renderer = new GardenRenderer(canvasRef.current);
    rendererRef.current = renderer;

    // Wait for renderer initialization
    renderer.waitForInit().then(() => {
      if (mounted) {
        isInitializedRef.current = true;
        console.log('Renderer ready');
      }
    }).catch((error) => {
      console.error('Failed to initialize renderer:', error);
    });

    // Connect to backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:3001';
    displaySocket.connect(backendUrl);

    return () => {
      mounted = false;
      isInitializedRef.current = false;

      // Async cleanup
      renderer.destroy().catch((error) => {
        console.error('Error destroying renderer:', error);
      });

      displaySocket.disconnect();
    };
  }, []);

  // Load initial flowers
  useEffect(() => {
    if (!rendererRef.current || !isInitializedRef.current) return;

    const currentCount = flowers.size;

    if (currentCount > 0 && previousFlowerCount.current === 0) {
      // Initial load
      const flowerArray = Array.from(flowers.values());
      rendererRef.current.loadFlowers(flowerArray);
    } else if (currentCount > previousFlowerCount.current) {
      // New flower added
      const flowerArray = Array.from(flowers.values());
      const newFlower = flowerArray[flowerArray.length - 1];
      if (newFlower) {
        rendererRef.current.addFlower(newFlower);
      }
    }

    previousFlowerCount.current = currentCount;
  }, [flowers]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
