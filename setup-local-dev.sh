

set -e

echo "🚀 Setting up Keeviqo development environment..."

if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Installing PostgreSQL..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
fi

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "📦 Installing dependencies..."
npm install

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/keeviqo
TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5432/keeviqo_test
SESSION_SECRET=keeviqo-dev-secret-$(openssl rand -hex 12)
NODE_ENV=development
EOF
fi

echo "🗄️ Setting up PostgreSQL database..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw keeviqo; then
    echo "Database 'keeviqo' already exists"
else
    echo "Creating database 'keeviqo'..."
    sudo -u postgres psql -c "CREATE DATABASE keeviqo;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE keeviqo TO postgres;"
fi

if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw keeviqo_test; then
    echo "Database 'keeviqo_test' already exists"
else
    echo "Creating database 'keeviqo_test'..."
    sudo -u postgres psql -c "CREATE DATABASE keeviqo_test;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE keeviqo_test TO postgres;"
fi

if [ ! -d "uploads" ]; then
    echo "Creating uploads directory..."
    mkdir -p uploads
    chmod 755 uploads
fi

echo "🔄 Running database migrations..."
if [ -f "server/utils/migrate.ts" ]; then
    npx ts-node server/utils/migrate.ts
elif [ -f "deployment/migrate.js" ]; then
    node deployment/migrate.js
else
    echo "⚠️ Migration script not found. Skipping database migration."
fi

echo "🌱 Seeding database with initial data..."
if [ -f "server/utils/seed.ts" ]; then
    npx ts-node server/utils/seed.ts
else
    echo "⚠️ Seed script not found. Skipping database seeding."
fi

echo "🏗️ Building the frontend..."
npm run build

echo "✅ Keeviqo development environment setup complete!"
echo ""
echo "Available commands:"
echo "- npm run dev     : Start the development server"
echo "- npm run build   : Build the frontend"
echo "- npm run start   : Start the production server"
echo "- npm run test    : Run tests"
echo "- npm run lint    : Run ESLint"
echo ""
echo "To access the application, open http://localhost:3000 in your browser"

chmod +x setup-local-dev.sh
