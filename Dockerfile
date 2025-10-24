# Multi-stage Dockerfile for E-Commerce Shop
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy workspace configuration and package files
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/
COPY back-end/package.json ./back-end/

# Install all dependencies (including workspaces)
RUN npm ci

# Copy frontend source code
COPY front-end ./front-end

# Build frontend
WORKDIR /app/front-end
RUN npm run build

# Stage 2: Production Image with Nginx + Node.js
FROM node:18-alpine

# Install nginx and supervisor (to run multiple processes)
RUN apk add --no-cache nginx supervisor

# Create necessary directories
RUN mkdir -p /var/log/supervisor \
    && mkdir -p /run/nginx \
    && mkdir -p /var/www/html

# Copy backend files
WORKDIR /app/back-end
COPY back-end/package.json back-end/package-lock.json* ./
RUN npm ci --production

# Copy backend source code
COPY back-end/models ./models
COPY back-end/routes ./routes
COPY back-end/scripts ./scripts
COPY back-end/server.js ./
COPY back-end/env.example ./env.example

# Copy built frontend to nginx directory
COPY --from=frontend-builder /app/front-end/dist /var/www/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Create startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port (Render uses PORT environment variable)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/health || exit 1

# Start supervisor to manage both nginx and json-server
CMD ["/start.sh"]

