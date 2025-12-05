#!/bin/sh

# Start PHP-FPM in background
php-fpm83 &

# Start Nginx in background
nginx &

# Start Node.js app (foreground)
npm start
