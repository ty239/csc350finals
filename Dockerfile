# Use Node.js LTS version
FROM node:18-alpine

# Install PHP and Nginx
RUN apk add --no-cache php php-fpm nginx

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Copy Nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 3000 80

# Start all services
CMD ["/start.sh"]
