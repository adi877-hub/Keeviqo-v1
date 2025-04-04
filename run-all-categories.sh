
echo "🚀 Starting Keeviqo All Categories Server..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run this server."
    exit 1
fi

if [ ! -f "all-categories-server.js" ]; then
    echo "❌ all-categories-server.js file not found."
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "Creating dist directory..."
    mkdir -p dist
fi

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

echo "Starting all categories server..."
node --experimental-modules all-categories-server.js

echo "✅ Server started successfully!"
