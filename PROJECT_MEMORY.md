# Bruise Corps Project Memory

## Project Overview
Interactive driving experience with Decker UI overlay, Phaser3 game engine, and Tone.js audio synthesis.

## Architecture
- **Main Framework:** Phaser3 + TypeScript
- **UI System:** Decker (Lil scripting) - iframe overlay
- **Audio:** Tone.js synthesis engine
- **Effects:** Hydra visual effects (iframe overlay)
- **Graphics:** Anime.js vector graphics (SVG overlay)

## Key Files & Structure
```
src/
├── app.ts - Main application entry, Decker communication
├── game/
│   ├── game.ts - Phaser3 game scenes
│   ├── synth.ts - Tone.js audio synthesis & metronome
│   └── marge/ - Driving game components
├── lib/
│   ├── ddecker.html - Decker UI definitions (cards, widgets)
│   └── hydra.html - Visual effects overlay
└── interfaces/ - TypeScript interfaces
```

## Current Status

### Coordinate System (IMPLEMENTED)
- **Deck Size:** 512x342 (reverted from 1920x1080)
- **Center-based positioning:** (0,0) = center of deck
- **Formula:** `decker_pos = (deck_center + offset - element_size/2)`
- **Deck Center:** (256, 171)

### UI Layout (WORKING)
- **Home Card:** Title, subtitle, greeting, Start Game button
- **Marge Card:** Dashboard with health slider
- **Rearview Card:** Mirror interface
- **Button Position:** Properly centered using size-aware positioning

### Audio Issues (FIXED)
- **Metronome:** Was ear-splittingly loud, now reduced volume
- **Location:** `src/game/synth.ts` lines 63-85
- **Implementation:** Tone.js scheduled repeat with clickNoise + clickEnv
- **Fixes Applied:**
  - Reduced gain from -25dB to -40dB
  - Changed noise type from 'pink' to 'white' (cleaner sound)
  - Shortened envelope decay/release from 0.02s to 0.01s
  - Reduced trigger duration from '32n' to '64n'
  - Shortened click duration from 0.05s to 0.02s

## Recent Work Done
1. **Button Positioning Fix:** Moved from off-screen to center-based coordinates
2. **CSS Scaling Removal:** Reverted complex CSS scaling that broke Decker rendering
3. **Coordinate System:** Implemented center-based positioning accounting for element sizes
4. **Deck Size:** Reverted to 512x342 for stability
5. **Metronome Fix:** Reduced volume, improved sound quality
6. **Failed Attempts:** Complex viewport system, CSS transforms, large deck sizes - all abandoned
7. **Click-through Problem:** Ongoing challenge balancing Decker clickability vs Phaser access
8. **Metronome Volume:** Halved again (-46dB) for better experience  
9. **Marge Scene Cleanup:** Removed left-most airCon drag dial, moved all elements up 5%
10. **Simplified CSS:** Removed all pointer-events manipulation - simple full-screen overlay with centered iframe

## Lessons Learned
- **Keep Decker simple:** Minimal CSS, basic positioning, standard deck sizes
- **Avoid over-engineering:** Complex responsive systems don't work well with Decker
- **Positioning is key:** Always account for top-left anchoring vs center-based thinking
- **CSS interference:** Decker doesn't play well with external CSS transforms
- **Message passing:** Simple string-based communication is most reliable

## Next Tasks
1. **DEBUG: Check if "Start Game" sets appData.gameStarted flag** (CURRENT ISSUE)
2. **Define Rearview scene** as interactive toy-like experience
3. **Test responsive behavior** across screen sizes
4. **Enhance UI positioning** system for other cards
5. **Add dynamics and animation** to Marge scene (user will lead this)

## Current Issues Being Investigated

**CRITICAL: Phaser Interaction Blocking (ACTIVE DEBUGGING)**

### Problem Statement
After pressing "Start Game", Phaser interactions are completely blocked despite multiple attempted solutions.

### Systematic Investigation Plan
1. **HTML Structure Issue (FOUND & FIXED)**: 
   - Problem: `<iframe id="deck-container">` vs CSS expecting `#deck-container` div wrapper
   - Fix: ~~Changed HTML to use proper div wrapper structure~~ **REVERTED** - broke responsive sizing
   - **ACTUAL FIX**: Fixed CSS to target iframe directly with proper centering

2. **CSS Centering Issue (FOUND & FIXED)**:
   - Problem: Flexbox centering broke when iframe became direct target
   - Fix: Used `transform: translate(-50%, -50%)` with `top: 50%; left: 50%` for proper centering
   - Result: Fixed size (512x342) with proper center positioning

3. **Z-Index Layers (VERIFIED)**:
   - Decker: z-index 10 (should allow passthrough after game starts)
   - Phaser: z-index 0 (default, should receive clicks)
   - Hydra: z-index 20 (has pointer-events: none ✅)
   - Anime: z-index 5 (has pointer-events: none ✅)

4. **Pointer Events Management (TESTING)**:
   - Before game: Decker iframe has normal pointer-events
   - After game: Decker iframe should get pointer-events: none
   - Decker widgets: Should override with pointer-events: auto via CSS

### Debug Logging Added
- Canvas creation verification
- Pointer-events setting confirmation  
- Canvas click detection
- Element positioning checks

### Current Status: READY FOR TESTING
- HTML structure: iframe directly targeted ✅
- CSS positioning: Fixed size with proper centering ✅
- JavaScript: Targets iframe correctly ✅
- Pointer events: Should work with current setup ✅

### Next Steps
1. Test with current fixes
2. Verify console output for debug info
3. Check if canvas clicks are detected
4. Verify Decker iframe pointer-events setting

### Failed Attempts Documented
❌ **Event gating system** - Over-complicated, caused intermittent issues
❌ **Complex pointer-events juggling** - Created blocking instead of solving
❌ **CSS pointer-events on container** - Wrong target element

**Click-Through Balance:** WORKING SOLUTION ✅
- **Decker buttons work** throughout the application ✅
- **Background-click forwarding** allows proper widget deselection ✅
- **No dynamic pointer-events changes** - keep it simple ✅
- **Trade-off:** Decker overlay blocks some Phaser interactions, but that's acceptable

## Decker System Understanding

### What Decker Is
- **Decker** is a HyperCard-inspired authoring tool that uses **Lil scripting language**
- Creates interactive card-based interfaces with widgets (buttons, fields, sliders, etc.)
- Renders in HTML/JavaScript but has its own coordinate system and event model
- Used here as an overlay UI system over the Phaser3 game

### Decker File Structure
```
ddecker.html contains:
{deck} - Main deck properties (size, name)
{card:cardname} - Individual cards with widgets
{widgets} - Widget definitions (type, size, pos, script, etc.)
{script:scriptname} - Lil scripts for widget behavior
```

### Coordinate System (LEARNED THE HARD WAY)
- **Decker uses TOP-LEFT positioning** (not center-based)
- **Position [x,y]** = where the TOP-LEFT corner of widget goes
- **Size [width,height]** = dimensions of widget
- **For center-based positioning:** `pos = [center_x - width/2, center_y - height/2]`
- **Current deck size:** 512x342 (center at 256, 171)

### Widget Types & Properties
- **button:** `{"type":"button","size":[w,h],"pos":[x,y],"script":"scriptname","text":"Label","style":"rect"}`
- **field:** `{"type":"field","size":[w,h],"pos":[x,y],"show":"transparent","border":0,"align":"center","text":"Content"}`
- **slider:** `{"type":"slider","size":[w,h],"pos":[x,y],"script":"scriptname","value":75,"range":[0,100]}`

### Communication Pattern
1. **Decker → App:** Widget scripts use `send:"message"` to communicate
2. **App → Decker:** Use `sendToDecker()` function in app.ts
3. **Message Handling:** Both directions use string-based message passing

### What Works Well
✅ **Simple positioning** with calculated center-based coordinates
✅ **Basic widgets** (buttons, fields, sliders) render reliably
✅ **Message passing** between iframe and main app
✅ **Event handling** through Lil scripts
✅ **Multiple cards** for different UI states
✅ **Transparent overlays** over game content

### Failed Approaches (AVOID THESE)
❌ **CSS scaling/transforms** on Decker iframe - breaks rendering completely
❌ **Complex viewport calculations** - JavaScript viewport system proved "fruitless road"
❌ **Large deck sizes** (1920x1080) - causes positioning and scaling issues
❌ **Trying to control Decker with external CSS** - Decker has its own rendering system
❌ **Assuming center-based positioning** - Decker uses top-left anchoring
❌ **Complex responsive systems** - simpler is better with Decker
❌ **Complex pointer-events juggling** - Causes more problems than it solves, leads to unclickable UI

### CSS & Overlay Integration (SIMPLIFIED)
**Current Working Setup:**
- Full-screen container (`100vw x 100vh`) - normal click behavior
- Centered iframe (`512x342`) - normal click behavior  
- Flexbox centering for proper positioning
- Z-index layering: Decker (10), Phaser (0), Hydra (20)
- **No pointer-events manipulation** - keep it simple!

**Accepted Trade-off:**
- Decker overlay will block some Phaser interactions
- This is normal for overlay UI systems
- Prioritize working UI over perfect click-through

### CSS & Overlay Integration (COMPLEX TOPIC)
**Current Working Setup:**
- Full-screen container (`100vw x 100vh`) with `pointer-events: none`
- Centered iframe (`512x342`) with `pointer-events: auto`
- Flexbox centering for proper positioning
- Z-index layering: Decker (10), Phaser (0), Hydra (20)

**The Click-Through Dilemma:**
- **Problem:** Decker needs to be clickable but shouldn't block Phaser interactions
- **Trade-off:** Currently prioritizing Decker functionality over Phaser access
- **Current State:** Decker buttons work, some Phaser areas may be blocked

**Lessons on CSS Integration:**
- **Keep it simple** - avoid complex pointer-events manipulation
- Container must be full-screen for proper overlay behavior
- Flexbox centering is reliable and straightforward
- Z-index must be carefully managed across all layers
- **Accept trade-offs** - perfect click-through isn't always necessary

### Positioning Formula (CRITICAL)
```javascript
// For center-based positioning:
decker_x = deck_center_x + offset_x - (widget_width / 2)
decker_y = deck_center_y + offset_y - (widget_height / 2)

// Current values:
deck_center_x = 256 (for 512px width)
deck_center_y = 171 (for 342px height)
```

### Lil Script Patterns
```lil
// Button click handler
on click do
  send:"message-name"
end

// Card view handler  
on view do
  card.widgets["widgetname"].text:"New text"
end
```

### Integration Notes
- **Load via iframe:** `<iframe src="./src/lib/ddecker.html" id="deck-container">`
- **Overlay positioning:** Use CSS flexbox to center iframe
- **Event flow:** User clicks → Lil script → send message → app.ts receives → game responds
- **State management:** Keep UI state in app.ts, push updates to Decker widgets

## Current Status: FIXED RESPONSIVE SCALING

**Problem**: Fixed-size iframe (512x342) was too small on larger screens
**Solution**: 
- Used wrapper div `#deck-container` for flexbox centering
- Iframe `#deck-iframe` inside with responsive sizing (80vw/80vh) 
- Max dimensions to prevent oversizing (max-width: 512px, max-height: 342px)
- JavaScript targets `#deck-iframe` specifically

**Current Structure**:
```html
<div id="deck-container">  <!-- Flexbox centering wrapper -->
  <iframe id="deck-iframe" src="./src/lib/ddecker.html"></iframe>
</div>
```

**CSS**:
- Container: Full viewport with flexbox centering
- Iframe: 80% viewport size with 512x342 max dimensions
- Responsive scaling that works on different screen sizes

**JavaScript**:
- `appData.deckerFrame` targets `#deck-iframe`
- Pointer-events management applies to the iframe directly

### Next Steps
1. Test responsive scaling on different screen sizes
2. Verify "Start Game" button is visible and clickable
3. Test click-through functionality after game starts
4. Check if debug console messages appear correctly

## CRITICAL INSIGHT: DragDial/DragSlider Interaction Dependencies

**Problem Found**: DragDial class has `handleGlobalPointerTracking()` method that checks `appData.pointerActive.active` to determine if it should respond to drag events.

**Code Analysis**:
```typescript
// In dragdial.ts line 165:
if (this.isPressed && !appData.pointerActive.active) {
    this.isPressed = false
    this.dragging = false
}
```

**Root Cause**: 
- DragDial expects `appData.pointerActive.active` to be true during interactions
- When iframe has `pointer-events: none`, clicks pass through but may not properly trigger Phaser's input system
- Document-level mousedown sets `appData.pointerActive.active` to true but sprite detection might fail

**Debug Strategy**:
1. Added console logging to mousedown event handler
2. Added detailed logging to `getSpriteUnderPointer` function
3. Changed approach: Set container to `pointer-events: none` but keep iframe interactive

**Current Testing**:
- Container div: `pointer-events: none` (allows click-through)
- Iframe: `pointer-events: auto` (keeps Decker widgets working)
- This should allow both Phaser interactions AND Decker widgets to work

### Interaction System (BREAKTHROUGH ACHIEVED + CLEANED UP)

**BREAKTHROUGH**: Successfully implemented dual interaction system where both Phaser and Decker can be interactive simultaneously.

**Final Solution**:
- **Container div**: `pointer-events: none` (allows click-through to Phaser)
- **Iframe**: `pointer-events: auto` (keeps Decker widgets interactive)
- **Transparent area handling**: Properly configured for click-through

**Key Implementation Details**:
1. **CSS Enhancement**: Added to Decker HTML to ensure widgets remain interactive:
   ```css
   .widget, button, input, select, textarea, [onclick], [onmousedown], [onmouseup] {
     pointer-events: auto !important;
   }
   ```

2. **Transparent Area Support**: Modified to ensure transparent areas in Decker can capture clicks when needed

3. **Removed Redundant Code**: Cleaned up duplicate/unused click handlers and console logging

**Current State**:
