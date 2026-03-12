#!/bin/bash
set -e

DOMAIN="xn----7sbldbigg0dp4b3a2j.xn--p1ai"
EMAIL="${1:?Usage: ./init-ssl.sh your@email.com}"
APP_DIR="/opt/nutrition-portal"

cd "$APP_DIR"

echo "=== Step 1: Start nginx with temporary self-signed cert ==="

# Create dummy certificate so nginx can start
mkdir -p ./certbot/conf/live/$DOMAIN
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj '/CN=localhost'" certbot

echo "=== Step 2: Start containers ==="
docker compose up -d frontend

echo "Waiting for nginx to start..."
sleep 5

echo "=== Step 3: Remove dummy certificate ==="
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$DOMAIN && \
  rm -rf /etc/letsencrypt/archive/$DOMAIN && \
  rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

echo "=== Step 4: Request real certificate ==="
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL \
    -d $DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "=== Step 5: Reload nginx ==="
docker compose exec frontend nginx -s reload

echo "=== Step 6: Start certbot for auto-renewal ==="
docker compose up -d certbot

echo "=== HTTPS setup complete! ==="
echo "Site available at: https://федерация-зож.рф"
