#!/bin/bash

echo "🚀 Starting Keeviqo Comprehensive Server..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this server."
    exit 1
fi

if [ ! -f "comprehensive-server.js" ]; then
    echo "❌ comprehensive-server.js file not found."
    exit 1
fi

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

echo "Starting comprehensive server..."
node --experimental-modules comprehensive-server.js

echo "✅ Server started successfully!"
