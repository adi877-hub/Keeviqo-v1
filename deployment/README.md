# Keeviqo Deployment Guide

This directory contains scripts and instructions for deploying the Keeviqo platform to a production environment.

## Prerequisites

- A Linux server (Ubuntu 20.04 LTS or newer recommended)
- Root access to the server
- A domain name pointing to your server
- PostgreSQL database
- Node.js 16+ and npm

## Deployment Scripts

### 1. Main Deployment Script (`deploy.sh`)

This script automates the entire deployment process including:

- System updates and dependency installation
- PostgreSQL database setup
- Repository cloning/updating
- Application building
- Environment configuration
- Nginx setup with SSL
- Systemd service configuration
- Database migrations
- Monitoring setup with PM2

**Usage:**

```bash
sudo ./deploy.sh
```

### 2. Database Migration Script (`migrate.js`)

This script handles database migrations using Drizzle ORM.

**Usage:**

```bash
node migrate.js
```

### 3. Monitoring Setup Script (`monitoring.js`)

This script configures PM2 for application monitoring and auto-restart.

**Usage:**

```bash
node monitoring.js
```

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

1. **Update System and Install Dependencies**

```bash
apt-get update
apt-get upgrade -y
apt-get install -y nginx postgresql postgresql-contrib nodejs npm certbot python3-certbot-nginx git
```

2. **Setup PostgreSQL Database**

```bash
# Create a .env.deploy file with your database credentials
cat > .env.deploy << EOL
DB_USER=keeviqo_user
DB_PASSWORD=your_secure_password_here
DB_NAME=keeviqo_prod
EOL

# Setup the database using environment variables
source .env.deploy
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
```

3. **Clone Repository**

```bash
git clone https://github.com/adi877-hub/Keeviqo-v1.git /var/www/keeviqo
cd /var/www/keeviqo
```

4. **Install Dependencies and Build**

```bash
npm install
npm run build
```

5. **Configure Environment**

Create a `.env` file with the following content:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
SESSION_SECRET=your_session_secret_here
```

Make sure to replace `your_session_secret_here` with a strong, unique secret value.

6. **Setup Nginx and SSL**

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/keeviqo << EOL
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

# Enable the site
ln -sf /etc/nginx/sites-available/keeviqo /etc/nginx/sites-enabled/

# Setup SSL
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

7. **Setup Systemd Service**

```bash
cat > /etc/systemd/system/keeviqo.service << EOL
[Unit]
Description=Keeviqo Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/keeviqo
ExecStart=/usr/bin/npm run start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOL

systemctl daemon-reload
systemctl enable keeviqo
systemctl start keeviqo
```

8. **Setup Monitoring with PM2**

```bash
npm install -g pm2
pm2 start npm --name "keeviqo" -- run start
pm2 save
pm2 startup
```

## Troubleshooting

If you encounter issues during deployment:

1. Check application logs: `pm2 logs keeviqo`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Check system logs: `journalctl -u keeviqo`

## Maintenance

- **Restart the application**: `pm2 restart keeviqo`
- **View application status**: `pm2 status`
- **Monitor in real-time**: `pm2 monit`
- **Update from repository**: 
  ```bash
  cd /var/www/keeviqo
  git pull
  npm install
  npm run build
  pm2 restart keeviqo
  ```

## Backup

It's recommended to set up regular database backups:

```bash
# Create a backup script using environment variables
cat > /etc/cron.daily/backup-keeviqo << EOL
#!/bin/bash
# Load environment variables
source /var/www/keeviqo/.env.deploy

BACKUP_DIR="/var/backups/keeviqo"
mkdir -p \$BACKUP_DIR
DATE=\$(date +%Y-%m-%d)
pg_dump -U \$DB_USER \$DB_NAME > \$BACKUP_DIR/keeviqo-\$DATE.sql
find \$BACKUP_DIR -type f -name "keeviqo-*.sql" -mtime +7 -delete
EOL

chmod +x /etc/cron.daily/backup-keeviqo
```
