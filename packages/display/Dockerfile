# Display Frontend Dockerfile
FROM node:20-alpine AS build

# Build arguments for environment variables
ARG VITE_BACKEND_URL
ARG VITE_MOBILE_URL

# Set environment variables for Vite build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_MOBILE_URL=${VITE_MOBILE_URL}

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files
COPY packages/shared/package.json ./packages/shared/
COPY packages/display/package.json ./packages/display/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/display ./packages/display
COPY tsconfig.json ./

# Build display (Vite handles TypeScript)
WORKDIR /app/packages/display
RUN pnpm build

# Production stage - serve static files
FROM node:20-alpine AS production

# Install serve for static file serving
RUN npm install -g serve

WORKDIR /app

# Copy built files
COPY --from=build /app/packages/display/dist ./dist

# Expose port
EXPOSE 3000

# Serve static files
CMD ["serve", "-s", "dist", "-l", "3000"]
