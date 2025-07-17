// Bruise Corps - Main Application
// This file handles the coordination between different layers of the application

document.addEventListener('DOMContentLoaded', function() {
    console.log('Bruise Corps application loaded');
    
    // Initialize application components
    initializeDeckerInterface();
    initializeAnimeJS();
    initializeHydraEffects();
});

function initializeDeckerInterface() {
    const deckIframe = document.getElementById('deck-iframe');
    
    // Ensure Decker iframe is properly loaded
    deckIframe.addEventListener('load', function() {
        console.log('Decker interface loaded successfully');
    });
    
    deckIframe.addEventListener('error', function(e) {
        console.error('Error loading Decker interface:', e);
    });
}

function initializeAnimeJS() {
    // Initialize anime.js for vector graphics animations
    console.log('Anime.js ready for vector animations');
}

function initializeHydraEffects() {
    // Hydra effects are currently disabled (opacity: 0.0, display: none)
    console.log('Hydra effects layer initialized');
}

// Communication between layers
window.addEventListener('message', function(event) {
    // Handle messages between iframes and main window
    if (event.data && event.data.type) {
        switch(event.data.type) {
            case 'deck-action':
                handleDeckerAction(event.data);
                break;
            case 'hydra-effect':
                handleHydraEffect(event.data);
                break;
            default:
                console.log('Unknown message type:', event.data.type);
        }
    }
});

function handleDeckerAction(data) {
    console.log('Decker action received:', data);
    // Handle interactions from the Decker interface
}

function handleHydraEffect(data) {
    console.log('Hydra effect triggered:', data);
    // Handle Hydra visual effects
}
