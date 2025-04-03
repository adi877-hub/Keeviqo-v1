
set -e

echo "Deploying Keeviqo to Fly.io..."

if ! command -v flyctl &> /dev/null; then
    echo "Installing Fly.io CLI..."
    curl -L https://fly.io/install.sh | sh
    export FLYCTL_INSTALL="/home/ubuntu/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

if ! flyctl auth whoami &> /dev/null; then
    echo "Please log in to Fly.io:"
    flyctl auth login
fi

if [ ! -f "fly.toml" ]; then
    echo "Creating Fly.io configuration..."
    
    flyctl launch --no-deploy --name keeviqo --region fra --org personal
    
    cat > fly.toml << EOL
app = "keeviqo"
primary_region = "fra"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "3000"
  NODE_ENV = "production"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 1024

[mounts]
  source = "keeviqo_data"
  destination = "/data"
EOL
fi

if [ ! -f "Dockerfile" ]; then
    echo "Creating Dockerfile..."
    cat > Dockerfile << EOL
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

RUN mkdir -p /data/uploads
VOLUME /data/uploads

EXPOSE 3000

CMD ["npm", "run", "start"]
EOL
fi

if [ ! -f ".dockerignore" ]; then
    echo "Creating .dockerignore..."
    cat > .dockerignore << EOL
node_modules
npm-debug.log
.git
.env
.env.*
!.env.example
.DS_Store
.vscode
.idea
EOL
fi

echo "Setting up PostgreSQL database..."
if ! flyctl postgres list | grep keeviqo-db &> /dev/null; then
    flyctl postgres create --name keeviqo-db --region fra --vm-size shared-cpu-1x --initial-cluster-size 1
    
    DB_URL=$(flyctl postgres connect --app keeviqo-db --private-network -C)
    
    flyctl secrets set DATABASE_URL="$DB_URL" --app keeviqo
fi

echo "Setting application secrets..."
flyctl secrets set SESSION_SECRET="$(openssl rand -hex 32)" --app keeviqo

echo "Deploying application..."
flyctl deploy

if [ -n "$DOMAIN" ]; then
    echo "Setting up custom domain: $DOMAIN..."
    flyctl certs create "$DOMAIN" --app keeviqo
    
    echo "Please update your DNS records to point to the Fly.io application."
    echo "Add a CNAME record for $DOMAIN pointing to keeviqo.fly.dev"
fi

echo "Deployment completed successfully!"
echo "Your application is now available at: https://keeviqo.fly.dev"

if [ -n "$DOMAIN" ]; then
    echo "Once DNS propagates, it will also be available at: https://$DOMAIN"
fi

echo ""
echo "To view logs: flyctl logs --app keeviqo"
echo "To open the application: flyctl open --app keeviqo"
echo "To scale the application: flyctl scale count 2 --app keeviqo"
