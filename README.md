# Pune — Old DOS game, made new

A modern HTML5 remake of a classic DOS multiplayer “light-cycle / worms” style game. Play locally on one keyboard or online with realtime rooms, chat, and spectators. Rendering is powered by PixiJS and the app runs as a static site with optional Node.js realtime server.

## Highlights

- **Local multiplayer** with per-worm key bindings and game settings.
- **Online multiplayer** with rooms, ready states, spectators, chat, and match history.
- **PixiJS rendering** for smooth, modern visuals.
- **Persistent settings** and stats via `localStorage`.
- **Mobile-friendly controls** for online play.

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla ES modules
- **Rendering:** PixiJS (CDN)
- **Storage:** `localStorage` (keys, settings, stats)
- **Realtime:** Node.js + `ws` (optional online server)
- **Build:** No build step; static files served as-is

## How It Works

### Local Play
1. Open the local setup modal.
2. Select at least two worms.
3. Assign left/right keys for each worm.
4. Configure speed, gaps, and scoring.
5. Start the match.

The game loop updates worm positions and collisions on a fixed interval. Rendering and the score marker are handled by PixiJS. Scores and key settings are saved to `localStorage` for future sessions.

### Online Play
1. Open the online setup modal.
2. Create or join a room (or autojoin).
3. Set profile name/color and ready up.
4. Host starts the match.

The client communicates with the realtime server over WebSocket. The server manages rooms, ready states, spectators, chat, and match summaries. Inputs are sent to the server and broadcast to all clients in the room.

## Project Structure

```
index.html
partials/                # HTML fragments loaded at runtime
static/
	css/                   # App styling
	js/app/                # ES modules (ui, game, online, renderer, etc.)
	images/                # UI images
	sounds/                # Audio clips
realtime/                # Node.js WebSocket server
db/                      # Legacy SQL snapshots
```

## Running the App

Serve the project from the repo root (required for partial loading):

```
python3 -m http.server 8000
```

Then open:

```
http://localhost:8000/index.html
```

## Running the Realtime Server (Optional)

```
node realtime/server.js
```

The server listens on `:8080` by default.

## Notes

- The app is fully static; no bundler needed.
- Online play requires the realtime server to be running.
- Key bindings are stored per browser in `localStorage`.

## Credits

Created by Guido Alloatti. This project is a tribute to a beloved DOS classic.