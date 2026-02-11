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

# Build display (shared package uses source directly)
WORKDIR /app/packages/display
RUN pnpm build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=build /app/packages/display/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/display/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
