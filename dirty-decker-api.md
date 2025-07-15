# Dirty Decker API
*A comprehensive guide to composing cards, widgets, and contraptions in Decker*

## Overview
Decker uses a combination of JSON-like widget definitions and Lil scripting language for creating interactive card-based interfaces. This API covers essential patterns for card composition, advanced widgets, custom contraptions, and system integration.

## Quick Reference (Machine-Readable)

```javascript
// CORE STRUCTURE
{deck}
version:1
card:0
size:[512,342]
name:"DeckName"

{fonts}
fontname:"%%FNT..."

{sounds}
soundname:"%%SND..."

// CARD STRUCTURE
{card:cardname}
image:"%%IMG..."
script:"cardname.scriptindex"
{widgets}
widgetname:{"type":"widgettype","size":[w,h],"pos":[x,y],...properties}
{script:cardname.scriptindex}
on event do
  // Lil script code
end
{end}

// CONTRAPTION STRUCTURE
{contraption:name}
size:[w,h]
resizable:0|1
margin:[top,right,bottom,left]
description:"text"
script:"name.scriptsuffix"
template:"script template"
attributes:{"name":["attr1","attr2"],"label":["Label1","Label2"],"type":["string","number","bool"]}
{widgets}
// widget definitions
{script:name.scriptsuffix}
// contraption scripts
{end}

// WIDGET TYPES
field: {"type":"field","size":[w,h],"pos":[x,y],"text":"content","align":"center|left|right","show":"transparent|opaque|rect|none","border":0|1,"locked":0|1,"volatile":0|1,"style":"plain|code","font":"fontname","value":"text"}
button: {"type":"button","size":[w,h],"pos":[x,y],"text":"label","style":"rect|round|check|invisible","script":"scriptname","value":0|1}
slider: {"type":"slider","size":[w,h],"pos":[x,y],"value":number,"range":[min,max],"script":"scriptname"}
canvas: {"type":"canvas","size":[w,h],"pos":[x,y],"locked":0|1,"animated":0|1,"volatile":0|1,"script":"scriptname","scale":number,"image":"%%IMG..."}
grid: {"type":"grid","size":[w,h],"pos":[x,y],"script":"scriptname","value":[[data]],"widths":[colwidths],"headers":["col1","col2"]}
contraption: {"type":"contraption","size":[w,h],"pos":[x,y],"def":"contraptionname","script":"scriptname"}

// EVENTS
on view do ... end         // When card/widget becomes visible
on click do ... end        // When widget is clicked
on change do ... end       // When widget value changes
on drag do ... end         // When widget is dragged
on drop do ... end         // When something is dropped on widget
on key x do ... end        // When key is pressed
on open do ... end         // When deck is opened
on close do ... end        // When deck is closed

// NAVIGATION & TRANSITIONS
go["cardname"]                    // Navigate to card by name
go["cardname" "TransitionName"]   // Navigate with transition
go["Next"]                        // Navigate to next card
go["Prev"]                        // Navigate to previous card
go["Back"]                        // Navigate to previous card in history

// BUILT-IN TRANSITIONS
SlideLeft, SlideRight, SlideUp, SlideDown
WipeLeft, WipeRight, WipeUp, WipeDown
BoxIn, BoxOut

// MESSAGING & ALERTS
send["message"]                   // Send string message to parent
send["key:value"]                 // Send key-value message to parent
alert["message"]                  // Show alert dialog
alert["message" format values]    // Show formatted alert

// WIDGET ACCESS
card.widgets["widgetname"].property    // Access widget properties
this.value                            // Current widget value (in event handlers)
me.property                           // Current widget/contraption reference

// CONTRAPTION METHODS
on set_attributename x do ... end     // Attribute setter
on get_attributename do ... end       // Attribute getter
on do_methodname do ... end           // Custom method

// CANVAS METHODS
canvas.clear[]                        // Clear canvas
canvas.text[text pos align]           // Draw text
canvas.rect[pos size style]           // Draw rectangle
canvas.line[start end]                // Draw line
canvas.paste[image pos]               // Paste image
canvas.merge[image1 image2]           // Merge images
canvas.size                           // Canvas size
canvas.font                           // Canvas font
```

## Human-Readable Documentation

### Deck Structure

A complete Decker deck consists of:
1. **Deck declaration** - `{deck}` with version, card index, size, and name
2. **Assets** - `{fonts}` and `{sounds}` blocks with embedded data
3. **Card definitions** - Multiple `{card:name}` blocks
4. **Contraption definitions** - Custom reusable components
5. **Global scripts** - Shared functionality and transitions

### Advanced Widget Types

#### Canvas Widget (Drawing Surface)
```javascript
canvasname:{"type":"canvas","size":[400,300],"pos":[50,50],"locked":1,"animated":1,"volatile":1,"script":"canvasname.1","scale":1}
```
- **Purpose**: Dynamic drawing surface, animations, custom graphics
- **Key Properties**:
  - `animated`: 1 for auto-refresh animations
  - `volatile`: 1 for frequently changing content
  - `scale`: Display scaling factor
  - `image`: Base64 encoded image data

#### Grid Widget (Data Tables)
```javascript
gridname:{"type":"grid","size":[300,200],"pos":[50,50],"script":"gridname.1","value":[["A1","B1"],["A2","B2"]],"widths":[100,200],"headers":["Col1","Col2"]}
```
- **Purpose**: Display tabular data, spreadsheet-like interface
- **Key Properties**:
  - `value`: 2D array of cell data
  - `widths`: Column width array
  - `headers`: Column header names

#### Contraption Widget (Custom Components)
```javascript
contraptionname:{"type":"contraption","size":[150,100],"pos":[50,50],"def":"clockWidget","script":"contraptionname.1"}
```
- **Purpose**: Reusable custom components with encapsulated behavior
- **Key Properties**:
  - `def`: Reference to contraption definition
  - Custom attributes defined in contraption template

### Contraption System

Contraptions are reusable components with their own widgets, scripts, and attributes:

```javascript
{contraption:clockWidget}
size:[100,100]
resizable:1
margin:[8,8,10,10]
description:"a realtime clock with configurable UTC offset"
script:"clockWidget.0p"
attributes:{"name":["utcoffset","24hour"],"label":["UTC Offset","24 Hour Format"],"type":["number","bool"]}
{widgets}
canvas1:{"type":"canvas","size":[100,100],"pos":[0,0],"locked":1,"animated":1,"script":"clockWidget.1p"}
utcfield:{"type":"field","size":[35,18],"pos":[6,75],"show":"none","value":"-8"}
{script:clockWidget.0p}
on set_utcoffset x do utcfield.text:x end
on get_utcoffset do 0+utcfield.text end
on set_24hour x do hourformat.value:x end
on get_24hour do hourformat.value end
{end}
```

### Enhanced Script Events

#### Canvas Events
```lil
{script:canvasname.1}
on view do
  me.clear[]
  me.font:card.font
  me.text["Hello World" me.size/2 "center"]
  me.rect[10,10 50,30 "outline"]
end
{end}
```

#### Grid Events
```lil
{script:gridname.1}
on click do
  selected:me.selection
  alert["Selected: %s" format me.value[selected]]
end
{end}
```

#### Advanced Button Events
```lil
{script:buttonname.1}
on click do
  if me.style="check"
    alert["Checkbox value: %b" format me.value]
  else
    go["NextCard" "SlideLeft"]
  end
end
{end}
```

### Transition System

Decker includes built-in transitions and supports custom transitions:

```lil
// Built-in transitions
go["CardName" "SlideLeft"]
go["CardName" "BoxIn"]
go["CardName" "WipeRight"]

// Custom transition definition
transition[on CustomFade c a b t do
  c.clear[]
  c.paste[a 0,0]
  c.paste[b 0,0 t] // with opacity
end]
```

### Asset Management

#### Fonts
```javascript
{fonts}
customfont:"%%FNT..." // Base64 encoded font data
```

#### Sounds
```javascript
{sounds}
clicksound:"%%SND..." // Base64 encoded sound data
```

#### Images
```javascript
// In card or widget definitions
image:"%%IMG..." // Base64 encoded image data
```

### System Integration

#### Deck-Level Events
```lil
{script:deck.0}
on open do
  // Initialization code
end
on close do
  // Cleanup code
end
{end}
```

#### Message Passing
```lil
// Send to parent window
send["game-state-changed"]
send["score:" score]

// Internal messaging
card.widgets["display"].text:"Updated!"
```

### Advanced Patterns

#### Dynamic Content Updates
```lil
{script:card.0}
on view do
  timestamp:"%e" format sys.now
  card.widgets["clock"].text:timestamp
end
{end}
```

#### Conditional Logic
```lil
{script:button.1}
on click do
  if score>100
    go["WinCard" "BoxIn"]
  else
    go["ContinueCard" "SlideLeft"]
  end
end
{end}
```

#### Data Manipulation
```lil
{script:processor.1}
on calculate do
  data:parse["1,2,3,4,5"] // Parse CSV
  result:sum data
  card.widgets["result"].text:"Total: " result
end
{end}
```

### Complete Advanced Example

```javascript
{deck}
version:1
card:0
size:[512,342]
name:"Advanced Demo"

{fonts}
title:"%%FNT..."

{sounds}
click:"%%SND..."

{card:main}
image:"%%IMG..."
script:"main.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,50],"locked":1,"font":"title","show":"transparent","text":"Advanced Demo"}
gameCanvas:{"type":"canvas","size":[400,250],"pos":[56,80],"animated":1,"script":"main.1","scale":1}
scoreGrid:{"type":"grid","size":[200,100],"pos":[56,280],"script":"main.2","headers":["Player","Score"],"widths":[100,100]}
clockWidget:{"type":"contraption","size":[100,50],"pos":[400,280],"def":"simpleClock","script":"main.3"}
{script:main.0}
on view do
  // Initialize game state
  gameState:"playing"
  send["game-initialized"]
end
{end}
{script:main.1}
on view do
  me.clear[]
  me.text["Game Area" me.size/2 "center"]
  // Draw game elements
end
{end}
{script:main.2}
on click do
  selected:me.selection
  if selected
    go["PlayerDetail" "BoxIn"]
  end
end
{end}

{contraption:simpleClock}
size:[100,50]
resizable:1
description:"A simple digital clock"
script:"simpleClock.0p"
{widgets}
display:{"type":"field","size":[100,30],"pos":[0,10],"locked":1,"style":"plain","align":"center"}
{script:simpleClock.0p}
on view do
  currentTime:"%H:%M:%S" format sys.now
  display.text:currentTime
end
{end}
```

## Integration with External Systems

### Receiving Messages from Parent Window
```javascript
// In external JavaScript (outside Decker)
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'switchCard') {
    const cardName = event.data.data.card;
    n_go([lms(cardName)], deck);
  }
});
```

### Sending Commands to Decker
```javascript
// From parent window to Decker
deckerFrame.contentWindow.postMessage({
  type: 'switchCard',
  data: { card: 'cardname' }
}, '*');
```

## Best Practices

1. **Asset Management**: Use embedded fonts and sounds for self-contained decks
2. **Contraption Design**: Create reusable components with clear interfaces
3. **Performance**: Use `animated:1` sparingly, only for dynamic content
4. **Transitions**: Choose appropriate transitions for user experience
5. **Error Handling**: Use `alert[]` for user feedback and debugging
6. **Code Organization**: Group related functionality in contraptions
7. **Responsive Design**: Design for 512x342 base size with scaling considerations

## Common Advanced Patterns

### Real-time Clock
```lil
{script:clock.1}
on view do
  time:"%H:%M:%S" format sys.now
  me.text:time
end
{end}
```

### Data Validation
```lil
{script:input.1}
on change do
  if me.text~"[0-9]+"
    processNumber[0+me.text]
  else
    alert["Please enter a number"]
    me.text:""
  end
end
{end}
```

### Dynamic Grid Population
```lil
{script:grid.1}
on view do
  data:[["Name","Age"],["Alice","25"],["Bob","30"]]
  me.value:data
end
{end}
```

### Custom Animation
```lil
{script:canvas.1}
on view do
  frame:(frame+1)%360
  me.clear[]
  x:50+30*sin[frame*0.1]
  me.rect[x,50 20,20 "fill"]
end
{end}
```

---

*This comprehensive API documentation is based on analysis of the official Decker tour and practical implementation experience. It covers the full spectrum of Decker's capabilities for creating rich, interactive card-based applications.*

## Human-Readable Documentation

### Card Structure

A Decker card consists of:
1. **Card declaration** - `{card:cardname}`
2. **Script reference** - `script:"cardname.scriptindex"`
3. **Widget definitions** - `{widgets}` block
4. **Script implementations** - `{script:cardname.scriptindex}` blocks

### Widget Types

#### Field Widget (Text Display)
```javascript
fieldname:{"type":"field","size":[width,height],"pos":[x,y],"text":"content","align":"center","show":"transparent","border":0,"locked":1,"volatile":1}
```
- **Purpose**: Display text, labels, or static content
- **Key Properties**:
  - `text`: The displayed text content
  - `align`: Text alignment ("center", "left", "right")
  - `show`: Background style ("transparent", "opaque", "rect")
  - `border`: Border width (0 for no border)
  - `locked`: 1 to prevent user editing
  - `volatile`: 1 for dynamic content that changes

#### Button Widget
```javascript
buttonname:{"type":"button","size":[width,height],"pos":[x,y],"text":"label","style":"rect","script":"scriptname"}
```
- **Purpose**: Interactive buttons that trigger actions
- **Key Properties**:
  - `text`: Button label
  - `style`: Visual style ("rect", "round")
  - `script`: Script to execute on click

#### Slider Widget
```javascript
slidername:{"type":"slider","size":[width,height],"pos":[x,y],"value":initialValue,"range":[min,max],"script":"scriptname"}
```
- **Purpose**: Numeric input control
- **Key Properties**:
  - `value`: Initial/current value
  - `range`: [minimum, maximum] values
  - `script`: Script to execute on value change

### Script Events

#### Card Events
```lil
{script:cardname.0}
on view do
  % Executed when card becomes visible
  % Use for initialization, sending notifications
  send["card-changed:cardname"]
end
{end}
```

#### Widget Events
```lil
{script:widgetname.1}
on click do
  % For buttons - executed when clicked
  send["button-clicked"]
  go["nextcard"]
end
{end}

{script:slidername.1}
on change do
  % For sliders - executed when value changes
  value:this.value
  card.widgets["displayfield"].text:value "%"
  send["value-changed:" value]
end
{end}
```

### Navigation Commands

```lil
go["cardname"]    % Navigate to specific card by name
go["Next"]        % Navigate to next card in deck
go["Prev"]        % Navigate to previous card in deck
go["Back"]        % Navigate to previous card in history
```

### Messaging System

```lil
send["simple-message"]              % Send simple string message
send["key:value"]                   % Send key-value pair message
send["data:" someVariable]          % Send variable data
```

### Widget Property Access

```lil
% Reading widget properties
currentText:card.widgets["fieldname"].text
currentValue:card.widgets["slidername"].value

% Writing widget properties
card.widgets["fieldname"].text:"New text"
card.widgets["slidername"].value:75
```

### Layout Guidelines

- **Position**: `[x,y]` coordinates from top-left corner
- **Size**: `[width,height]` in pixels
- **Common card size**: 512x342 pixels
- **Typical margins**: 20-50 pixels from edges
- **Widget spacing**: 10-20 pixels between elements

### Complete Example

```javascript
{card:example}
script:"example.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,50],"locked":1,"volatile":1,"show":"transparent","border":0,"style":"plain","align":"center","text":"Example Card"}
description:{"type":"field","size":[400,40],"pos":[56,100],"locked":1,"volatile":1,"show":"transparent","border":0,"style":"plain","align":"center","text":"This is an example card with interactive elements"}
valueSlider:{"type":"slider","size":[200,30],"pos":[156,160],"script":"example.1","value":50,"range":[0,100]}
valueDisplay:{"type":"field","size":[60,20],"pos":[226,200],"locked":1,"volatile":1,"show":"transparent","border":0,"style":"plain","align":"center","text":"50%"}
actionButton:{"type":"button","size":[100,30],"pos":[206,250],"script":"example.2","text":"Action","style":"rect"}

{script:example.0}
on view do
  send["card-changed:example"]
end
{end}

{script:example.1}
on change do
  value:this.value
  card.widgets["valueDisplay"].text:value "%"
  send["value-changed:" value]
end
{end}

{script:example.2}
on click do
  send["action-clicked"]
  go["nextcard"]
end
{end}
```

## Integration with External Systems

### Receiving Messages from Parent Window
```javascript
// In external JavaScript (outside Decker)
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'switchCard') {
    const cardName = event.data.data.card;
    n_go([lms(cardName)], deck);
  }
});
```

### Sending Commands to Decker
```javascript
// From parent window to Decker
deckerFrame.contentWindow.postMessage({
  type: 'switchCard',
  data: { card: 'cardname' }
}, '*');
```

## Best Practices

1. **Consistent Naming**: Use descriptive names for cards and widgets
2. **Script Organization**: Use numbered scripts (card.0, card.1, etc.)
3. **Message Prefixes**: Use consistent prefixes for message types
4. **Error Handling**: Always check widget existence before accessing
5. **Performance**: Use `volatile:1` only for frequently changing content
6. **Layout**: Design for 512x342 card size, consider responsive positioning

## Common Patterns

### Card Navigation Flow
```lil
% Welcome → Main → Detail pattern
{script:welcome.1}
on click do
  send["game-started"]
  go["main"]
end
{end}
```

### Value Synchronization
```lil
% Slider with text display
{script:slider.1}
on change do
  value:this.value
  card.widgets["display"].text:value " units"
  send["value-updated:" value]
end
{end}
```

### Conditional Navigation
```lil
% Navigate based on state
{script:button.1}
on click do
  if someCondition
    go["success"]
  else
    go["failure"]
  end
end
{end}
```

---

*This API documentation is based on reverse-engineering the Decker system and practical implementation experience. For official documentation, refer to the Decker reference materials.*
