

echo "🚀 Starting Keeviqo Persistent Server..."

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

mkdir -p logs

echo "Starting improved categories server with nohup..."
nohup node --experimental-modules improved-categories-server.js > logs/server.log 2>&1 &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

if ps -p $SERVER_PID > /dev/null; then
  echo "✅ Server started successfully with PID $SERVER_PID"
  echo "Server is running at http://localhost:3002"
  echo "Server logs are being written to logs/server.log"
else
  echo "❌ Failed to start server"
  exit 1
fi

echo "Starting localtunnel in the background..."
nohup npx localtunnel --port 3002 --subdomain keeviqo-platform > logs/tunnel.log 2>&1 &
TUNNEL_PID=$!

echo "Waiting for tunnel to start..."
sleep 5

if ps -p $TUNNEL_PID > /dev/null; then
  echo "✅ Tunnel started successfully with PID $TUNNEL_PID"
  echo "Keeviqo platform is available at: https://keeviqo-platform.loca.lt"
  echo "Tunnel logs are being written to logs/tunnel.log"
else
  echo "❌ Failed to start tunnel"
  exit 1
fi

echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"

echo "✅ Keeviqo platform is now running persistently"
echo "The server will continue running even after this terminal is closed"
echo "To stop the server, run: kill $SERVER_PID $TUNNEL_PID"

echo "$SERVER_PID $TUNNEL_PID" > logs/pids.txt

echo "PIDs saved to logs/pids.txt"
