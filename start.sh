#!/usr/bin/env bash
set -e

FRONTEND_PORT="${FRONTEND_PORT:-8000}"
WS_PORT="${PORT:-8080}"
DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Shutting down..."
  kill -9 $WS_PID $HTTP_PID 2>/dev/null
  # Also kill anything still on those ports
  lsof -ti:"$FRONTEND_PORT","$WS_PORT" 2>/dev/null | xargs kill -9 2>/dev/null
  echo "Done."
}
trap cleanup EXIT INT TERM

# Install WebSocket server deps if needed
if [ ! -d "$DIR/realtime/node_modules" ]; then
  echo "Installing realtime server dependencies..."
  (cd "$DIR/realtime" && npm install)
fi

# Start WebSocket server
echo "Starting WebSocket server on :$WS_PORT..."
PORT=$WS_PORT node "$DIR/realtime/server.js" &
WS_PID=$!

# Start static file server (no subshell so we get the real PID)
echo "Starting frontend on http://localhost:$FRONTEND_PORT..."
cd "$DIR"
python3 -c "
import http.server, socketserver, sys

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # keep normal access logs
        super().log_message(fmt, *args)
    def handle_one_request(self):
        try:
            super().handle_one_request()
        except BrokenPipeError:
            pass
    def finish(self):
        try:
            super().finish()
        except BrokenPipeError:
            pass

with socketserver.TCPServer(('', int(sys.argv[1])), QuietHandler) as s:
    s.serve_forever()
" "$FRONTEND_PORT" &
HTTP_PID=$!

echo ""
echo "  Frontend:  http://localhost:$FRONTEND_PORT"
echo "  WebSocket: ws://localhost:$WS_PORT"
echo ""
echo "Press Ctrl+C to stop both servers."
wait
