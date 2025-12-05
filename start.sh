#!/bin/sh
set -e

export PORT=${PORT:-10000}

echo "Starting services on PORT: $PORT"
echo "Files in /app/public:"
ls -la /app/public/ || echo "Directory not found"

# Start PHP-FPM
echo "Starting PHP-FPM..."
php-fpm83 &

# Start Node.js
echo "Starting Node.js..."
node server.js &

# Wait a moment
sleep 2

# Create simple nginx config
cat > /tmp/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen ${PORT};
        root /app/public;
        index index.php index.html;

        location ~ \.php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:3000;
            proxy_set_header Host \$host;
        }

        location / {
            try_files \$uri \$uri/ =404;
        }
    }
}
EOF

echo "Starting Nginx..."
exec nginx -c /tmp/nginx.conf -g 'daemon off;'
