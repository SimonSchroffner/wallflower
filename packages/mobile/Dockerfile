# Mobile Frontend Dockerfile
FROM node:20-alpine AS build

# Build argument for environment variable
ARG VITE_BACKEND_URL

# Set environment variable for Vite build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files
COPY packages/shared/package.json ./packages/shared/
COPY packages/mobile/package.json ./packages/mobile/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/mobile ./packages/mobile
COPY tsconfig.json ./

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm build

# Build mobile
WORKDIR /app/packages/mobile
RUN pnpm build

# Production stage - serve static files
FROM node:20-alpine AS production

# Install serve for static file serving
RUN npm install -g serve

WORKDIR /app

# Copy built files
COPY --from=build /app/packages/mobile/dist ./dist

# Expose port
EXPOSE 3000

# Serve static files
CMD ["serve", "-s", "dist", "-l", "3000"]
