# Dokploy Deployment Guide

Deploy Wallflower to Dokploy with automatic SSL, domain management, and zero-configuration scaling.

## What is Dokploy?

Dokploy is a self-hosted Platform-as-a-Service (PaaS) that simplifies Docker deployments. It provides:
- Automatic SSL with Let's Encrypt
- Built-in domain management
- Docker Compose support
- Web-based UI
- Automatic deployments from Git

## Prerequisites

1. **Dokploy Instance** - Running on your server
2. **Domain Names** (3 subdomains recommended):
   - `api.yourdomain.com` - Backend
   - `display.yourdomain.com` - Display screen
   - `customize.yourdomain.com` - Mobile customizer
3. **GitHub/GitLab Repository** - Your code pushed to Git

## Quick Deploy

### Step 1: Push to Git

```bash
git add .
git commit -m "Ready for Dokploy deployment"
git push origin main
```

### Step 2: Create Project in Dokploy

1. **Login to Dokploy** - Open your Dokploy dashboard
2. **Create New Project**
   - Click "New Project"
   - Name: `wallflower`
   - Type: "Docker Compose"

3. **Connect Repository**
   - Repository URL: `https://github.com/yourusername/wallflower`
   - Branch: `main`
   - Build context: `.` (root)
   - Compose file: `docker-compose.yml` (or `docker-compose.dokploy.yml`)

### Step 3: Configure Environment Variables

In Dokploy UI, go to **Environment Variables** and add:

```bash
# Database
DB_PASSWORD=your_super_secure_password_change_this

# Domains (update with your actual domains)
DISPLAY_DOMAIN=display.yourdomain.com
MOBILE_DOMAIN=customize.yourdomain.com
BACKEND_DOMAIN=api.yourdomain.com

# CORS
CORS_ORIGIN=https://display.yourdomain.com,https://customize.yourdomain.com

# Frontend URLs (use wss:// for secure WebSocket)
VITE_BACKEND_URL=wss://api.yourdomain.com
VITE_MOBILE_URL=https://customize.yourdomain.com

# Garden Config
MAX_FLOWERS=10000
PLACEMENT_MIN_DISTANCE=30
```

### Step 4: Configure Domains

For each service in Dokploy:

**Backend Service:**
- Domain: `api.yourdomain.com`
- Port: `3001`
- SSL: Enabled (automatic)

**Display Service:**
- Domain: `display.yourdomain.com`
- Port: `80` (internal, nginx)
- SSL: Enabled (automatic)

**Mobile Service:**
- Domain: `customize.yourdomain.com`
- Port: `80` (internal, nginx)
- SSL: Enabled (automatic)

### Step 5: Deploy

1. Click **"Deploy"** in Dokploy
2. Wait for build (5-10 minutes first time)
3. Check logs for each service
4. Verify health checks pass

### Step 6: Configure DNS

Point your domains to Dokploy server:

```
Type    Name        Value               TTL
A       api         YOUR_SERVER_IP      300
A       display     YOUR_SERVER_IP      300
A       customize   YOUR_SERVER_IP      300
```

## Using Dokploy-Optimized Config

For better Dokploy integration, use the optimized compose file:

```bash
# In Dokploy project settings:
# Compose file: docker-compose.dokploy.yml
```

This includes Dokploy-specific labels for:
- Service discovery
- SSL automation
- Port mapping
- Health checks

## Architecture in Dokploy

```
┌─────────────────────────────────┐
│         Dokploy Platform        │
│  (Auto SSL + Domain Management) │
└─────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────┐      ┌─────────┐
│ Display │      │ Mobile  │
│ Service │      │ Service │
│ :5173   │      │ :5174   │
└────┬────┘      └────┬────┘
     │                │
     │    WebSocket   │
     └────────┬───────┘
              ▼
       ┌─────────┐
       │ Backend │
       │ Service │
       │ :3001   │
       └────┬────┘
            │
            ▼
       ┌─────────┐
       │   DB    │
       │ :5432   │
       └─────────┘
```

## Monitoring in Dokploy

Dokploy provides built-in monitoring:

1. **Service Health**
   - View in "Services" tab
   - Green = healthy, Red = issues

2. **Logs**
   - Real-time logs per service
   - Click service → "Logs"

3. **Metrics**
   - CPU, Memory, Network
   - Click service → "Metrics"

4. **Alerts**
   - Configure in Settings
   - Email/Slack notifications

## Automatic Deployments

### Enable Auto-Deploy from Git

1. **Dokploy UI** → Project → Settings
2. **Auto Deploy**: ON
3. **Branch**: `main`
4. **Trigger**: Push to branch

Now every `git push` triggers:
1. Pull latest code
2. Build Docker images
3. Run migrations
4. Deploy new version
5. Zero-downtime rollout

### Manual Deploy

```bash
# In Dokploy UI
Project → Deploy → Click "Deploy Now"
```

## Environment-Specific Configs

### Development

```bash
# .env.dokploy.dev
VITE_BACKEND_URL=wss://api-dev.yourdomain.com
CORS_ORIGIN=https://display-dev.yourdomain.com,https://customize-dev.yourdomain.com
```

### Staging

```bash
# .env.dokploy.staging
VITE_BACKEND_URL=wss://api-staging.yourdomain.com
CORS_ORIGIN=https://display-staging.yourdomain.com,https://customize-staging.yourdomain.com
```

### Production

```bash
# .env.dokploy.prod
VITE_BACKEND_URL=wss://api.yourdomain.com
CORS_ORIGIN=https://display.yourdomain.com,https://customize.yourdomain.com
```

## Scaling in Dokploy

### Horizontal Scaling

Scale backend for high traffic:

1. **Dokploy UI** → Backend Service
2. **Scale**: Set to `3` replicas
3. Dokploy auto-configures load balancing

### Vertical Scaling

Increase resources per service:

```yaml
# In docker-compose.dokploy.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Database Management

### Backup in Dokploy

**Manual Backup:**
```bash
# In Dokploy terminal (Service → Shell)
pg_dump -U wallflower wallflower > backup.sql
```

**Automated Backups:**
1. Dokploy UI → Database Service → Backups
2. Enable: Daily backups
3. Retention: 7 days
4. Storage: Dokploy volumes

### Database Access

**From Dokploy UI:**
1. Service → Shell
2. `psql -U wallflower -d wallflower`

**From External Tool:**
```bash
# Create tunnel in Dokploy
Service → Network → Expose Port 5432
# Then connect with:
psql postgresql://wallflower:password@your-server:5432/wallflower
```

## SSL Certificates

Dokploy handles SSL automatically:
- Uses Let's Encrypt
- Auto-renewal every 60 days
- Forced HTTPS redirect
- HTTP/2 enabled

**Manual SSL Renewal (rarely needed):**
```bash
# In Dokploy UI
Service → SSL → Renew Certificate
```

## Troubleshooting

### Build Fails

**Check build logs:**
1. Dokploy UI → Project → Deployments
2. Click failed deployment
3. View build logs

**Common issues:**
- Missing environment variables
- Wrong compose file path
- Build context incorrect

**Fix:**
```bash
# Verify in Dokploy settings:
Build context: .
Compose file: docker-compose.yml
```

### Service Won't Start

**Check service logs:**
```bash
# In Dokploy UI
Service → Logs → Last 100 lines
```

**Common issues:**
- Database not ready (wait for health check)
- Port conflict (check port mappings)
- Missing environment variables

### Database Connection Failed

**Verify connection:**
```bash
# In backend service shell
nc -zv db 5432
ping db
```

**Check environment:**
```bash
echo $DATABASE_URL
```

### Frontend Shows "Backend Disconnected"

**Check CORS:**
- CORS_ORIGIN includes your frontend domains
- No trailing slashes in URLs

**Check WebSocket URL:**
- Use `wss://` not `ws://` (secure)
- Backend domain is correct
- Port 3001 is accessible

### SSL Certificate Issues

**Force renewal:**
1. Service → SSL → Delete Certificate
2. Service → SSL → Generate New

**Check DNS:**
```bash
dig api.yourdomain.com
# Should point to your server IP
```

## Performance Optimization

### Enable Caching

Already configured in nginx:
- Static assets: 1 year cache
- index.html: no-cache
- Gzip compression enabled

### CDN Integration

Point CloudFlare/Fastly to Dokploy:
1. Add domain to CDN
2. Point to Dokploy server
3. Enable CDN caching rules

### Database Optimization

```sql
-- In psql (Dokploy shell)
-- Analyze queries
EXPLAIN ANALYZE SELECT * FROM flowers LIMIT 100;

-- Vacuum database
VACUUM ANALYZE;

-- Check indexes
\di
```

## Cost Estimation

### Recommended Dokploy Server

For 50-200 concurrent users:
- **4 CPU cores**
- **8GB RAM**
- **50GB SSD**
- **Ubuntu 22.04**

**Providers:**
- Hetzner: €15.40/month (CX32)
- DigitalOcean: $48/month (4GB droplet)
- Vultr: $24/month (4GB instance)

### Dokploy Self-Hosting

- **Dokploy**: Free (self-hosted)
- **Server**: $15-50/month
- **Domain**: $10-15/year
- **Total**: ~$20-60/month

## Security Best Practices

### In Dokploy

- [ ] Use strong DB_PASSWORD (16+ characters)
- [ ] Enable Dokploy authentication
- [ ] Restrict Dokploy port (change from default)
- [ ] Enable firewall (UFW)
- [ ] Regular updates (apt update && apt upgrade)

### Application

- [ ] Set proper CORS_ORIGIN (no wildcards)
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting (already configured)
- [ ] Regular backups (enable in Dokploy)

### Server

```bash
# Basic server hardening
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# Install fail2ban
sudo apt install fail2ban
```

## Migrations

Migrations run automatically on deploy via:
```bash
# In backend Dockerfile CMD
pnpm prisma migrate deploy && node dist/index.js
```

**Manual migration:**
```bash
# In Dokploy backend shell
cd /app/packages/backend
pnpm prisma migrate deploy
```

## Rollback

If deployment fails:

1. **Dokploy UI** → Deployments
2. Find previous successful deployment
3. Click **"Rollback to this version"**
4. Confirm rollback

Dokploy keeps last 10 deployments for rollback.

## Support

### Dokploy Resources
- Docs: https://dokploy.com/docs
- Discord: https://dokploy.com/discord
- GitHub: https://github.com/dokploy/dokploy

### Wallflower Issues
- Check logs first: `Service → Logs`
- Review environment variables
- Verify domain DNS records
- Check health endpoints

## Quick Commands

```bash
# View all services
dokploy service ls

# View logs (if using CLI)
dokploy logs wallflower-backend

# Restart service
dokploy restart wallflower-backend

# Shell into service
dokploy shell wallflower-backend

# Run command in service
dokploy exec wallflower-backend "pnpm prisma studio"
```

## Next Steps

After successful deployment:
1. Test full flower planting flow
2. Set up monitoring/alerts
3. Configure backups schedule
4. Test with multiple devices
5. Load test with Artillery (see main docs)

---

**Ready to deploy?** Push to Git and click Deploy in Dokploy! 🚀
