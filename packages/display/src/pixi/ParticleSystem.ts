/**
 * Simple particle system for planting effects
 */

import { Graphics, Container } from 'pixi.js';

interface Particle {
  graphics: Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem extends Container {
  private particles: Particle[] = [];

  /**
   * Emit particles at a position
   */
  emit(x: number, y: number, count: number = 15): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 1 + Math.random() * 2;

      const graphics = new Graphics();
      graphics.circle(0, 0, 2 + Math.random() * 3);
      graphics.fill({ color: 0xFFFFFF, alpha: 0.8 });
      graphics.position.set(x, y);

      const particle: Particle = {
        graphics,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Upward bias
        life: 0,
        maxLife: 500 + Math.random() * 500,
      };

      this.particles.push(particle);
      this.addChild(graphics);
    }
  }

  /**
   * Update particles
   */
  update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life += deltaTime;

      if (particle.life >= particle.maxLife) {
        // Remove dead particle
        this.removeChild(particle.graphics);
        particle.graphics.destroy();
        this.particles.splice(i, 1);
        continue;
      }

      // Update position
      particle.graphics.x += particle.vx;
      particle.graphics.y += particle.vy;
      particle.vy += 0.1; // Gravity

      // Fade out
      const lifeRatio = particle.life / particle.maxLife;
      particle.graphics.alpha = 1 - lifeRatio;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    for (const particle of this.particles) {
      particle.graphics.destroy();
    }
    this.particles = [];
    super.destroy({ children: true });
  }
}
