/**
 * Main PixiJS Application wrapper for garden rendering
 */

import { Application } from 'pixi.js';
import { BackgroundLayer } from './layers/BackgroundLayer';
import { FlowerLayer } from './layers/FlowerLayer';
import { ParticleLayer } from './layers/ParticleLayer';
import { TextureManager } from './TextureManager';
import type { FlowerData } from '@wallflower/shared';

export class GardenRenderer {
  private app: Application;
  private textureManager: TextureManager;
  private backgroundLayer: BackgroundLayer | null = null;
  private flowerLayer: FlowerLayer | null = null;
  private particleLayer: ParticleLayer | null = null;
  private resizeHandler: (() => void) | null = null;
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(canvas: HTMLCanvasElement) {
    // Create PixiJS application
    this.app = new Application();

    // Create texture manager
    this.textureManager = new TextureManager();

    // Start initialization (but don't wait for it in constructor)
    this.initPromise = this.init(canvas);
  }

  /**
   * Initialize PixiJS application
   */
  private async init(canvas: HTMLCanvasElement): Promise<void> {
    await this.app.init({
      canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x87CEEB,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    // Load textures
    await this.textureManager.loadTextures();

    // Create layers
    this.backgroundLayer = new BackgroundLayer(this.app.screen.width, this.app.screen.height);
    this.flowerLayer = new FlowerLayer(this.textureManager);
    this.particleLayer = new ParticleLayer();

    // Add layers to stage
    this.app.stage.addChild(this.backgroundLayer);
    this.app.stage.addChild(this.flowerLayer);
    this.app.stage.addChild(this.particleLayer);

    // Start render loop
    this.app.ticker.add(this.update.bind(this));

    // Handle window resize
    this.resizeHandler = this.resize.bind(this);
    window.addEventListener('resize', this.resizeHandler);

    this.isInitialized = true;
    console.log('✓ Garden renderer initialized');
  }

  /**
   * Wait for initialization to complete
   */
  async waitForInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  /**
   * Update loop (called every frame)
   */
  private update(ticker: any): void {
    const deltaTime = ticker.deltaMS;

    // Update flowers
    if (this.flowerLayer) {
      this.flowerLayer.update(deltaTime);
    }

    // Update particles
    if (this.particleLayer) {
      this.particleLayer.update(deltaTime);
    }
  }

  /**
   * Add a flower to the garden
   */
  addFlower(data: FlowerData): void {
    if (!this.flowerLayer || !this.particleLayer) return;

    this.flowerLayer.addFlower(data);

    // Emit particles at flower position
    this.particleLayer.emitAt(data.position.x, data.position.y, 15);
  }

  /**
   * Load multiple flowers
   */
  loadFlowers(flowers: FlowerData[]): void {
    if (!this.flowerLayer) return;

    for (const flowerData of flowers) {
      this.flowerLayer.addFlower(flowerData);
    }

    console.log(`✓ Loaded ${flowers.length} flowers`);
  }

  /**
   * Clear all flowers
   */
  clearFlowers(): void {
    if (!this.flowerLayer) return;
    this.flowerLayer.clearFlowers();
  }

  /**
   * Handle window resize
   */
  private resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.app.renderer.resize(width, height);

    if (this.backgroundLayer) {
      this.backgroundLayer.resize(width, height);
    }
  }

  /**
   * Get renderer stats
   */
  getStats() {
    return {
      fps: Math.round(this.app.ticker.FPS),
      flowers: this.flowerLayer?.getFlowerCount() || 0,
    };
  }

  /**
   * Cleanup
   */
  async destroy(): Promise<void> {
    // Wait for initialization to complete before destroying
    if (this.initPromise) {
      try {
        await this.initPromise;
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    }

    if (!this.isInitialized) {
      return;
    }

    // Remove resize listener
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    // Stop ticker
    if (this.app.ticker) {
      this.app.ticker.stop();
    }

    // Destroy layers
    if (this.flowerLayer) {
      this.flowerLayer.destroy();
      this.flowerLayer = null;
    }

    if (this.particleLayer) {
      this.particleLayer.destroy();
      this.particleLayer = null;
    }

    if (this.backgroundLayer) {
      this.backgroundLayer.destroy();
      this.backgroundLayer = null;
    }

    // Destroy texture manager
    this.textureManager.destroy();

    // Destroy PixiJS app
    try {
      await this.app.destroy(true, { children: true });
    } catch (error) {
      console.error('Error destroying PixiJS app:', error);
    }

    this.isInitialized = false;
  }
}
