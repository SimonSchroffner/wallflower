#!/bin/bash

# Wallflower Docker Deployment Script

set -e  # Exit on error

echo "🌸 Wallflower Docker Deployment"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your settings:"
    echo "   - Change DB_PASSWORD"
    echo "   - Update CORS_ORIGIN with your IP/domain"
    echo "   - Update VITE_BACKEND_URL and VITE_MOBILE_URL"
    echo ""
    read -p "Press Enter after updating .env, or Ctrl+C to cancel..."
fi

# Get local IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
if [ -n "$LOCAL_IP" ]; then
    echo "💡 Your local IP: $LOCAL_IP"
    echo "   Update .env with this IP for network access"
    echo ""
fi

# Build images
echo "🔨 Building Docker images..."
docker-compose build

# Start services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check health
echo ""
echo "🏥 Checking service health..."

# Check database
if docker-compose exec -T db pg_isready -U wallflower &> /dev/null; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Not ready"
fi

# Check backend
if curl -s http://localhost:3001/health &> /dev/null; then
    echo "✅ Backend: Healthy"
else
    echo "⚠️  Backend: Not ready yet (may need more time)"
fi

# Check display
if curl -s http://localhost:5173 &> /dev/null; then
    echo "✅ Display: Healthy"
else
    echo "⚠️  Display: Not ready yet"
fi

# Check mobile
if curl -s http://localhost:5174 &> /dev/null; then
    echo "✅ Mobile: Healthy"
else
    echo "⚠️  Mobile: Not ready yet"
fi

echo ""
echo "================================"
echo "🎉 Deployment complete!"
echo ""
echo "Access URLs:"
echo "  📺 Display: http://localhost:5173"
echo "  📱 Mobile:  http://localhost:5174"
echo "  🔌 Backend: http://localhost:3001"
echo ""

if [ -n "$LOCAL_IP" ]; then
    echo "Network URLs (if configured):"
    echo "  📺 Display: http://$LOCAL_IP:5173"
    echo "  📱 Mobile:  http://$LOCAL_IP:5174"
    echo "  🔌 Backend: http://$LOCAL_IP:3001"
    echo ""
fi

echo "Useful commands:"
echo "  View logs:    docker-compose logs -f"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo "  Status:       docker-compose ps"
echo ""
echo "See docs/DOCKER_DEPLOYMENT.md for more information."
