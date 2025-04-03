

set -e

echo "🚀 Preparing Keeviqo for public preview..."

if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
    echo "Building the frontend..."
    npm run build
fi

cat > preview-server.js << EOF
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(\`Keeviqo preview server running at http://localhost:\${port}\`);
});
EOF

echo "Starting preview server..."
node preview-server.js &
SERVER_PID=$!

echo "Exposing preview to the internet..."
npx localtunnel --port 3000

kill $SERVER_PID
rm preview-server.js

echo "Preview server stopped."
