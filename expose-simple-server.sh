#!/bin/bash

echo "🚀 Exposing Keeviqo Simple Server with Ngrok..."

if ! command -v ngrok &> /dev/null; then
  echo "Installing ngrok..."
  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list >/dev/null
  sudo apt update && sudo apt install ngrok
fi

cd simple-deploy
npm install
node server.js &
SERVER_PID=$!

sleep 5

ngrok http 3002 &
NGROK_PID=$!

sleep 5

echo "✅ Your Keeviqo platform is available via the ngrok URL above."
echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2025!"

echo "Press Ctrl+C to stop the server and tunnel"
trap "kill $SERVER_PID $NGROK_PID; exit" INT TERM

wait $SERVER_PID
