#!/bin/sh
DOMAIN="xn----7sbldbigg0dp4b3a2j.xn--p1ai"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [ -f "$CERT_PATH" ]; then
    echo "SSL certificate found — enabling HTTPS"
    cp /etc/nginx/ssl.conf /etc/nginx/conf.d/ssl.conf
else
    echo "No SSL certificate — serving HTTP only"
    cp /etc/nginx/nossl.conf /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
