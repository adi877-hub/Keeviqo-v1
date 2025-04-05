
echo "🚀 Exposing Keeviqo Improved Categories Server..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this server."
    exit 1
fi

if [ ! -f "improved-categories-server.js" ]; then
    echo "❌ improved-categories-server.js file not found."
    exit 1
fi

if ! lsof -i:3002 > /dev/null; then
  echo "Starting improved categories server..."
  node --experimental-modules improved-categories-server.js &
  SERVER_PID=$!
  echo "Waiting for server to start..."
  sleep 3
fi

echo "Creating public URL with localtunnel..."
npx localtunnel --port 3002
