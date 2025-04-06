
echo "🚀 Starting Keeviqo Comprehensive JavaScript Server with Localtunnel..."

if ! npm list express session body-parser > /dev/null 2>&1; then
  echo "Installing required dependencies..."
  npm install express express-session body-parser
fi

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

echo "Starting comprehensive JavaScript server..."
node comprehensive-js-server.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Creating public URL with localtunnel..."
lt --port 3002 --subdomain keeviqo-platform-full &
TUNNEL_PID=$!

echo "Waiting for tunnel to start..."
sleep 5

echo "✅ Your Keeviqo platform is available at: https://keeviqo-platform-full.loca.lt"
echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"

echo "Press Ctrl+C to stop the server and tunnel"
trap "kill $SERVER_PID $TUNNEL_PID; exit" INT TERM

wait $SERVER_PID
