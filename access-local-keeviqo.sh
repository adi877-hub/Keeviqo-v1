
echo "🚀 Starting Keeviqo Local Access..."

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

echo "Starting enhanced local server..."
node enhanced-local-server.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 3

echo "✅ Keeviqo is now running locally!"
echo "Access the platform at: http://localhost:3002"
echo ""
echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"
echo ""
echo "Press Ctrl+C to stop the server"

cleanup() {
  echo "Shutting down server..."
  kill $SERVER_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

wait $SERVER_PID
