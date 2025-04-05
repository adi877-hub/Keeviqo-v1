#!/bin/bash

echo "🚀 Exposing Keeviqo Improved Server..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this server."
    exit 1
fi

if [ ! -f "improved-categories-server.js" ]; then
    echo "❌ improved-categories-server.js file not found."
    exit 1
fi

if ! lsof -i:3002 > /dev/null; then
  echo "Starting improved server..."
  node --experimental-modules improved-categories-server.js &
  SERVER_PID=$!
  echo "Waiting for server to start..."
  sleep 3
fi

echo "Creating public URL with expose_port..."
echo "Your Keeviqo platform will be available at the URL below:"

# Use the expose_port command to create a public URL
expose_port local_port="3002"

echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"
