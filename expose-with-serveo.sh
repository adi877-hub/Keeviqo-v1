

echo "🚀 Starting Keeviqo Platform..."

if [ ! -d "dist" ]; then
  echo "Building Keeviqo platform..."
  npm run build
fi

echo "Starting Keeviqo server..."
node dist/index.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Creating public URL with Serveo..."
echo "Your Keeviqo platform will be available at: https://keeviqo.serveo.net"
echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"
echo ""
echo "Press Ctrl+C to stop the server and tunnel"

ssh -R keeviqo:80:localhost:3000 serveo.net

cleanup() {
  echo "Shutting down server..."
  kill $SERVER_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

wait $SERVER_PID
