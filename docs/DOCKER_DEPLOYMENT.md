# Docker Deployment Guide

Deploy the entire Wallflower application using Docker Compose, including PostgreSQL database, backend API, display frontend, and mobile frontend.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

## Quick Start

### 1. Configure Environment

```bash
# Copy environment template
cp .env.docker .env

# Edit .env with your settings
nano .env
```

**Important variables to set:**
- `DB_PASSWORD` - Change from default
- `CORS_ORIGIN` - Add your domain/IP addresses
- `VITE_BACKEND_URL` - WebSocket URL for frontends
- `VITE_MOBILE_URL` - Mobile URL for QR code

### 2. Build and Start

```bash
# Build all images (first time only)
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Check Services

```bash
# Check all services are running
docker-compose ps

# Check backend health
curl http://localhost:3001/health

# Check display
curl http://localhost:5173

# Check mobile
curl http://localhost:5174
```

### 4. Access the Application

- **Display:** http://localhost:5173
- **Mobile:** http://localhost:5174
- **Backend API:** http://localhost:3001
- **Database:** localhost:5432

## Configuration

### Network Access (Local Network)

To access from mobile devices on the same network:

1. **Find your local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Or use hostname
   hostname -I
   ```

2. **Update `.env`:**
   ```bash
   # Replace 192.168.1.83 with your IP
   CORS_ORIGIN=http://192.168.1.83:5173,http://192.168.1.83:5174
   VITE_BACKEND_URL=ws://192.168.1.83:3001
   VITE_MOBILE_URL=http://192.168.1.83:5174
   ```

3. **Rebuild and restart:**
   ```bash
   docker-compose down
   docker-compose build --no-cache display mobile
   docker-compose up -d
   ```

### Production Deployment

For production with a domain:

```bash
# .env
CORS_ORIGIN=https://display.yourapp.com,https://customize.yourapp.com
VITE_BACKEND_URL=wss://api.yourapp.com
VITE_MOBILE_URL=https://customize.yourapp.com
```

Add a reverse proxy (nginx/traefik) for SSL termination.

## Docker Compose Commands

### Start/Stop

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Rebuild

```bash
# Rebuild all services
docker-compose build

# Rebuild without cache
docker-compose build --no-cache

# Rebuild specific service
docker-compose build backend
```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec db psql -U wallflower -d wallflower

# Run migrations manually
docker-compose exec backend pnpm prisma migrate deploy

# Backup database
docker-compose exec db pg_dump -U wallflower wallflower > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U wallflower -d wallflower
```

### Service Management

```bash
# Restart a service
docker-compose restart backend

# Scale a service (for load balancing)
docker-compose up -d --scale backend=3

# View resource usage
docker stats
```

## Architecture

```
┌─────────────────┐
│   Display       │  :5173 → nginx → React + PixiJS
│   (Frontend)    │
└────────┬────────┘
         │
         ├── WebSocket
         ▼
┌─────────────────┐
│   Backend       │  :3001 → Node.js + Socket.io
│   (API Server)  │
└────────┬────────┘
         │
         ├── PostgreSQL
         ▼
┌─────────────────┐
│   Database      │  :5432 → PostgreSQL 15
│   (PostgreSQL)  │
└─────────────────┘
         ▲
         │
         │ WebSocket
         │
┌─────────────────┐
│   Mobile        │  :5174 → nginx → React + Tailwind
│   (Frontend)    │
└─────────────────┘
```

## Troubleshooting

### Backend Won't Start

```bash
# Check backend logs
docker-compose logs backend

# Common issue: Database not ready
# Wait for database health check, then restart
docker-compose restart backend

# Check database connection
docker-compose exec backend sh
nc -zv db 5432
```

### Frontend Build Fails

```bash
# Clear build cache
docker-compose build --no-cache display mobile

# Check build logs
docker-compose logs display

# Verify environment variables
docker-compose exec display env | grep VITE
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec backend sh
ping db
```

### Port Already in Use

```bash
# Find process using port
lsof -ti:3001

# Kill process or change port in docker-compose.yml
# Edit ports section: "3002:3001"
```

### Out of Memory

```bash
# Check Docker resources
docker stats

# Increase Docker Desktop memory
# Settings → Resources → Memory: 4GB+

# Or set memory limits in docker-compose.yml
services:
  backend:
    mem_limit: 512m
```

## Performance Tuning

### Production Optimizations

```yaml
# docker-compose.override.yml
version: '3.8'

services:
  backend:
    environment:
      NODE_ENV: production
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  db:
    command: postgres -c shared_buffers=256MB -c max_connections=100
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

### Database Connection Pooling

Already configured in Prisma. Adjust in `packages/backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Monitoring

### Health Checks

```bash
# Check all health endpoints
curl http://localhost:3001/health
curl http://localhost:5173
curl http://localhost:5174

# Automated health check script
./scripts/health-check.sh
```

### Logs to File

```bash
# Save logs to file
docker-compose logs > logs/wallflower-$(date +%Y%m%d).log

# Real-time monitoring
docker-compose logs -f | tee logs/live.log
```

### Prometheus + Grafana (Advanced)

Add monitoring stack:

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

## Backup and Restore

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T db pg_dump -U wallflower wallflower | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_$DATE.sql.gz"
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Start only database
docker-compose up -d db

# Wait for database to be ready
sleep 5

# Restore
gunzip -c backups/db_20240211.sql.gz | docker-compose exec -T db psql -U wallflower -d wallflower

# Start all services
docker-compose up -d
```

## Security

### Production Checklist

- [ ] Change `DB_PASSWORD` from default
- [ ] Use strong passwords (16+ characters)
- [ ] Enable SSL/TLS (reverse proxy)
- [ ] Restrict database port (remove from `ports:` in docker-compose.yml)
- [ ] Set proper CORS origins (no wildcards)
- [ ] Regular backups automated
- [ ] Update base images regularly
- [ ] Monitor logs for suspicious activity

### SSL with Let's Encrypt

Use nginx-proxy with Let's Encrypt:

```yaml
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs

  letsencrypt:
    image: nginxproxy/acme-companion
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      DEFAULT_EMAIL: admin@yourapp.com
```

## Updates

### Update Images

```bash
# Pull latest base images
docker-compose pull

# Rebuild
docker-compose build

# Restart with new images
docker-compose up -d
```

### Zero-Downtime Updates

```bash
# Build new images
docker-compose build

# Scale up new version
docker-compose up -d --scale backend=2

# Wait for health check
sleep 30

# Remove old version
docker-compose up -d --scale backend=1
```

## Cost Estimation

### VPS Requirements

For 50-200 concurrent users:

- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **Bandwidth:** 100GB/month

**Providers:**
- DigitalOcean: $24/month (4GB droplet)
- Linode: $24/month (4GB instance)
- Hetzner: €9.51/month (CX21)

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify environment: `docker-compose config`
3. Test network: `docker-compose exec backend ping db`
4. Review documentation: `/docs`

---

**Quick Deploy:** `cp .env.docker .env && docker-compose up -d` 🚀
