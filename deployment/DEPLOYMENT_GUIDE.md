# Keeviqo Platform Deployment Guide

This guide provides step-by-step instructions for deploying the Keeviqo platform to a production environment.

## Prerequisites

Before deploying, ensure you have:

- A Linux server (Ubuntu 20.04 LTS or newer recommended)
- Root access to the server
- A domain name pointing to your server
- PostgreSQL database
- Node.js 16+ and npm

## Deployment Options

### Option 1: Automated Deployment (Recommended)

1. **Prepare Environment File**

   Copy the example environment file and fill in your values:

   ```bash
   cp .env.deploy.example .env.deploy
   nano .env.deploy
   ```

2. **Run Deployment Script**

   ```bash
   sudo ./deploy.sh
   ```

   This script will:
   - Update system packages
   - Install required dependencies
   - Set up PostgreSQL database
   - Clone/update the repository
   - Build the application
   - Configure environment variables
   - Set up Nginx with SSL
   - Configure systemd service
   - Run database migrations
   - Set up monitoring with PM2

### Option 2: Manual Deployment

Follow the steps in the [README.md](./README.md) file for manual deployment instructions.

## Post-Deployment Configuration

### 1. Verify Application Status

```bash
pm2 status keeviqo
```

### 2. Check Application Logs

```bash
pm2 logs keeviqo
```

### 3. Test the Application

Open your browser and navigate to your domain (https://yourdomain.com).

Verify that:
- The dashboard loads correctly
- Categories and subcategories are displayed
- Features (upload, reminder, external link, form) work as expected
- User authentication functions properly
- Multilingual support works (Hebrew/English)

### 4. Set Up Regular Backups

The deployment script configures daily database backups. Verify the backup script:

```bash
cat /etc/cron.daily/backup-keeviqo
```

## Monitoring and Maintenance

### Application Monitoring

```bash
pm2 monit
```

### Updating the Application

```bash
cd /var/www/keeviqo
git pull
npm install
npm run build
pm2 restart keeviqo
```

### Nginx Configuration

The Nginx configuration file is located at:

```
/etc/nginx/sites-available/keeviqo
```

### SSL Certificate Renewal

SSL certificates from Let's Encrypt are automatically renewed. You can manually renew them with:

```bash
certbot renew
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
```

Check Nginx logs:

```bash
tail -f /var/log/nginx/error.log
```

## Security Considerations

- Keep your server updated with security patches
- Use strong passwords for database and application
- Regularly backup your database
- Monitor server logs for suspicious activity
- Consider implementing rate limiting for API endpoints

## Support

For additional support, please contact the Keeviqo development team.
