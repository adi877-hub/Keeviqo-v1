
set -e

echo "Generating SSL certificates for Keeviqo..."

if [ ! -f ".env.deploy" ]; then
    echo "Error: .env.deploy file not found."
    exit 1
fi

source .env.deploy

if [ -z "$DOMAIN" ]; then
    echo "Error: DOMAIN variable not set in .env.deploy file."
    exit 1
fi

mkdir -p ./deployment/nginx/ssl

if ! command -v openssl &> /dev/null; then
    echo "Installing OpenSSL..."
    apt-get update && apt-get install -y openssl
fi

if [ "$NODE_ENV" = "development" ]; then
    echo "Generating self-signed SSL certificate for development..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./deployment/nginx/ssl/key.pem \
        -out ./deployment/nginx/ssl/cert.pem \
        -subj "/CN=$DOMAIN/O=Keeviqo/C=IL"
    
    echo "Self-signed SSL certificate generated successfully."
    echo "Note: This certificate is for development purposes only."
    echo "For production, use Let's Encrypt or a commercial SSL provider."
    exit 0
fi

if [ "$NODE_ENV" = "production" ]; then
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    if ! command -v nginx &> /dev/null; then
        echo "Error: Nginx is not installed. Please install it first."
        exit 1
    fi
    
    echo "Generating SSL certificate using Let's Encrypt..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    echo "SSL certificate generated successfully."
    echo "Certificates will be automatically renewed by Certbot."
    exit 0
fi

echo "Error: NODE_ENV must be set to 'development' or 'production' in .env.deploy file."
exit 1
