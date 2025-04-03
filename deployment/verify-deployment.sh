
set -e

echo "Verifying Keeviqo deployment..."

if [ ! -f ".env.deploy" ]; then
    echo "Error: .env.deploy file not found."
    exit 1
fi

source .env.deploy

echo "Checking if application is running..."
if ! systemctl is-active --quiet $APP_NAME; then
    echo "Error: $APP_NAME service is not running."
    echo "Try starting it with: systemctl start $APP_NAME"
    exit 1
fi

echo "Checking if Nginx is running..."
if ! systemctl is-active --quiet nginx; then
    echo "Error: Nginx is not running."
    echo "Try starting it with: systemctl start nginx"
    exit 1
fi

echo "Checking if PostgreSQL is running..."
if ! systemctl is-active --quiet postgresql; then
    echo "Error: PostgreSQL is not running."
    echo "Try starting it with: systemctl start postgresql"
    exit 1
fi

echo "Checking if domain is accessible..."
if ! curl -s --head https://$DOMAIN | grep "200 OK" > /dev/null; then
    echo "Warning: Domain $DOMAIN is not accessible or not returning 200 OK."
    echo "Check your Nginx configuration and SSL setup."
fi

echo "Checking database connection..."
if ! PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT 1" > /dev/null 2>&1; then
    echo "Error: Cannot connect to database."
    echo "Check your database credentials and configuration."
    exit 1
fi

echo "Checking API endpoints..."
if ! curl -s http://localhost:3000/api/health | grep "ok" > /dev/null; then
    echo "Warning: API health endpoint is not responding correctly."
    echo "Check your application logs: journalctl -u $APP_NAME"
fi

echo "Checking uploads directory..."
if [ ! -d "$DEPLOY_DIR/uploads" ]; then
    echo "Warning: Uploads directory does not exist."
    echo "Create it with: mkdir -p $DEPLOY_DIR/uploads && chown -R www-data:www-data $DEPLOY_DIR/uploads"
fi

echo "Checking log files..."
if [ ! -d "/var/log/keeviqo" ]; then
    echo "Warning: Log directory does not exist."
    echo "Create it with: mkdir -p /var/log/keeviqo && chown -R www-data:www-data /var/log/keeviqo"
fi

echo "Checking backup script..."
if [ ! -f "/etc/cron.daily/backup-$APP_NAME" ]; then
    echo "Warning: Backup script does not exist."
    echo "Create it using the deployment guide."
fi

echo "Checking SSL certificate..."
if ! certbot certificates | grep $DOMAIN > /dev/null; then
    echo "Warning: SSL certificate for $DOMAIN not found."
    echo "Set it up with: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

echo "Checking PM2 status..."
if ! pm2 list | grep $APP_NAME > /dev/null; then
    echo "Warning: Application not found in PM2 process list."
    echo "Start it with: pm2 start npm --name \"$APP_NAME\" -- run start"
fi

echo "Deployment verification completed."
echo "If any warnings or errors were reported, please address them before proceeding."
echo "For detailed application logs, use: journalctl -u $APP_NAME"
echo "For PM2 monitoring, use: pm2 monit"
