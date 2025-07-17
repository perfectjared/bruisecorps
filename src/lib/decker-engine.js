// DECKER ENGINE - Combined engine and transparency rendering
// This handles all Decker functionality including the critical transparency system

// Core constants
const BG_MASK = 100;
const COLORS = [
	0xFFFFFFFF,0xFFFFFF00,0xFFFF6500,0xFFDC0000,0xFFFF0097,0xFF360097,0xFF0000CA,0xFF0097FF,
	0xFF00A800,0xFF006500,0xFF653600,0xFF976536,0xFFB9B9B9,0xFF868686,0xFF454545,0xFF000000,
];

// Global variables
let deck, fb, context, frame, dirty = 0, id = null, zoom = 1;
let dr = { trans_mask: 0, show_anim: false };
let uimode = 'interact';
let frame_count = 0;

// Utility functions
const q = selector => document.querySelector(selector);
const max = (a, b) => a > b ? a : b;
const min = (a, b) => a < b ? a : b;

// Image/framebuffer functions
function image_make(size) {
    return {
        size: size,
        pix: new Array(size.x * size.y).fill(BG_MASK)
    };
}

function draw_frame(image) {
    return { image: image };
}

// Deck loading and initialization
function load_deck(deckData) {
    // // console.log('Loading deck:', deckData);
    deck = deckData;
    dirty = 0;
    dr.trans_mask = 0;
    
    // Initialize framebuffer
    fb = image_make(deck.size);
    context = frame = draw_frame(fb);
    
    // Set up basic deck structure
    // // console.log('Deck loaded:', deck.name, 'Size:', deck.size);
    
    // Initialize first card
    if (deck.cards && deck.cards.length > 0) {
        // // console.log('Setting current card:', deck.cards[0].name);
        setCurrentCard(deck.cards[0]);
    } else {
        console.error('No cards found in deck!');
    }
}

// Card management
let currentCard = null;

function setCurrentCard(card) {
    currentCard = card;
    renderCard(card);
}

function renderCard(card) {
    // // console.log('Rendering card:', card.name, 'with', card.widgets?.length || 0, 'widgets');
    
    // Clear framebuffer
    fb.pix.fill(BG_MASK);
    
    // Render card background if it has an image
    if (card.image) {
        // This would decode and render the card image
        // For now, just fill some areas to show it's working
        renderCardBackground(card);
    }
    
    // Render widgets
    if (card.widgets) {
        // // console.log('Rendering widgets:', card.widgets.map(w => `${w.type}:${w.text || w.script}`));
        renderWidgets(card.widgets);
    }
    
    dirty = 1;
    // // console.log('Card rendered, dirty flag set');
}
}

function renderCardBackground(card) {
    // Simple background rendering - fill some areas
    const centerX = Math.floor(fb.size.x / 2);
    const centerY = Math.floor(fb.size.y / 2);
    
    // Create a simple background pattern
    for (let y = 50; y < fb.size.y - 50; y++) {
        for (let x = 50; x < fb.size.x - 50; x++) {
            if (x >= 0 && x < fb.size.x && y >= 0 && y < fb.size.y) {
                fb.pix[y * fb.size.x + x] = 1; // Very light background
            }
        }
    }
}

function renderWidgets(widgets) {
    widgets.forEach(widget => {
        renderWidget(widget);
    });
}

function renderWidget(widget) {
    const { type, pos, size, text, style } = widget;
    
    if (type === 'button') {
        renderButton(pos, size, text, style);
    } else if (type === 'field') {
        renderField(pos, size, text, style);
    }
}

function renderButton(pos, size, text, style) {
    const [x, y] = pos;
    const [w, h] = size;
    
    // Draw button background
    for (let by = y; by < y + h; by++) {
        for (let bx = x; bx < x + w; bx++) {
            if (bx >= 0 && bx < fb.size.x && by >= 0 && by < fb.size.y) {
                fb.pix[by * fb.size.x + bx] = 13; // Gray button
            }
        }
    }
    
    // Simple text rendering (just a placeholder)
    const textX = x + w / 2;
    const textY = y + h / 2;
    
    // Draw some pixels to represent text
    for (let i = -20; i <= 20; i += 4) {
        for (let j = -2; j <= 2; j += 2) {
            const tx = Math.floor(textX + i);
            const ty = Math.floor(textY + j);
            if (tx >= 0 && tx < fb.size.x && ty >= 0 && ty < fb.size.y) {
                fb.pix[ty * fb.size.x + tx] = 0; // White text
            }
        }
    }
}

function renderField(pos, size, text, style) {
    const [x, y] = pos;
    const [w, h] = size;
    
    // For text fields, we need to render the text even if transparent background
    if (text && text.length > 0) {
        // Simple text rendering - create visible pixels for the text
        const textX = x + w / 2;
        const textY = y + h / 2;
        
        // Draw text as white pixels
        const textLength = Math.min(text.length * 6, w - 10); // Estimate text width
        const startX = textX - textLength / 2;
        
        for (let i = 0; i < textLength; i += 2) {
            for (let j = -3; j <= 3; j += 2) {
                const tx = Math.floor(startX + i);
                const ty = Math.floor(textY + j);
                if (tx >= 0 && tx < fb.size.x && ty >= 0 && ty < fb.size.y) {
                    fb.pix[ty * fb.size.x + tx] = 0; // White text
                }
            }
        }
    }
    
    // Only render background if it's not transparent
    if (style !== 'transparent') {
        for (let by = y; by < y + h; by++) {
            for (let bx = x; bx < x + w; bx++) {
                if (bx >= 0 && bx < fb.size.x && by >= 0 && by < fb.size.y) {
                    fb.pix[by * fb.size.x + bx] = 15; // Light gray field
                }
            }
        }
    }
}

// CRITICAL TRANSPARENCY RENDERING SYSTEM
function pick_palette(deck) {
    // Placeholder - would set up color palettes
}

function sync() {
    // DECKER TRANSPARENCY SYSTEM - Based on working original
    // BG_MASK (100) pixels in framebuffer = transparent
    // Everything else = opaque with color from COLORS array
    
    if (!deck) {
        // // console.log('Sync called but no deck loaded');
        return;
    }
    
    // // console.log('Syncing framebuffer to canvas...');
    
    pick_palette(deck);
    
    const mask = dr.trans_mask && uimode === 'draw';
    const fc = dr.show_anim ? Math.floor(frame_count / 4) : 0;
    
    // Animation functions (simplified but functional)
    const anim_ants = (x, y) => (Math.floor((x + y + Math.floor(frame_count / 2)) / 3)) % 2 ? 15 : 0;
    const anim_pattern = (pix, x, y) => pix < 28 || pix > 31 ? pix : pix; // Simplified
    const draw_pattern = (pix, x, y) => pix < 2 ? (pix ? 1 : 0) : pix > 31 ? (pix === 32 ? 0 : 1) : 1;
    const draw_color = (pix, x, y) => {
        if (pix === 47) return anim_ants(x, y); // ANTS constant
        if (pix > 47) return 0;
        if (pix > 31) return pix - 32;
        return draw_pattern(pix, x, y) ? 15 : 0;
    };
    
    // Create or resize image data - MATCH ORIGINAL WORKING VERSION
    if (!id || id.width !== fb.size.x || id.height !== fb.size.y) {
        id = new ImageData(fb.size.x, fb.size.y);
        id.data.fill(0);
        // console.log('Created new ImageData:', fb.size.x, 'x', fb.size.y);
    }
      // CRITICAL: Canvas context with alpha support for transparency
    const canvas = q('#display');
    const g = canvas.getContext('2d', { alpha: true });
    g.clearRect(0, 0, canvas.width, canvas.height);
    
    // Skip pixel counting for performance
    // let opaquePixels = 0;
    // let transparentPixels = 0;
    
    // Render pixels with proper transparency - EXACTLY LIKE WORKING VERSION
    for (let z = 0, d = 0, y = 0; y < fb.size.y; y++) {
        for (let x = 0; x < fb.size.x; x++, z++, d += 4) {
            const pix = fb.pix[z];
            const a = anim_pattern(pix, x, y);
            const c = (a === 0 && mask) ? 13 : draw_color(a, x, y);
            const cv = COLORS[c] || 0xFF000000;
            
            if (pix === BG_MASK) {
                // Transparent pixel - CRITICAL for seeing Phaser game behind
                id.data[d] = 0;     // R
                id.data[d + 1] = 0; // G
                id.data[d + 2] = 0; // B
                id.data[d + 3] = 0; // A (transparent)
                // transparentPixels++; // Removed for performance
            } else {
                // Opaque pixel with color
                id.data[d] = 0xFF & (cv >> 16);     // R
                id.data[d + 1] = 0xFF & (cv >> 8);  // G
                id.data[d + 2] = 0xFF & cv;         // B
                id.data[d + 3] = 255;               // A (opaque)
                // opaquePixels++; // Removed for performance
            }
        }
    }
    
    // Disabled expensive pixel counting and logging
    // // console.log(`Rendered ${opaquePixels} opaque pixels, ${transparentPixels} transparent pixels`);
    
    // Put the image data on canvas
    g.putImageData(id, 0, 0);
    
    // Handle scaling - simplified but functional
    g.imageSmoothingEnabled = zoom !== Math.floor(zoom);
    g.save();
    g.scale(zoom, zoom);
    g.restore();
}

// Animation loop
function tick() {
    frame_count++;
    
    if (dirty) {
        sync();
        dirty = 0;
    }
}

// Input handling
function handleClick(event) {
    const canvas = q('#display');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is on any widget
    if (currentCard && currentCard.widgets) {
        currentCard.widgets.forEach(widget => {
            if (widget.type === 'button') {
                const [wx, wy] = widget.pos;
                const [ww, wh] = widget.size;
                
                if (x >= wx && x <= wx + ww && y >= wy && y <= wy + wh) {
                    // Button clicked
                    if (widget.script) {
                        executeScript(widget.script);
                    }
                }
            }
        });
    }
}

// Script execution (simplified)
function executeScript(scriptName) {
    // console.log('Executing script:', scriptName);
    
    // Simple script handling
    if (scriptName === 'home.1') {
        // Start game button
        window.parent.postMessage('game-started', '*');
    }
}

// Initialize the engine
function initDecker() {
    // console.log('Initializing Decker engine...');
    
    // Set up canvas click handler
    const canvas = q('#display');
    if (canvas) {
        canvas.addEventListener('click', handleClick);
        // console.log('Canvas click handler set up');
    } else {
        console.error('Canvas #display not found!');
    }
    
    // Start animation loop
    function loop() {
        tick();
        requestAnimationFrame(loop);
    }
    loop();
    
    // console.log('Decker engine initialized successfully');
}

// Export the engine
window.DECKER = {
    BG_MASK,
    COLORS,
    load_deck,
    initDecker,
    setCurrentCard,
    sync,
    tick
};
