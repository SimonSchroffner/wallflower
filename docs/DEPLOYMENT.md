# Wallflower Deployment Guide

## Architecture Overview

```
┌─────────────────┐
│   Vercel CDN    │  Mobile Frontend (port 443)
│  customize.app  │  https://customize.yourapp.com
└────────┬────────┘
         │
         │ WebSocket
         ▼
┌─────────────────┐
│  Railway/Render │  Backend Server (port 3001)
│   api.app.com   │  wss://api.yourapp.com
└────────┬────────┘
         │
         │ WebSocket
         ▼
┌─────────────────┐
│   Vercel CDN    │  Display Frontend (port 443)
│  display.app    │  https://display.yourapp.com
└─────────────────┘
```

## Backend Deployment (Railway)

### Prerequisites

- Railway account (hobby plan: $5/month)
- GitHub repository with your code

### Steps

1. **Create New Project on Railway**
   - Go to railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

2. **Add PostgreSQL Database**
   - In project dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway automatically sets DATABASE_URL

3. **Configure Environment Variables**

   Go to backend service → Variables tab:
   ```
   DATABASE_URL=postgresql://... (auto-set by Railway)
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://display.yourapp.com,https://customize.yourapp.com
   MAX_FLOWERS=10000
   PLACEMENT_MIN_DISTANCE=30
   ```

4. **Configure Build Settings**

   Settings → Build:
   - Root Directory: `packages/backend`
   - Build Command: `pnpm install --frozen-lockfile && pnpm build`
   - Start Command: `pnpm start`

5. **Run Database Migrations**

   After first deploy, in Railway terminal:
   ```bash
   cd packages/backend
   npx prisma migrate deploy
   ```

6. **Get Your Backend URL**

   Settings → Networking → Generate Domain
   - Railway provides: `your-app.railway.app`
   - Or add custom domain

## Frontend Deployment (Vercel)

### Display Client

1. **Create New Project on Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Framework Preset: Vite

2. **Configure Build Settings**
   - Root Directory: `packages/display`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter display build`
   - Output Directory: `packages/display/dist`

3. **Environment Variables**
   ```
   VITE_BACKEND_URL=wss://api.yourapp.com
   VITE_MOBILE_URL=https://customize.yourapp.com
   ```

4. **Deploy**
   - Vercel will auto-deploy on push to main
   - Get URL: `display.vercel.app`

### Mobile Client

1. **Create Another Project on Vercel**
   - Same repo, different root directory
   - Framework Preset: Vite

2. **Configure Build Settings**
   - Root Directory: `packages/mobile`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter mobile build`
   - Output Directory: `packages/mobile/dist`

3. **Environment Variables**
   ```
   VITE_BACKEND_URL=wss://api.yourapp.com
   ```

4. **Deploy**
   - Get URL: `customize.vercel.app`

## Alternative: Render Deployment

### Backend on Render

1. **Create Web Service**
   - Root Directory: `packages/backend`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`

2. **Add PostgreSQL Database**
   - New → PostgreSQL
   - Link to web service (auto-sets DATABASE_URL)

3. **Environment Variables** (same as Railway)

### Cost Comparison

| Service | Railway | Render | Vercel |
|---------|---------|--------|--------|
| Backend | $5/month | $7/month | N/A |
| Database | $5/month | $7/month | N/A |
| Frontend | N/A | N/A | Free |
| **Total** | **$10/month** | **$14/month** | **$10-14/month** |

## Custom Domain Setup

### Backend (Railway/Render)

1. Add custom domain in dashboard: `api.yourapp.com`
2. Add CNAME record in your DNS:
   ```
   CNAME api.yourapp.com → your-app.railway.app
   ```
3. Wait for SSL certificate (automatic)

### Frontend (Vercel)

1. Add custom domain in project settings
2. Add records in your DNS:
   ```
   CNAME display.yourapp.com → cname.vercel-dns.com
   CNAME customize.yourapp.com → cname.vercel-dns.com
   ```
3. SSL automatic

## Production Checklist

- [ ] Backend deployed and healthy (`/health` returns 200)
- [ ] Database migrated (`prisma migrate deploy`)
- [ ] Environment variables set correctly
- [ ] CORS origins include both frontend URLs
- [ ] Display frontend loads and connects (green status)
- [ ] Mobile frontend loads and connects
- [ ] QR code on display points to mobile URL
- [ ] Test full flow: scan → customize → plant → see on display
- [ ] Check WebSocket connection on mobile network (not just WiFi)
- [ ] Monitor error logs after deployment

## Monitoring & Debugging

### Backend Logs

Railway/Render provide built-in log streaming:
```bash
# Railway CLI
railway logs

# Render
View in dashboard → Logs tab
```

### Frontend Error Tracking

Add Sentry or LogRocket for production error tracking:

```typescript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Performance Monitoring

- Monitor WebSocket connection count: `GET /stats`
- Track flower creation rate
- Monitor PixiJS FPS in display client
- Database query performance (Prisma logs)

## Scaling Considerations

### Horizontal Scaling (Multiple Backend Instances)

**Challenge:** Socket.io needs sticky sessions or Redis adapter

**Solution:** Use Socket.io Redis adapter:
```typescript
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ url: "redis://..." });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Database Connection Pooling

Already handled by Prisma. Configure in `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection limit
  // relationMode = "prisma"
}
```

### CDN for Static Assets

Vercel includes global CDN automatically. For self-hosting:
- Use Cloudflare for frontend caching
- Serve PixiJS textures from CDN

## Backup Strategy

### Database Backups

Railway/Render provide automatic daily backups.

**Manual backup:**
```bash
# Export
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Scheduled Cleanup

Add cron job to delete old flowers:
```typescript
// Keep only last 50,000 flowers
setInterval(async () => {
  const count = await prisma.flower.count();
  if (count > 50000) {
    await flowerService.deleteOldestFlowers(count - 50000);
  }
}, 86400000); // Daily
```

## Security Hardening

- [ ] Enable rate limiting (already implemented)
- [ ] Add request size limits
- [ ] Sanitize all user inputs (Zod validation does this)
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your domains
- [ ] Add CSP headers to frontends
- [ ] Keep dependencies updated (`pnpm update`)

## Cost Optimization

- Use free tier PostgreSQL if <1GB data
- Enable Vercel analytics only if needed
- Monitor Railway/Render usage to avoid overages
- Consider SQLite for small installations (change Prisma datasource)

## Rollback Plan

If deployment fails:

1. **Vercel:** Instant rollback to previous deployment in dashboard
2. **Railway/Render:** Redeploy previous commit from GitHub
3. **Database:** Restore from automatic backup

## Support

For deployment issues:
- Railway: https://railway.app/help
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
