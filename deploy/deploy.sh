#!/bin/bash
set -e

APP_DIR="/opt/nutrition-portal"
REPO_URL="https://github.com/valinerosgordov/NutritionPortal.git"
DOMAIN="xn----7sbldbigg0dp4b3a2j.xn--p1ai"
CERT_PATH="/var/lib/docker/volumes/nutrition-portal_certbot-conf/_data/live/$DOMAIN/fullchain.pem"

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
docker compose up -d frontend backend

# SSL setup: obtain certificate if not exists
if [ ! -f "$CERT_PATH" ]; then
    echo "=== SSL: No certificate found, obtaining from Let's Encrypt ==="

    echo "Waiting for nginx to start..."
    sleep 5

    # Create dummy cert so nginx can start with SSL config temporarily
    docker compose run --rm --entrypoint "\
      mkdir -p /etc/letsencrypt/live/$DOMAIN" certbot

    docker compose run --rm --entrypoint "\
      openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
        -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
        -subj '/CN=localhost'" certbot

    # Restart nginx to pick up dummy cert
    docker compose restart frontend
    sleep 3

    # Remove dummy cert
    docker compose run --rm --entrypoint "\
      rm -rf /etc/letsencrypt/live/$DOMAIN && \
      rm -rf /etc/letsencrypt/archive/$DOMAIN && \
      rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

    # Get real certificate
    docker compose run --rm --entrypoint "\
      certbot certonly --webroot -w /var/www/certbot \
        --email info@federation-preventive.ru \
        -d $DOMAIN \
        --rsa-key-size 4096 \
        --agree-tos \
        --no-eff-email \
        --force-renewal" certbot

    # Reload nginx with real cert
    docker compose exec frontend nginx -s reload
    echo "=== SSL certificate obtained! ==="
fi

# Start certbot for auto-renewal
docker compose up -d certbot

echo "Cleaning up old images..."
docker image prune -f

echo "=== Deployment complete ==="
docker compose ps
