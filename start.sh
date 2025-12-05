#!/bin/sh
set -e

# Set default PORT if not provided
PORT=${PORT:-80}

# Substitute PORT in nginx config
envsubst '${PORT}' < /etc/nginx/nginx.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/nginx.conf

# Start PHP-FPM
php-fpm83 -F -y /etc/php83/php-fpm.d/www.conf &

# Start Nginx
nginx -g 'daemon off;' &

# Wait for services
sleep 3

# Start Node.js app
exec npm start
