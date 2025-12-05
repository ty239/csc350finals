#!/bin/sh
set -e

export PORT=${PORT:-10000}

echo "=== STARTING SERVICES ON PORT: $PORT ==="

# Start Node.js
echo "Starting Node.js..."
node server.js &
sleep 2

# Test if Node.js is responding
curl -s http://127.0.0.1:3000/api/session || echo "Node.js not responding yet"

# Create nginx config WITHOUT PHP for now
cat > /tmp/nginx.conf << EOF
events { worker_connections 1024; }
http {
    include /etc/nginx/mime.types;
    server {
        listen ${PORT};
        root /app/public;
        
        location /api/ {
            proxy_pass http://127.0.0.1:3000;
        }
        
        location / {
            try_files \$uri \$uri/index.html =404;
        }
    }
}
EOF

echo "Starting Nginx on PORT ${PORT}..."
exec nginx -c /tmp/nginx.conf -g 'daemon off;'
