# Decker Integration in Bruise Corps

This document explains how the Decker UI system is integrated into the Bruise Corps project.

## Overview

Decker is a card-based hypertext system used for creating the user interface elements in Bruise Corps. It provides an overlay UI that sits on top of the main Phaser game.

## Integration Architecture

The integration follows these principles:

1. **Single Active Implementation**: Only one Decker implementation (`ddecker.html`) is active in the project
2. **Iframe Loading**: Decker is loaded as an iframe in `index.html`
3. **Bridge Communication**: Communication between the Phaser game and Decker UI happens via the `decker-bridge.ts` module

## File Structure

```
src/
├── lib/
│   ├── ddecker.html         - The active Decker implementation
│   ├── decker.js            - Decker runtime support
│   ├── decker-engine.js     - Decker/Lil script execution engine
│   ├── lil-engine.js        - Lil language interpreter
│   ├── archive/             - Archived alternative implementations (not used)
│   │   ├── ddecker-horizontal.html - Horizontal layout variant (archived)
│   │   ├── ddecker-vertical.html   - Vertical layout variant (archived)
│   │   ├── ddecker-clean.html      - Clean architecture variant (archived)
│   │   └── ddecker-minimal.html    - Minimal implementation (archived)
│   └── hydra.html           - Visual effects overlay
└── game/
    └── decker-bridge.ts     - API for Decker/Phaser integration
```

## Communication Flow

1. **Phaser to Decker**: The game sends events and data to Decker through the `deckerBridge` API
2. **Decker to Phaser**: User interactions in the Decker UI are sent back to the game

## Decker Bridge API

The `decker-bridge.ts` module provides these key functionalities:

- **Widget Management**: Create, update, and delete UI widgets
- **Card Management**: Switch between different UI screens
- **Event Handling**: Send and receive events between systems
- **Script Execution**: Run Lil scripts in the Decker environment
- **State Synchronization**: Keep game state and UI state in sync

## Event System

Events flow in both directions:
- Game events update the UI (e.g., changing health value)
- UI events trigger game actions (e.g., button clicks)

## Alternative Implementations (Archived)

Several alternative Decker implementations were created but have been archived as they weren't being used:

- **ddecker-horizontal.html**: Horizontally-oriented layout
- **ddecker-vertical.html**: Vertically-oriented layout
- **ddecker-clean.html**: Modern implementation with cleaner architecture
- **ddecker-minimal.html**: Minimal implementation for testing

These files have been moved to the `src/lib/archive/` directory to simplify the codebase while preserving the code for potential future reference.
