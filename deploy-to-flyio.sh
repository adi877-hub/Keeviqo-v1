
echo "🚀 Deploying Keeviqo Platform to Fly.io..."

mkdir -p deploy

cp final-server.js deploy/
cp categories_full_72.json deploy/
cp -r public deploy/ 2>/dev/null || mkdir -p deploy/public

cat > deploy/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm init -y && \
    npm install express && \
    npm install --save-dev @types/express

EXPOSE 3002

CMD ["node", "--experimental-modules", "final-server.js"]
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
