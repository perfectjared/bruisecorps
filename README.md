# Bruise Corps - Interactive Driving Experience

An experimental driving interface combining multiple technologies:
- Phaser 3.70 game engine (TypeScript)
- Decker UI system (iframe overlay)
- Tone.js audio synthesis
- Hydra visual effects
- Anime.js vector graphics

## Architecture

The project uses multiple coordinated layers:
- **Game Layer**: Phaser 3 game engine for the main driving experience
- **UI Layer**: Decker for user interface elements (loaded as an iframe)
- **Effects Layer**: Hydra for visual effects
- **Vector Layer**: Anime.js for vector graphics animations

### Decker UI System

The UI is implemented using Decker, a card-based hypertext system:
- Main Decker implementation is in `src/lib/ddecker.html`
- Communication between game and UI occurs via `src/game/decker-bridge.ts`
- The UI is structured as cards (screens) with interactive widgets

## Installation

`npm install`

## Scripts

- `npm start`

Build files, run the webpack dev-server - available at [localhost:8080](http://localhost:8080)

- `npm run build`

Build the production version and output files to `dist`

- `npm run lint`

Lint the codebase using ESLint

## Project Memory

For detailed development history and technical notes, see [PROJECT_MEMORY.md](PROJECT_MEMORY.md).
