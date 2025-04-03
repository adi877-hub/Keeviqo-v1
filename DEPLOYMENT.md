# Keeviqo Deployment Guide

This document provides comprehensive instructions for deploying the Keeviqo platform to a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Application Deployment](#application-deployment)
6. [SSL Configuration](#ssl-configuration)
7. [Monitoring and Analytics](#monitoring-and-analytics)
8. [Maintenance](#maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying Keeviqo, ensure you have:

- A Linux server (Ubuntu 20.04 LTS or newer recommended)
- Root access to the server
- A domain name pointing to your server
- PostgreSQL database
- Node.js 16+ and npm

## Deployment Options

Keeviqo can be deployed using several methods:

### 1. Traditional Server Deployment

Use the `deploy.sh` script in the `deployment` directory for a traditional server deployment:

```bash
cd deployment
sudo ./deploy.sh
```

### 2. Docker Deployment

Use Docker Compose for containerized deployment:

```bash
cd deployment
docker-compose up -d
```

### 3. Fly.io Deployment

Deploy to Fly.io using the provided script:

```bash
cd deployment
./deploy-flyio.sh
```

## Environment Configuration

Create a `.env.deploy` file based on the provided example:

```bash
cp deployment/.env.deploy.example .env.deploy
nano .env.deploy
```

Required environment variables:

- `APP_NAME`: Application name
- `DEPLOY_DIR`: Deployment directory
- `REPO_URL`: Repository URL
- `BRANCH`: Branch to deploy
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DOMAIN`: Domain name
- `SESSION_SECRET`: Session secret

## Database Setup

The deployment scripts will set up the database automatically, but you can also set it up manually:

```bash
# Create database and user
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Run migrations
npm run migrate
```

## Application Deployment

### Manual Deployment Steps

1. Clone the repository:

```bash
git clone https://github.com/adi877-hub/Keeviqo-v1.git /var/www/keeviqo
cd /var/www/keeviqo
```

2. Install dependencies:

```bash
npm install
```

3. Build the application:

```bash
npm run build
```

4. Configure environment:

```bash
cp .env.example .env
nano .env
```

5. Start the application:

```bash
npm run start
```

## SSL Configuration

Generate SSL certificates using Let's Encrypt:

```bash
cd deployment
./generate-ssl.sh
```

## Monitoring and Analytics

Keeviqo includes built-in monitoring using PM2:

```bash
# Start monitoring
pm2 monit

# View logs
pm2 logs keeviqo

# View status
pm2 status
```

## Maintenance

### Updating the Application

```bash
cd /var/www/keeviqo
git pull
npm install
npm run build
pm2 restart keeviqo
```

### Database Backups

Automatic daily backups are configured. To manually backup:

```bash
pg_dump -U $DB_USER $DB_NAME > /var/backups/keeviqo/keeviqo-$(date +%Y-%m-%d).sql
```

## Troubleshooting

### Application Not Starting

Check the application logs:

```bash
pm2 logs keeviqo
journalctl -u keeviqo
```

### Database Connection Issues

Verify database connection:

```bash
psql -U $DB_USER -d $DB_NAME -h localhost
```

### Nginx Issues

Check Nginx configuration:

```bash
nginx -t
tail -f /var/log/nginx/error.log
```

### Deployment Verification

Run the verification script to check all components:

```bash
cd deployment
./verify-deployment.sh
```

For additional support, please contact the Keeviqo development team.
