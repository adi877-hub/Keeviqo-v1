
set -e

echo "Setting up production environment for Keeviqo..."

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root" 
    exit 1
fi

if [ ! -f ".env.deploy" ]; then
    echo "Error: .env.deploy file not found. Please create it with the required variables."
    echo "Required variables: APP_NAME, DEPLOY_DIR, REPO_URL, BRANCH, DB_NAME, DB_USER, DB_PASSWORD, DOMAIN, SESSION_SECRET"
    exit 1
fi

source .env.deploy

echo "Installing required packages..."
apt-get update
apt-get install -y nginx postgresql postgresql-contrib nodejs npm certbot python3-certbot-nginx git curl

echo "Installing Node.js LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "Installing PM2..."
npm install -g pm2

echo "Creating deployment directory..."
mkdir -p $DEPLOY_DIR
chown -R www-data:www-data $DEPLOY_DIR

echo "Creating log directory..."
mkdir -p /var/log/keeviqo
chown -R www-data:www-data /var/log/keeviqo

echo "Creating uploads directory..."
mkdir -p $DEPLOY_DIR/uploads
chown -R www-data:www-data $DEPLOY_DIR/uploads
chmod 755 $DEPLOY_DIR/uploads

echo "Setting up PostgreSQL..."
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
fi

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
fi

echo "Setting up Nginx..."
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

    location /uploads {
        alias $DEPLOY_DIR/uploads;
        autoindex off;
    }

    client_max_body_size 50M;
}
EOL

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/

if [ -f /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

nginx -t

systemctl restart nginx

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

echo "Setting up backup script..."
cat > /etc/cron.daily/backup-$APP_NAME << EOL
source $DEPLOY_DIR/.env.deploy

BACKUP_DIR="/var/backups/$APP_NAME"
mkdir -p \$BACKUP_DIR
DATE=\$(date +%Y-%m-%d)
pg_dump -U \$DB_USER \$DB_NAME > \$BACKUP_DIR/$APP_NAME-\$DATE.sql
find \$BACKUP_DIR -type f -name "$APP_NAME-*.sql" -mtime +7 -delete
EOL

chmod +x /etc/cron.daily/backup-$APP_NAME

echo "Production environment setup completed successfully!"
echo "Next steps:"
echo "1. Clone the repository: git clone $REPO_URL $DEPLOY_DIR"
echo "2. Install dependencies: cd $DEPLOY_DIR && npm install"
echo "3. Build the application: npm run build"
echo "4. Start the application: systemctl start $APP_NAME"
echo "5. Monitor the application: pm2 monit"
