
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}║                 KEEVIQO PLATFORM WITH LOCALTUNNEL             ║${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"

mkdir -p logs

if ! npm list -g localtunnel > /dev/null 2>&1; then
  echo -e "${YELLOW}Installing localtunnel globally...${NC}"
  npm install -g localtunnel
fi

echo -e "${YELLOW}Checking for existing processes on port 3002...${NC}"
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo -e "${YELLOW}Killing existing process on port 3002...${NC}"
  kill -9 $PORT_PID
fi

echo -e "${YELLOW}Starting public JavaScript server...${NC}"
node public-js-server.cjs > logs/server.log 2>&1 &
SERVER_PID=$!

echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 5

if ps -p $SERVER_PID > /dev/null; then
  echo -e "${GREEN}Server started successfully with PID $SERVER_PID${NC}"
  echo -e "${GREEN}Server is running at http://localhost:3002${NC}"
else
  echo -e "${RED}Failed to start server${NC}"
  exit 1
fi

echo -e "${YELLOW}Starting localtunnel...${NC}"
npx localtunnel --port 3002 --subdomain keeviqo-platform > logs/tunnel.log 2>&1 &
TUNNEL_PID=$!

echo -e "${YELLOW}Waiting for localtunnel to start...${NC}"
sleep 5

TUNNEL_URL=$(grep -o "https://.*" logs/tunnel.log | head -1)

if [ -z "$TUNNEL_URL" ]; then
  echo -e "${RED}Failed to get localtunnel URL${NC}"
  kill $SERVER_PID $TUNNEL_PID
  exit 1
fi

echo -e "${GREEN}Keeviqo platform is available at: $TUNNEL_URL${NC}"
echo -e "${GREEN}Login credentials:${NC}"
echo -e "${GREEN}Username: admin${NC}"
echo -e "${GREEN}Password: Keeviqo2023!${NC}"

echo "$SERVER_PID $TUNNEL_PID" > logs/pids.txt
echo "$TUNNEL_URL" > logs/url.txt

echo -e "${GREEN}PIDs saved to logs/pids.txt${NC}"
echo -e "${GREEN}URL saved to logs/url.txt${NC}"

echo -e "${YELLOW}Keeping the tunnel alive...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server and tunnel${NC}"

while true; do
  if ! ps -p $SERVER_PID > /dev/null; then
    echo -e "${RED}Server process died, restarting...${NC}"
    node public-js-server.cjs > logs/server.log 2>&1 &
    SERVER_PID=$!
    echo "$SERVER_PID $TUNNEL_PID" > logs/pids.txt
  fi
  
  if ! ps -p $TUNNEL_PID > /dev/null; then
    echo -e "${RED}Tunnel process died, restarting...${NC}"
    npx localtunnel --port 3002 --subdomain keeviqo-platform > logs/tunnel.log 2>&1 &
    TUNNEL_PID=$!
    echo "$SERVER_PID $TUNNEL_PID" > logs/pids.txt
    
    sleep 5
    TUNNEL_URL=$(grep -o "https://.*" logs/tunnel.log | head -1)
    if [ ! -z "$TUNNEL_URL" ]; then
      echo -e "${GREEN}New tunnel URL: $TUNNEL_URL${NC}"
      echo "$TUNNEL_URL" > logs/url.txt
    fi
  fi
  
  sleep 60
done
