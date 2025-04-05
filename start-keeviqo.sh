

echo "🚀 Starting Keeviqo Platform..."

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
  else
    echo "Creating basic .env file..."
    echo "PORT=3000" > .env
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/keeviqo" >> .env
    echo "SESSION_SECRET=keeviqo-secret-key" >> .env
  fi
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Building Keeviqo platform..."
npm run build

echo "Starting Keeviqo server..."
node dist/index.js

echo "✅ Keeviqo platform is running at http://localhost:3000"
echo "Default login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"
