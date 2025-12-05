# Use Node.js LTS version
FROM node:18-alpine

# Install PHP-FPM, Nginx, and gettext for envsubst
RUN apk add --no-cache php83 php83-fpm nginx gettext

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Copy Nginx and PHP-FPM configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY php-fpm.conf /etc/php83/php-fpm.d/www.conf

# Make start script executable
RUN chmod +x start.sh

# Expose ports
EXPOSE 3000 80

# Start all services
CMD ["./start.sh"]
