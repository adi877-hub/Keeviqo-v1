

if ! command -v cloudflared &> /dev/null; then
    echo "Installing cloudflared..."
    curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i cloudflared.deb
    rm cloudflared.deb
fi

echo "Starting Keeviqo server..."
npm run build
node dist/index.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Creating Cloudflare Tunnel..."
cloudflared tunnel --url http://localhost:3000

cleanup() {
    echo "Shutting down server..."
    kill $SERVER_PID
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "Tunnel is active. Press Ctrl+C to stop."
wait $SERVER_PID
