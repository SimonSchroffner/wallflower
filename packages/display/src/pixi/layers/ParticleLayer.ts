/**
 * Particle effects overlay layer
 */

import { Container } from 'pixi.js';
import { ParticleSystem } from '../ParticleSystem';

export class ParticleLayer extends Container {
  private particleSystem: ParticleSystem;

  constructor() {
    super();

    this.particleSystem = new ParticleSystem();
    this.addChild(this.particleSystem);
  }

  /**
   * Emit particles at a position
   */
  emitAt(x: number, y: number, count?: number): void {
    this.particleSystem.emitParticles(x, y, count);
  }

  /**
   * Update particles
   */
  update(deltaTime: number): void {
    this.particleSystem.update(deltaTime);
  }
}
