
echo "🚀 Exposing Keeviqo Static Server with Localtunnel..."

if ! npm list -g localtunnel > /dev/null 2>&1; then
  echo "Installing localtunnel globally..."
  npm install -g localtunnel
fi

if ! lsof -i:3002 > /dev/null; then
  echo "Server is not running. Please start the server first with:"
  echo "node simple-static-server.js"
  exit 1
fi

echo "Creating public URL with localtunnel..."
echo "Your Keeviqo platform will be available at the URL below:"

npx localtunnel --port 3002 --subdomain keeviqo-platform-static

echo "Login credentials:"
echo "Username: admin"
echo "Password: Keeviqo2023!"
