#!/bin/bash
set -e

APP_DIR="/opt/nutrition-portal"
REPO_URL="https://github.com/valinerosgordov/NutritionPortal.git"
DOMAIN="xn----7sbldbigg0dp4b3a2j.xn--p1ai"

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

# Check if SSL cert exists inside the volume
echo "=== Checking SSL certificate ==="
HAS_CERT=$(docker compose run --rm --entrypoint "sh -c" certbot "test -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem && echo yes || echo no")

if [ "$HAS_CERT" = "yes" ]; then
    echo "SSL certificate exists, starting certbot for auto-renewal..."
    docker compose up -d certbot
else
    echo "=== SSL: No certificate found, obtaining from Let's Encrypt ==="

    sleep 5

    # Create dummy cert so nginx can start with SSL
    docker compose run --rm --entrypoint "sh -c" certbot \
      "mkdir -p /etc/letsencrypt/live/$DOMAIN && \
       openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
         -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
         -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
         -subj '/CN=localhost'"

    # Restart nginx to pick up dummy cert
    docker compose restart frontend
    sleep 3

    # Remove dummy cert
    docker compose run --rm --entrypoint "sh -c" certbot \
      "rm -rf /etc/letsencrypt/live/$DOMAIN && \
       rm -rf /etc/letsencrypt/archive/$DOMAIN && \
       rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf"

    # Get real certificate
    docker compose run --rm --entrypoint "sh -c" certbot \
      "certbot certonly --webroot -w /var/www/certbot \
        --email info@federation-preventive.ru \
        -d $DOMAIN \
        --rsa-key-size 4096 \
        --agree-tos \
        --no-eff-email \
        --force-renewal"

    # Reload nginx with real cert
    docker compose exec frontend nginx -s reload

    # Start certbot for auto-renewal
    docker compose up -d certbot

    echo "=== SSL certificate obtained! ==="
fi

echo "Cleaning up old images..."
docker image prune -f

echo "=== Deployment complete ==="
docker compose ps
