

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}║                 KEEVIQO PLATFORM WITH NGROK                   ║${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"

mkdir -p logs

if ! command -v ngrok &> /dev/null; then
    echo -e "${YELLOW}Installing ngrok...${NC}"
    curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list >/dev/null
    sudo apt update && sudo apt install ngrok
fi

echo -e "${YELLOW}Checking for existing processes on port 3002...${NC}"
PORT_PID=$(lsof -t -i:3002)
if [ ! -z "$PORT_PID" ]; then
  echo -e "${YELLOW}Killing existing process on port 3002...${NC}"
  kill -9 $PORT_PID
fi

echo -e "${YELLOW}Starting improved categories server with nohup...${NC}"
nohup node --experimental-modules improved-categories-server.js > logs/server.log 2>&1 &
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

echo -e "${YELLOW}Starting ngrok tunnel...${NC}"
nohup ngrok http 3002 --log=stdout > logs/ngrok.log 2>&1 &
NGROK_PID=$!

echo -e "${YELLOW}Waiting for ngrok to start...${NC}"
sleep 5

if ps -p $NGROK_PID > /dev/null; then
  echo -e "${GREEN}Ngrok started successfully with PID $NGROK_PID${NC}"
else
  echo -e "${RED}Failed to start ngrok${NC}"
  kill $SERVER_PID
  exit 1
fi

echo -e "${YELLOW}Getting ngrok URL...${NC}"
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'http[^"]*')

if [ -z "$NGROK_URL" ]; then
  echo -e "${RED}Failed to get ngrok URL${NC}"
  kill $SERVER_PID $NGROK_PID
  exit 1
fi

echo -e "${GREEN}Keeviqo platform is available at: $NGROK_URL${NC}"
echo -e "${GREEN}Login credentials:${NC}"
echo -e "${GREEN}Username: admin${NC}"
echo -e "${GREEN}Password: Keeviqo2023!${NC}"

echo "$SERVER_PID $NGROK_PID" > logs/pids.txt
echo "$NGROK_URL" > logs/url.txt

echo -e "${GREEN}PIDs saved to logs/pids.txt${NC}"
echo -e "${GREEN}URL saved to logs/url.txt${NC}"

echo -e "${YELLOW}Keeping the tunnel alive until Sunday...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server and tunnel${NC}"

while true; do
  if ! ps -p $SERVER_PID > /dev/null; then
    echo -e "${RED}Server process died, restarting...${NC}"
    nohup node --experimental-modules improved-categories-server.js > logs/server.log 2>&1 &
    SERVER_PID=$!
    echo "$SERVER_PID $NGROK_PID" > logs/pids.txt
  fi
  
  if ! ps -p $NGROK_PID > /dev/null; then
    echo -e "${RED}Ngrok process died, restarting...${NC}"
    nohup ngrok http 3002 --log=stdout > logs/ngrok.log 2>&1 &
    NGROK_PID=$!
    echo "$SERVER_PID $NGROK_PID" > logs/pids.txt
    
    sleep 5
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'http[^"]*')
    if [ ! -z "$NGROK_URL" ]; then
      echo -e "${GREEN}New ngrok URL: $NGROK_URL${NC}"
      echo "$NGROK_URL" > logs/url.txt
    fi
  fi
  
  sleep 60
done
