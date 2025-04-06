
echo "🚀 Starting Keeviqo Public JavaScript Server..."

if ! npm list express express-session body-parser > /dev/null 2>&1; then
  echo "Installing required dependencies..."
  npm install express express-session body-parser
fi

echo "Checking for existing processes on port 3002..."
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo "Killing existing process on port 3002..."
  kill -9 $PORT_PID
fi

echo "Starting public JavaScript server..."
node public-js-server.cjs &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

if ps -p $SERVER_PID > /dev/null; then
  echo "✅ Server started successfully with PID $SERVER_PID"
  echo "Server is running at http://localhost:3002"
  echo "Login credentials:"
  echo "Username: admin"
  echo "Password: Keeviqo2023!"
else
  echo "❌ Failed to start server"
  exit 1
fi

echo "Preparing for deployment to Fly.io..."
mkdir -p deploy

cp public-js-server.cjs deploy/
cp -r static-pages deploy/ 2>/dev/null || mkdir -p deploy/static-pages
cp categories_full_72.json deploy/
cp -r public deploy/ 2>/dev/null || mkdir -p deploy/public

cat > deploy/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm init -y && \
    npm install express express-session body-parser

EXPOSE 3002

CMD ["node", "public-js-server.cjs"]
EOF

cat > deploy/fly.toml << 'EOF'
app = "keeviqo-platform"
primary_region = "ams"

[build]

[http_service]
  internal_port = 3002
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
EOF

cd deploy
echo "Deploying to Fly.io..."
deploy_backend dir="."

echo "✅ Deployment complete!"
echo "Your Keeviqo platform will be available at the URL above."
echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"

echo "Press Ctrl+C to stop the local server"
wait $SERVER_PID
