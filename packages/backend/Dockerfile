# Backend Dockerfile
FROM node:20-alpine AS base

# Install OpenSSL and other required dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all package.json files
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend
COPY tsconfig.json ./

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm build

# Build backend
WORKDIR /app/packages/backend

# Generate Prisma client
RUN pnpm prisma generate

# Build backend
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL and other required dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy everything from base stage (simpler and guaranteed to work)
COPY --from=base /app ./

WORKDIR /app/packages/backend

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# Run migrations and start server
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/index.js"]
