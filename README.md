# 🌸 Wallflower - Interactive Virtual Garden

An interactive art installation where visitors can customize and plant virtual flowers that appear in real-time on a large display screen.

## Overview

This project creates an immersive digital garden experience for art shows and exhibitions. Visitors scan a QR code, customize a flower on their mobile device, and watch it bloom instantly in the shared virtual garden displayed on a projector or large screen.

### Key Features

- **Real-time synchronization** between mobile devices and display screen via WebSockets
- **Persistent garden state** - flowers survive server restarts (PostgreSQL database)
- **6 flower types** with full customization (color, leaves, petals)
- **High performance** - handles thousands of flowers at 60fps using PixiJS WebGL
- **Flat/minimalist design** - modern aesthetic optimized for projection
- **Mobile-first UI** - smooth touch interactions with arrow navigation
- **Rate limiting** - prevents spam (1 flower per user every 5 seconds)

## Architecture

### Monorepo Structure

```
wallflower/
├── packages/
│   ├── shared/       # TypeScript types, Zod schemas, constants
│   ├── backend/      # Node.js + Express + Socket.io + Prisma
│   ├── display/      # React + PixiJS garden renderer
│   └── mobile/       # React + Tailwind customizer
```

### Technology Stack

- **Package Manager:** pnpm
- **Language:** TypeScript
- **Backend:** Express, Socket.io, Prisma, PostgreSQL
- **Display:** React, PixiJS v8 (WebGL), Zustand, Socket.io-client
- **Mobile:** React, Tailwind CSS, Framer Motion, Socket.io-client

## Getting Started

### Choose Your Deployment Method

**🐳 Option 1: Docker (Recommended - Easiest)**

Quick deployment with everything included:

```bash
# 1. Configure environment
cp .env.docker .env
# Edit .env with your IP/domain

# 2. Deploy with one command
./scripts/docker-deploy.sh

# Or manually:
docker-compose up -d
```

See [Docker Deployment Guide](docs/DOCKER_DEPLOYMENT.md) for details.

**💻 Option 2: Local Development**

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+ (local or cloud instance)
- Docker (for Option 1)


### Installation

1. **Clone and install dependencies:**

```bash
cd wallflower
pnpm install
```

2. **Set up environment variables:**

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your PostgreSQL connection string

# Display
cp packages/display/.env.example packages/display/.env

# Mobile
cp packages/mobile/.env.example packages/mobile/.env
```

3. **Set up the database:**

```bash
pnpm db:migrate
```

This creates the PostgreSQL database schema using Prisma migrations.

### Development

Run all services in parallel:

```bash
pnpm dev
```

Or run individually:

```bash
# Backend server (port 3001)
pnpm backend:dev

# Display screen (port 5173)
pnpm display:dev

# Mobile customizer (port 5174)
pnpm mobile:dev
```

### Testing the Flow

1. Open display at `http://localhost:5173` on your projector/large screen
2. Scan the QR code with your phone, or open `http://localhost:5174`
3. Customize your flower (type, color, leaves, petals)
4. Click "Plant Flower"
5. Watch it appear on the display screen with a growing animation!

## Production Deployment

### Recommended Hosting

- **Backend:** Railway or Render ($7-10/month)
  - Automatic WebSocket support
  - Built-in PostgreSQL
  - Environment variables management

- **Frontends:** Vercel (free tier)
  - Deploy display and mobile as separate projects
  - Automatic deployments from GitHub
  - Global CDN included

### Build Commands

```bash
# Build all packages
pnpm build

# Backend
cd packages/backend && pnpm build && pnpm start

# Display
cd packages/display && pnpm build

# Mobile
cd packages/mobile && pnpm build
```

### Environment Variables (Production)

```bash
# Backend
DATABASE_URL=postgresql://...
PORT=3001
CORS_ORIGIN=https://display.yourapp.com,https://customize.yourapp.com
MAX_FLOWERS=10000

# Display
VITE_BACKEND_URL=wss://api.yourapp.com
VITE_MOBILE_URL=https://customize.yourapp.com

# Mobile
VITE_BACKEND_URL=wss://api.yourapp.com
```

## Database Management

```bash
# Create a new migration
cd packages/backend
npx prisma migrate dev --name your_migration_name

# Push schema changes without migration
pnpm db:push

# Open Prisma Studio (database GUI)
pnpm db:studio

# Generate Prisma client (after schema changes)
cd packages/backend
npx prisma generate
```

## Project Structure

### Shared Package (`packages/shared/`)

Contains TypeScript types, Zod validation schemas, and constants used across all packages:

- `types/` - FlowerData, SocketEvents, Garden types
- `schemas/` - Zod validation schemas
- `constants/` - Flower types, colors, garden config

### Backend (`packages/backend/`)

Node.js server with WebSocket support:

- `services/garden-placement.ts` - Poisson disc placement algorithm
- `services/flower-service.ts` - Database CRUD operations
- `socket/socket-manager.ts` - WebSocket orchestration
- `socket/handlers/` - Mobile and display event handlers

### Display (`packages/display/`)

React + PixiJS garden renderer:

- `pixi/GardenRenderer.ts` - Main WebGL rendering engine
- `pixi/layers/` - Background, Flower, and Particle layers
- `pixi/FlowerSprite.ts` - Individual flower sprite
- `components/Garden.tsx` - React wrapper for PixiJS
- `components/QRCodeDisplay.tsx` - QR code overlay

### Mobile (`packages/mobile/`)

React + Tailwind customizer:

- `components/Customizer.tsx` - Main wizard container
- `components/steps/` - Individual customization steps
- `hooks/useCustomizer.ts` - Customization state management
- `socket/mobile-socket.ts` - WebSocket client

## Performance

### Tested Capacity

- **Concurrent users:** 200+
- **Total flowers:** 10,000 (configurable limit)
- **Display FPS:** Stable 60fps with 2,000+ flowers
- **Latency:** <200ms from mobile submit to display render

### Optimization Techniques

- **PixiJS WebGL** - Hardware-accelerated rendering
- **Spatial hashing** - O(1) collision detection
- **Texture atlasing** - Single draw call for all flowers
- **Object pooling** - Reuse sprite instances
- **Rate limiting** - Prevent server overload

## Troubleshooting

### Backend won't start

- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Run `pnpm db:migrate` to create schema

### Display shows no flowers

- Check WebSocket connection (green indicator in top-right)
- Verify VITE_BACKEND_URL in `.env`
- Check browser console for errors

### Mobile can't connect

- Ensure backend is running
- Check VITE_BACKEND_URL matches backend address
- Verify CORS_ORIGIN includes mobile URL

### Flowers overlap

- Adjust PLACEMENT_MIN_DISTANCE in backend `.env`
- Reduce MAX_FLOWERS if garden is too crowded

## Development Tips

### Hot Module Replacement

All packages support HMR - changes reflect instantly without refresh.

### Database Reset

```bash
# WARNING: Deletes all data
cd packages/backend
npx prisma migrate reset
```

### View WebSocket Traffic

Open browser DevTools → Network → WS → Click connection → Messages

### Monitor Performance

Display FPS shown in browser DevTools Performance tab.

## Customization

### Add More Flower Types

1. Add to `packages/shared/src/constants/flower-types.ts`
2. Create texture in `packages/display/public/textures/`
3. Update TextureManager to load new texture

### Change Colors

Edit `packages/shared/src/constants/customization.ts` - PRESET_COLORS array

### Adjust Animation Speed

Modify `packages/shared/src/constants/garden.ts` - GARDEN_CONFIG values

## License

MIT

## Credits

Built for interactive art installations. Designed to handle large crowds at exhibitions and public displays.

---

**Need help?** Check the `/docs` folder for detailed API documentation and deployment guides.
