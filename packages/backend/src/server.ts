/**
 * Express + Socket.io server setup
 */

import express from 'express';
import { createServer } from 'http';
import { networkInterfaces } from 'os';
import cors from 'cors';
import { SocketManager } from './socket/socket-manager.js';
import { connectDatabase } from './config/database.js';

const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Get local network IP address
 */
function getLocalIP(): string | null {
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;

    for (const net of interfaces) {
      // Skip internal (loopback) and non-IPv4 addresses
      const isIPv4 = net.family === 'IPv4' || net.family === 4;
      if (isIPv4 && !net.internal) {
        return net.address;
      }
    }
  }

  return null;
}

export async function createApp() {
  const app = express();
  const httpServer = createServer(app);

  // Middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Initialize Socket.io
  const socketManager = new SocketManager(httpServer);

  // Stats endpoint
  app.get('/stats', (req, res) => {
    const stats = socketManager.getStats();
    res.json(stats);
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return { app, httpServer, socketManager };
}

export async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Create app
    const { httpServer } = await createApp();

    // Get local IP
    const localIP = getLocalIP();

    // Start server on all network interfaces
    httpServer.listen(PORT, HOST, () => {
      console.log(`
╔═══════════════════════════════════════╗
║   Wallflower Backend Server Started   ║
╚═══════════════════════════════════════╝

🌸 Server running on port ${PORT}
🔌 WebSocket ready for connections

Local URLs:
  📍 http://localhost:${PORT}
  🌐 http://127.0.0.1:${PORT}${localIP ? `\n  📱 http://${localIP}:${PORT}` : ''}

Endpoints:
  📊 Stats:  /stats
  ❤️  Health: /health

Environment: ${process.env.NODE_ENV || 'development'}
Listening on: ${HOST}
      `);

      if (localIP) {
        console.log(`\n💡 For mobile devices on the same network, use:`);
        console.log(`   Backend:  ws://${localIP}:${PORT}`);
        console.log(`   Display:  http://${localIP}:5173`);
        console.log(`   Mobile:   http://${localIP}:5174\n`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
