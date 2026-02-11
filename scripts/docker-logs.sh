#!/bin/bash

# Quick logs viewer for Docker services

SERVICE=$1

if [ -z "$SERVICE" ]; then
    echo "🌸 Wallflower Docker Logs"
    echo "========================"
    echo ""
    echo "Usage: $0 [service]"
    echo ""
    echo "Services:"
    echo "  all      - All services"
    echo "  backend  - Backend API"
    echo "  display  - Display frontend"
    echo "  mobile   - Mobile frontend"
    echo "  db       - PostgreSQL database"
    echo ""
    echo "Examples:"
    echo "  $0 all"
    echo "  $0 backend"
    exit 1
fi

if [ "$SERVICE" = "all" ]; then
    docker-compose logs -f
else
    docker-compose logs -f $SERVICE
fi
