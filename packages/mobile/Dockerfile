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

# Build mobile (shared package uses source directly)
WORKDIR /app/packages/mobile
RUN pnpm build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=build /app/packages/mobile/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/mobile/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
