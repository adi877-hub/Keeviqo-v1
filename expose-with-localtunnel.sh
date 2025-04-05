
echo "🚀 Exposing Keeviqo Platform with Localtunnel..."

if ! npm list -g localtunnel > /dev/null 2>&1; then
  echo "Installing localtunnel globally..."
  npm install -g localtunnel
fi

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

echo "Starting improved categories server..."
node --experimental-modules improved-categories-server.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Creating public URL with localtunnel..."
echo "Your Keeviqo platform will be available at the URL below:"

lt --port 3002 --subdomain keeviqo-platform

cleanup() {
  echo "Shutting down server..."
  kill $SERVER_PID
  exit 0
}

trap cleanup SIGINT SIGTERM

wait $SERVER_PID
