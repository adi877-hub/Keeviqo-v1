
set -e

echo "Starting Keeviqo deployment process..."

if [ ! -f ".env.deploy" ]; then
    echo "Error: .env.deploy file not found. Please create it with the required variables."
    echo "Required variables: APP_NAME, DEPLOY_DIR, REPO_URL, BRANCH, DB_NAME, DB_USER, DB_PASSWORD, DOMAIN, SESSION_SECRET"
    exit 1
fi

source .env.deploy

if [ -z "$APP_NAME" ] || [ -z "$DEPLOY_DIR" ] || [ -z "$REPO_URL" ] || [ -z "$BRANCH" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DOMAIN" ] || [ -z "$SESSION_SECRET" ]; then
    echo "Error: Missing required environment variables in .env.deploy file."
    exit 1
fi

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root" 
    exit 1
fi

echo "Updating system packages..."
apt-get update
apt-get upgrade -y

echo "Installing dependencies..."
apt-get install -y nginx postgresql postgresql-contrib nodejs npm certbot python3-certbot-nginx git

echo "Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

if [ -d "$DEPLOY_DIR" ]; then
    echo "Updating existing repository..."
    cd $DEPLOY_DIR
    git pull origin $BRANCH
else
    echo "Cloning repository..."
    git clone -b $BRANCH $REPO_URL $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

echo "Installing Node.js dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Setting up environment variables..."
cat > $DEPLOY_DIR/.env << EOL
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
SESSION_SECRET=$SESSION_SECRET
EOL

echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME << EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/

echo "Setting up SSL with Certbot..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo "Setting up systemd service..."
cat > /etc/systemd/system/$APP_NAME.service << EOL
[Unit]
Description=Keeviqo Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/bin/npm run start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

systemctl daemon-reload
systemctl enable $APP_NAME
systemctl start $APP_NAME

echo "Running database migrations..."
cd $DEPLOY_DIR
npm run migrate

echo "Setting up monitoring with PM2..."
npm install -g pm2
pm2 start npm --name "$APP_NAME" -- run start
pm2 save
pm2 startup

echo "Deployment completed successfully!"
echo "Keeviqo is now running at https://$DOMAIN"
echo ""
echo "To monitor the application, use: pm2 monit"
echo "To view logs, use: pm2 logs $APP_NAME"
echo "To restart the application, use: pm2 restart $APP_NAME"
