# 🚀 Quick Start Guide

Get the Wallflower garden running in 5 minutes!

## Prerequisites

You need:
- Node.js 20+ installed ✅
- PostgreSQL running (local or cloud)
- pnpm installed ✅

## Setup Steps

### 1. Install Dependencies ✅

Already done! All packages are installed.

### 2. Configure Database

**Option A: Local PostgreSQL**

If you have PostgreSQL installed locally:

```bash
# Create database
createdb wallflower

# Update connection string in packages/backend/.env
DATABASE_URL="postgresql://yourusername@localhost:5432/wallflower?schema=public"
```

**Option B: Cloud PostgreSQL (Recommended for testing)**

Use a free PostgreSQL service:

- **Supabase:** https://supabase.com (free tier)
- **Neon:** https://neon.tech (free tier)
- **ElephantSQL:** https://elephantsql.com (free tier)

Get your connection string and paste it into `packages/backend/.env`:

```bash
DATABASE_URL="postgresql://user:yoloSwag9876#@host:5432/database?sslmode=require"
```

**Option C: Docker (Easiest for development)**

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name wallflower-db \
  -e POSTGRES_PASSWORD=wallflower \
  -e POSTGRES_DB=wallflower \
  -p 5432:5432 \
  postgres:15

# Update packages/backend/.env
DATABASE_URL="postgresql://postgres:wallflower@localhost:5432/wallflower?schema=public"
```

### 3. Run Database Migrations

```bash
cd packages/backend
npx prisma migrate deploy
```

This creates the `flowers` table in your database.

### 4. Start Development Servers

Open **3 terminal windows** (or use tmux/screen):

**Terminal 1 - Backend:**
```bash
pnpm backend:dev
# Server starts on http://localhost:3001
```

**Terminal 2 - Display:**
```bash
pnpm display:dev
# Opens on http://localhost:5173
```

**Terminal 3 - Mobile:**
```bash
pnpm mobile:dev
# Opens on http://localhost:5174
```

**Or start all at once:**
```bash
pnpm dev
# Starts all services in parallel
```

## Testing It Out

1. Open http://localhost:5173 in your browser (this is the display screen)
2. You should see:
   - Empty garden with gradient background
   - QR code in bottom-right corner
   - Green "Connected" indicator in top-right

3. Open http://localhost:5174 on your phone or in another browser tab
4. Customize your flower:
   - Choose flower type
   - Pick a color
   - Select leaf style
   - Adjust petal count
   - Confirm and plant!

5. Watch your flower appear on the display screen! 🌸

## Troubleshooting

### Backend won't start

**Error: "Can't reach database server"**
- Check PostgreSQL is running
- Verify DATABASE_URL in `packages/backend/.env`
- Try connecting with psql: `psql $DATABASE_URL`

**Error: "Port 3001 already in use"**
- Kill existing process: `lsof -ti:3001 | xargs kill`
- Or change PORT in `packages/backend/.env`

### Display shows "Disconnected"

- Backend must be running first
- Check browser console for errors
- Verify VITE_BACKEND_URL in `packages/display/.env` (default: ws://localhost:3001)

### Mobile can't plant flowers

- Check browser console for connection errors
- Ensure backend is running
- Verify no CORS errors (should be configured for localhost)

### Prisma errors

**Regenerate client:**
```bash
cd packages/backend
npx prisma generate
```

**Reset database (DELETES ALL DATA):**
```bash
cd packages/backend
npx prisma migrate reset
```

## Development Tips

### See what's in the database

```bash
cd packages/backend
pnpm db:studio
# Opens Prisma Studio at http://localhost:5555
```

### Monitor WebSocket connections

```bash
# Check server stats
curl http://localhost:3001/stats
```

### Clear all flowers

```bash
cd packages/backend
npx prisma db execute --stdin <<SQL
DELETE FROM flowers;
SQL
```

### Hot reload

All packages support hot module replacement:
- Edit any file and see changes instantly
- No need to restart servers

## Next Steps

Once everything works locally:

1. **Customize the garden:**
   - Adjust colors in `packages/shared/src/constants/customization.ts`
   - Change animation speeds in `packages/shared/src/constants/garden.ts`
   - Modify flower placement in `packages/backend/src/services/garden-placement.ts`

2. **Deploy to production:**
   - Follow `docs/DEPLOYMENT.md` for Railway/Vercel setup
   - Takes ~20 minutes to deploy everything

3. **Add more features:**
   - Weather effects (rain, wind)
   - Flower lifecycle (wilting)
   - Admin dashboard
   - Time-lapse recording

## Getting Help

- Check `README.md` for detailed documentation
- See `docs/API.md` for WebSocket event reference
- Read `docs/DEPLOYMENT.md` for hosting instructions

---

**Ready to go?** Run `pnpm dev` to start all services at once! 🌸
