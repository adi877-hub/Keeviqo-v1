

set -e

echo "🚀 Starting Keeviqo in development mode..."

if [ ! -f .env ]; then
    echo "⚠️ No .env file found. Creating a basic one for development..."
    echo "PORT=3000" > .env
    echo "NODE_ENV=development" >> .env
    echo "DATABASE_URL=postgres://postgres:postgres@localhost:5432/keeviqo" >> .env
    echo "SESSION_SECRET=keeviqo-dev-secret-$(openssl rand -hex 12)" >> .env
    echo "Created .env file with default values. Edit if needed."
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "🏗️ Building the frontend..."
    npm run build
fi

echo "🌐 Starting the development server..."
echo "Press Ctrl+C to stop the server"
npm run dev

echo "✅ Keeviqo development server stopped."
