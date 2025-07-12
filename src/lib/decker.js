// Decker JavaScript Runtime
// A modern web-based deck presentation system

// Global variables and initialization
VERSION = "1.56";
DANGEROUS = 0;

// Canvas and rendering context
let canvas, ctx;
let deck = null;
let currentCard = 0;

// Initialize canvas and basic rendering
function initCanvas() {
  canvas = document.getElementById('deckertainer');
  if (!canvas) {
    console.error('Canvas element not found');
    return false;
  }
  
  ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context');
    return false;
  }
  
  // Set canvas size
  resizeCanvas();
  
  // Clear canvas with default background
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  return true;
}

function resizeCanvas() {
  if (!canvas) return;
  
  const container = canvas.parentElement;
  if (container) {
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || window.innerHeight;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

// Basic deck loading and rendering
function loadDeck(deckData) {
  console.log('Loading deck:', deckData);
  deck = deckData;
  currentCard = 0;
  renderCurrentCard();
}

function renderCurrentCard() {
  if (!ctx || !deck) return;
  
  // Clear canvas
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Basic card rendering
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
  
  // Draw card border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  
  // Draw card title if available
  if (deck.name) {
    ctx.fillStyle = '#000000';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(deck.name, canvas.width / 2, 60);
  }
  
  // Draw card number
  ctx.fillStyle = '#666666';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Card ${currentCard + 1}`, canvas.width - 30, canvas.height - 30);
}

// String transformations
drom_toupper = x => x.replace(/([ßẞ])|([^ßẞ])/g, (_, s, e) => s ? 'ẞ' : e.toUpperCase());
drom_tolower = x => x.replace(/([ßẞ])|([^ßẞ])/g, (_, s, e) => s ? 'ß' : e.toLowerCase());

// Character cleaning
clchars = x => x.normalize("NFC").replace(
  /(\r)|(\t)|([''])|([""])|([^\x20-\x7E\n…ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĒēĘęĪīıŁłŃńŌōŐőŒœŚśŠšŪūŰűŸŹźŻżŽžȘșȚțẞ¡¿«»€°]$)/gm,
  (_, r, t, sq, dq) => r ? '' : t ? ' ' : sq ? `'` : dq ? `"` : '�'
);

// Extended character support
drom_chars = `…ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĒēĘęĪīıŁłŃńŌōŐőŒœŚśŠšŪūŰűŸŹźŻżŽžȘșȚțẞ¡¿«»€°`.split('');
drom_idx = new Map();
drom_chars.forEach((c, i) => drom_idx.set(c.charCodeAt(0), 127 + i));

drom_to_ord = x => {
  const i = x.charCodeAt(0);
  return i == 10 || (i >= 32 && i <= 126) ? i : drom_idx.get(i) || 255;
};

drom_from_ord = x => 
  x == 9 ? ' ' : x == 10 ? '\n' : x == 13 ? '' : 
  (x >= 32 && x <= 126) ? String.fromCharCode(x) : 
  (x >= 127 && x <= 240) ? drom_chars[x - 127] : '�';

// Number formatting
wnum = y => {
  let w = '', d = '', s = y < 0 ? (y = -y, '-') : '', i = Math.floor(y);
  y = Math.round((y - Math.floor(y)) * 1000000);
  if (y >= 1000000) i++;
  while (i > 0) { w = (0 | i % 10) + w, i = i / 10; }
  for (let z = 0; z < 6; z++) { d = (0 | y % 10) + d, y = y / 10; }
  return s + ('0' + w).replace(/^(0+)(?=[^0])/, '') + ('.' + d).replace(/(\.?0+)$/, '');
};

// Math utilities
mod = (x, y) => x - y * Math.floor(x / y);
range = x => Array.from(Array(x)).map((_, i) => i);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Decker initialized');
  
  // Set up canvas and basic drawing context
  const canvas = document.getElementById('deckertainer');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Basic setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Enable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;
    
    console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
  }
  
  // Load any Lil scripts
  const lilScripts = document.querySelectorAll('script[type="lil"]');
  lilScripts.forEach(script => {
    if (script.src) {
      fetch(script.src)
        .then(response => response.text())
        .then(lilCode => {
          console.log('Lil code loaded:', lilCode);
        })
        .catch(error => {
          console.error('Error loading Lil script:', error);
        });
    }
  });
  
  // Initialize the canvas properly
  if (!initCanvas()) {
    console.error('Failed to initialize canvas');
    return;
  }
  
  // Initialize toolbar
  initToolbar();
  
  // Add event listeners
  document.addEventListener('keydown', handleKeyPress);
  canvas.addEventListener('click', handleCanvasClick);
  
  // Handle window resizing
  window.addEventListener('resize', function() {
    resizeCanvas();
    renderCurrentCard();
  });
  
  // Load default deck
  loadDeck({
    name: 'Decker Demo',
    cards: [
      { name: 'Welcome', content: 'Welcome to Decker!' },
      { name: 'Getting Started', content: 'Use arrow keys or click to navigate.' }
    ]
  });
  
  console.log('Decker initialization complete');
});

// Navigation functions
function nextCard() {
  if (deck && currentCard < (deck.cards?.length || 1) - 1) {
    currentCard++;
    renderCurrentCard();
    updateCardCounter();
  }
}

function prevCard() {
  if (currentCard > 0) {
    currentCard--;
    renderCurrentCard();
    updateCardCounter();
  }
}

function goToCard(cardIndex) {
  if (deck && cardIndex >= 0 && cardIndex < (deck.cards?.length || 1)) {
    currentCard = cardIndex;
    renderCurrentCard();
    updateCardCounter();
  }
}

// Keyboard navigation
function handleKeyPress(event) {
  switch(event.key) {
    case 'ArrowRight':
    case ' ':
      nextCard();
      break;
    case 'ArrowLeft':
      prevCard();
      break;
    case 'Home':
      goToCard(0);
      break;
    case 'End':
      if (deck && deck.cards) {
        goToCard(deck.cards.length - 1);
      }
      break;
  }
}

// Mouse/touch navigation
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const clickSide = x < canvas.width / 2 ? 'left' : 'right';
  
  if (clickSide === 'left') {
    prevCard();
  } else {
    nextCard();
  }
}

// Initialize toolbar
function initToolbar() {
  const toolbar = document.getElementById('toolbar');
  if (!toolbar) return;
  
  // Create basic navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'icon';
  prevBtn.innerHTML = '◀';
  prevBtn.title = 'Previous card';
  prevBtn.onclick = prevCard;
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'icon';
  nextBtn.innerHTML = '▶';
  nextBtn.title = 'Next card';
  nextBtn.onclick = nextCard;
  
  const cardCounter = document.createElement('span');
  cardCounter.id = 'cardCounter';
  cardCounter.style.color = '#ffffff';
  cardCounter.style.padding = '0 10px';
  cardCounter.style.fontSize = '12px';
  
  toolbar.appendChild(prevBtn);
  toolbar.appendChild(cardCounter);
  toolbar.appendChild(nextBtn);
  
  updateCardCounter();
}

function updateCardCounter() {
  const counter = document.getElementById('cardCounter');
  if (counter && deck) {
    const total = deck.cards ? deck.cards.length : 1;
    counter.textContent = `${currentCard + 1} / ${total}`;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VERSION,
    loadDeck,
    nextCard,
    prevCard,
    goToCard
  };
}
