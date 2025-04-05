

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}║                 KEEVIQO PERSISTENT SERVER                     ║${NC}"
echo -e "${BLUE}║                                                               ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"

mkdir -p logs

start_server() {
  echo -e "${YELLOW}$(date): Starting Keeviqo server...${NC}"
  
  PORT_PID=$(lsof -t -i:3002)
  if [ ! -z "$PORT_PID" ]; then
    echo -e "${YELLOW}$(date): Killing existing process on port 3002...${NC}"
    kill -9 $PORT_PID
  fi
  
  node --experimental-modules improved-categories-server.js > logs/server.log 2>&1 &
  SERVER_PID=$!
  
  echo -e "${GREEN}$(date): Server started with PID $SERVER_PID${NC}"
  
  echo -e "${YELLOW}$(date): Waiting for server to start...${NC}"
  sleep 5
  
  return $SERVER_PID
}

start_tunnel() {
  echo -e "${YELLOW}$(date): Starting localtunnel...${NC}"
  
  TUNNEL_PID=$(ps aux | grep "lt --port 3002" | grep -v grep | awk '{print $2}')
  if [ ! -z "$TUNNEL_PID" ]; then
    echo -e "${YELLOW}$(date): Killing existing localtunnel process...${NC}"
    kill -9 $TUNNEL_PID
  fi
  
  lt --port 3002 --subdomain keeviqo-platform > logs/tunnel.log 2>&1 &
  TUNNEL_PID=$!
  
  echo -e "${GREEN}$(date): Localtunnel started with PID $TUNNEL_PID${NC}"
  echo -e "${GREEN}$(date): Keeviqo platform is available at: https://keeviqo-platform.loca.lt${NC}"
  
  return $TUNNEL_PID
}

is_running() {
  if ps -p $1 > /dev/null; then
    return 0
  else
    return 1
  fi
}

start_server
SERVER_PID=$?
start_tunnel
TUNNEL_PID=$?

echo -e "${GREEN}$(date): Keeviqo platform is now running persistently${NC}"
echo -e "${YELLOW}$(date): This script will keep the server running until Sunday${NC}"
echo -e "${YELLOW}$(date): Login credentials:${NC}"
echo -e "${YELLOW}$(date): Username: admin${NC}"
echo -e "${YELLOW}$(date): Password: Keeviqo2023!${NC}"

while true; do
  if ! is_running $SERVER_PID; then
    echo -e "${RED}$(date): Server process died, restarting...${NC}"
    start_server
    SERVER_PID=$?
  fi
  
  if ! is_running $TUNNEL_PID; then
    echo -e "${RED}$(date): Tunnel process died, restarting...${NC}"
    start_tunnel
    TUNNEL_PID=$?
  fi
  
  sleep 60
done
