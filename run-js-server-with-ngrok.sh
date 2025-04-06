
echo "🚀 Starting Keeviqo JavaScript Server with Ngrok..."

if ! npm list express session body-parser > /dev/null 2>&1; then
  echo "Installing required dependencies..."
  npm install express express-session body-parser
fi

if ! command -v ngrok &> /dev/null; then
  echo "Installing ngrok..."
  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list >/dev/null
  sudo apt update && sudo apt install ngrok
fi

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

echo "Starting JavaScript server..."
node js-server.js &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Starting ngrok tunnel..."
ngrok http 3002 &
NGROK_PID=$!

echo "Waiting for ngrok to start..."
sleep 5

echo "Getting ngrok URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'http[^"]*')

echo "✅ Your Keeviqo platform is available at: $NGROK_URL"
echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"

echo "Press Ctrl+C to stop the server and tunnel"
trap "kill $SERVER_PID $NGROK_PID; exit" INT TERM

wait $SERVER_PID
