#!/bin/sh

# Start script for running nginx + json-server

echo "Starting Shop E-Commerce Application..."
echo "========================================="

# Display configuration
echo "Environment: Production"
echo "Port: ${PORT:-10000}"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi

echo "Nginx configuration OK"

# Check if backend exists
if [ ! -f /app/back-end/server.js ]; then
    echo "ERROR: Backend server not found!"
    exit 1
fi

echo "Backend server OK"

# Start supervisor to manage both processes
echo "Starting services with supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf

