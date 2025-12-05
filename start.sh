#!/bin/sh
set -e

# Start PHP-FPM
php-fpm83 -F -y /etc/php83/php-fpm.d/www.conf &

# Start Nginx
nginx -g 'daemon off;' &

# Wait for services
sleep 3

# Start Node.js app
exec npm start
