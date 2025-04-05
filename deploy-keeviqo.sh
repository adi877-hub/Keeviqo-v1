

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                 KEEVIQO PLATFORM DEPLOYMENT                   ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
  else
    echo -e "${YELLOW}Creating basic .env file...${NC}"
    echo "PORT=3000" > .env
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/keeviqo" >> .env
    echo "SESSION_SECRET=keeviqo-secret-key" >> .env
  fi
fi

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
fi

echo -e "${YELLOW}Building Keeviqo platform...${NC}"
npm run build

start_server() {
  echo -e "${GREEN}Starting Keeviqo server...${NC}"
  node dist/index.js &
  SERVER_PID=$!
  
  echo -e "${YELLOW}Waiting for server to start...${NC}"
  sleep 5
  
  echo -e "${GREEN}✅ Keeviqo platform is running at http://localhost:3000${NC}"
  echo -e "${YELLOW}Default login credentials:${NC}"
  echo -e "${YELLOW}Username: admin${NC}"
  echo -e "${YELLOW}Password: Keeviqo2023!${NC}"
  
  return $SERVER_PID
}

expose_with_localtunnel() {
  echo -e "${YELLOW}Creating public URL with localtunnel...${NC}"
  npx localtunnel --port 3000
}

expose_with_serveo() {
  echo -e "${YELLOW}Creating public URL with Serveo...${NC}"
  echo -e "${GREEN}Your Keeviqo platform will be available at: https://keeviqo.serveo.net${NC}"
  ssh -R keeviqo:80:localhost:3000 serveo.net
}

create_access_page() {
  echo -e "${YELLOW}Creating access instructions page...${NC}"
  
  cat > access-instructions.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keeviqo Platform Access Instructions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            direction: rtl;
        }
        h1, h2 {
            color: #1976D2;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
        }
        .highlight {
            background-color: #fffde7;
            padding: 10px;
            border-left: 4px solid #fbc02d;
            margin-bottom: 20px;
        }
        code {
            background-color: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
        .button {
            display: inline-block;
            background-color: #1976D2;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Keeviqo Platform - Access Instructions</h1>
    
    <div class="card">
        <h2>Local Access</h2>
        <p>The Keeviqo platform is currently running locally on your machine at:</p>
        <div class="highlight">
            <code>http://localhost:3000</code>
        </div>
        <p>You can access it directly in your browser by clicking the button below:</p>
        <a href="http://localhost:3000" class="button" target="_blank">Open Keeviqo Platform</a>
    </div>
    
    <div class="card">
        <h2>Login Credentials</h2>
        <p>Use the following credentials to log in:</p>
        <ul>
            <li><strong>Username:</strong> admin</li>
            <li><strong>Password:</strong> Keeviqo2023!</li>
        </ul>
    </div>
    
    <div class="card">
        <h2>Platform Features</h2>
        <p>The Keeviqo platform includes the following advanced features:</p>
        <ul>
            <li>KeeviAI - Intelligent personal assistant</li>
            <li>KeeviMap - Interactive life map</li>
            <li>Intuition Layer - Smart suggestions for missing information</li>
            <li>Declutter Mode - Intelligent document management</li>
            <li>Conversation Logger - Meeting and call documentation</li>
            <li>KeeviShare - Secure selective sharing</li>
            <li>Smart Recommendations - Profile-based suggestions</li>
            <li>Double Notification System - Email + WhatsApp</li>
            <li>Emergency Mode - Quick access to critical information</li>
            <li>Advanced Search - Typo-tolerant search engine</li>
        </ul>
    </div>
</body>
</html>
EOL

  echo -e "${GREEN}✅ Access instructions page created at access-instructions.html${NC}"
  echo -e "${YELLOW}You can open this file in your browser to access the platform${NC}"
}

echo -e "${BLUE}Please select a deployment option:${NC}"
echo -e "${YELLOW}1. Run locally only (http://localhost:3000)${NC}"
echo -e "${YELLOW}2. Run locally and expose with localtunnel${NC}"
echo -e "${YELLOW}3. Run locally and expose with Serveo${NC}"
echo -e "${YELLOW}4. Create access instructions page${NC}"
echo -e "${YELLOW}5. Exit${NC}"

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    start_server
    SERVER_PID=$?
    
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    wait $SERVER_PID
    ;;
  2)
    start_server
    SERVER_PID=$?
    
    expose_with_localtunnel
    
    kill $SERVER_PID
    ;;
  3)
    start_server
    SERVER_PID=$?
    
    expose_with_serveo
    
    kill $SERVER_PID
    ;;
  4)
    create_access_page
    ;;
  5)
    echo -e "${BLUE}Exiting...${NC}"
    exit 0
    ;;
  *)
    echo -e "${RED}Invalid choice. Exiting...${NC}"
    exit 1
    ;;
esac

echo -e "${BLUE}Thank you for using Keeviqo Platform!${NC}"
