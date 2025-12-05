#!/bin/sh
set -e

# Set default PORT if not provided
export PORT=${PORT:-10000}

echo "Starting services on PORT: $PORT"

# Create nginx config directory
mkdir -p /etc/nginx/http.d

# Write nginx config with PORT substitution
cat > /etc/nginx/http.d/default.conf << EOF
server {
    listen ${PORT} default_server;
    server_name _;
    root /app/public;
    index index.php index.html;

    # Serve static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle PHP files
    location ~ \.php$ {
        try_files \$uri =404;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
    }

    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Default location
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF

echo "Starting PHP-FPM..."
php-fpm83 -F -y /etc/php83/php-fpm.d/www.conf &
PHP_PID=$!

echo "Starting Node.js server..."
node server.js > /tmp/node.log 2>&1 &
NODE_PID=$!

# Wait for services to start
sleep 3

echo "Starting Nginx..."
echo "PHP-FPM PID: $PHP_PID, Node.js PID: $NODE_PID"

# Start Nginx in foreground (keeps container alive)
exec nginx -g 'daemon off;'
