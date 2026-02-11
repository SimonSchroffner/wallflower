/**
 * Simple rate limiter to prevent spam planting
 */

export class RateLimiter {
  private clientLastRequest: Map<string, number>;
  private windowMs: number;

  constructor(windowMs: number = 5000, _maxRequests: number = 1) {
    this.clientLastRequest = new Map();
    this.windowMs = windowMs;
  }

  /**
   * Check if a client is allowed to make a request
   */
  checkLimit(clientId: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const lastRequest = this.clientLastRequest.get(clientId);

    if (!lastRequest) {
      this.clientLastRequest.set(clientId, now);
      return { allowed: true };
    }

    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < this.windowMs) {
      const retryAfter = Math.ceil((this.windowMs - timeSinceLastRequest) / 1000);
      return { allowed: false, retryAfter };
    }

    this.clientLastRequest.set(clientId, now);
    return { allowed: true };
  }

  /**
   * Clean up old entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [clientId, lastRequest] of this.clientLastRequest.entries()) {
      if (now - lastRequest > this.windowMs * 2) {
        this.clientLastRequest.delete(clientId);
      }
    }
  }
}
