#!/usr/bin/env bash
FRONTEND_PORT="${FRONTEND_PORT:-8000}"
WS_PORT="${PORT:-8080}"

stopped=0

# Find by port
pids=$(lsof -ti:"$FRONTEND_PORT" 2>/dev/null)
if [ -n "$pids" ]; then
  echo "$pids" | xargs kill -9 2>/dev/null
  echo "Frontend (port $FRONTEND_PORT) stopped."
  stopped=1
else
  echo "Frontend (port $FRONTEND_PORT) was not running."
fi

pids=$(lsof -ti:"$WS_PORT" 2>/dev/null)
if [ -n "$pids" ]; then
  echo "$pids" | xargs kill -9 2>/dev/null
  echo "WebSocket server (port $WS_PORT) stopped."
  stopped=1
else
  echo "WebSocket server (port $WS_PORT) was not running."
fi

# Fallback: find node processes running server.js
pids=$(pgrep -f "node.*realtime/server.js" 2>/dev/null)
if [ -n "$pids" ]; then
  echo "$pids" | xargs kill -9 2>/dev/null
  echo "Killed remaining server.js processes."
  stopped=1
fi

# Fallback: find python http server processes in this directory
pids=$(pgrep -f "python3.*SimpleHTTPRequestHandler" 2>/dev/null)
if [ -n "$pids" ]; then
  echo "$pids" | xargs kill -9 2>/dev/null
  echo "Killed remaining frontend processes."
  stopped=1
fi

if [ "$stopped" -eq 0 ]; then
  echo "No servers were running."
fi
