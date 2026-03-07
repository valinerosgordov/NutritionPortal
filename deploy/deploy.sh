#!/bin/bash
set -e

APP_DIR="/opt/nutrition-portal"
REPO_URL="https://github.com/valinerosgordov/NutritionPortal.git"

echo "=== Deploying NutritionPortal ==="

# Clone or pull
if [ ! -d "$APP_DIR" ]; then
    echo "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
else
    echo "Pulling latest changes..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/master
fi

cd "$APP_DIR"

# Load env if exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Build and deploy
echo "Building and starting containers..."
docker compose down --remove-orphans
docker compose build --no-cache
docker compose up -d

echo "Cleaning up old images..."
docker image prune -f

echo "=== Deployment complete ==="
docker compose ps
