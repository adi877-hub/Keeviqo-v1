
echo "🚀 Starting and Exposing Keeviqo Platform..."

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

echo "Creating public URL..."
echo "Your Keeviqo platform will be available at the URL below:"

expose_port local_port="3002"

echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"

echo "Press Ctrl+C to stop the server and tunnel"
wait $SERVER_PID
