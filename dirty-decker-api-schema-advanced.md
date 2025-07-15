# Dirty Decker API Schema (Advanced Machine-Readable)

## Core Deck Structure

### DECK_TEMPLATE
```javascript
{deck}
version:1
card:0
size:[512,342]
name:"DeckName"

{fonts}
fontname:"%%FNT..."

{sounds}
soundname:"%%SND..."

{card:cardname}
image:"%%IMG..."
script:"cardname.0"
{widgets}
// Widget definitions
{script:cardname.0}
// Event handlers
{end}

{contraption:name}
size:[w,h]
resizable:0|1
margin:[top,right,bottom,left]
description:"text"
script:"name.0p"
attributes:{"name":["attr1"],"label":["Label1"],"type":["string"]}
{widgets}
// Contraption widgets
{script:name.0p}
// Contraption scripts
{end}
```

## Widget Schemas

### BASIC_WIDGETS
```javascript
FIELD: {"type":"field","size":[W,H],"pos":[X,Y],"text":"STRING","align":"center|left|right","show":"transparent|opaque|rect|none","border":0|1,"locked":0|1,"volatile":0|1,"style":"plain|code","font":"FONTNAME","value":"STRING","script":"SCRIPTNAME"}
BUTTON: {"type":"button","size":[W,H],"pos":[X,Y],"text":"STRING","style":"rect|round|check|invisible","script":"SCRIPTNAME","value":0|1}
SLIDER: {"type":"slider","size":[W,H],"pos":[X,Y],"value":NUMBER,"range":[MIN,MAX],"script":"SCRIPTNAME"}
```

### ADVANCED_WIDGETS
```javascript
CANVAS: {"type":"canvas","size":[W,H],"pos":[X,Y],"locked":0|1,"animated":0|1,"volatile":0|1,"script":"SCRIPTNAME","scale":NUMBER,"image":"%%IMG..."}
GRID: {"type":"grid","size":[W,H],"pos":[X,Y],"script":"SCRIPTNAME","value":[[DATA]],"widths":[COLWIDTHS],"headers":["COL1","COL2"]}
CONTRAPTION: {"type":"contraption","size":[W,H],"pos":[X,Y],"def":"CONTRAPTIONNAME","script":"SCRIPTNAME"}
```

## Event Schemas

### STANDARD_EVENTS
```javascript
VIEW_EVENT: on view do ACTIONS end
CLICK_EVENT: on click do ACTIONS end
CHANGE_EVENT: on change do ACTIONS end
DRAG_EVENT: on drag do ACTIONS end
DROP_EVENT: on drop do ACTIONS end
KEY_EVENT: on key KEY do ACTIONS end
OPEN_EVENT: on open do ACTIONS end
CLOSE_EVENT: on close do ACTIONS end
```

### CONTRAPTION_EVENTS
```javascript
ATTRIBUTE_SETTER: on set_ATTRNAME VALUE do ACTIONS end
ATTRIBUTE_GETTER: on get_ATTRNAME do RETURN_VALUE end
CUSTOM_METHOD: on do_METHODNAME do ACTIONS end
```

## Action Schemas

### NAVIGATION_ACTIONS
```javascript
SIMPLE_NAV: go["CARDNAME"]
TRANSITION_NAV: go["CARDNAME" "TRANSITIONNAME"]
CONDITIONAL_NAV: if CONDITION go["CARD1"] else go["CARD2"] end
BACK_NAV: go["Back"]
NEXT_NAV: go["Next"]
PREV_NAV: go["Prev"]
```

### WIDGET_ACTIONS
```javascript
WIDGET_READ: card.widgets["NAME"].PROPERTY
WIDGET_WRITE: card.widgets["NAME"].PROPERTY:VALUE
SELF_REFERENCE: this.PROPERTY
ME_REFERENCE: me.PROPERTY
VALUE_ACCESS: this.value
```

### CANVAS_ACTIONS
```javascript
CLEAR_CANVAS: CANVAS.clear[]
DRAW_TEXT: CANVAS.text["TEXT" POSITION "ALIGN"]
DRAW_RECT: CANVAS.rect[POSITION SIZE "STYLE"]
DRAW_LINE: CANVAS.line[START_POS END_POS]
PASTE_IMAGE: CANVAS.paste[IMAGE POSITION]
MERGE_IMAGES: CANVAS.merge[IMAGE1 IMAGE2]
```

### DATA_ACTIONS
```javascript
FORMAT_STRING: "%FORMAT" format VALUES
PARSE_DATA: parse["DATA"]
ARRAY_APPEND: ARRAY,NEW_ITEM
ARRAY_SLICE: ARRAY[START,END]
CONDITIONAL: if CONDITION ACTION1 else ACTION2 end
LOOP: each ITEM in ARRAY ACTION end
ALERT: alert["MESSAGE"]
SEND_MESSAGE: send["MESSAGE"]
SEND_KEYVALUE: send["KEY:VALUE"]
```

## Complete Pattern Library

### P001_BASIC_CARD
```javascript
{card:basic}
script:"basic.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,50],"locked":1,"text":"Title","align":"center"}
{script:basic.0}
on view do
  send["card-loaded:basic"]
end
{end}
```

### P002_WELCOME_CARD
```javascript
{card:welcome}
script:"welcome.0"
{widgets}
title:{"type":"field","size":[300,40],"pos":[106,50],"locked":1,"text":"Welcome","align":"center"}
description:{"type":"field","size":[400,60],"pos":[56,100],"locked":1,"text":"Description text"}
startBtn:{"type":"button","size":[100,30],"pos":[206,200],"text":"Start","style":"rect","script":"welcome.1"}
{script:welcome.0}
on view do
  send["welcome-shown"]
end
{script:welcome.1}
on click do
  go["main"]
end
{end}
```

### P003_MENU_CARD
```javascript
{card:menu}
script:"menu.0"
{widgets}
title:{"type":"field","size":[300,40],"pos":[106,20],"locked":1,"text":"Menu","align":"center"}
option1:{"type":"button","size":[150,30],"pos":[181,80],"text":"Option 1","style":"rect","script":"menu.1"}
option2:{"type":"button","size":[150,30],"pos":[181,120],"text":"Option 2","style":"rect","script":"menu.2"}
option3:{"type":"button","size":[150,30],"pos":[181,160],"text":"Option 3","style":"rect","script":"menu.3"}
{script:menu.0}
on view do
  send["menu-displayed"]
end
{script:menu.1}
on click do
  go["card1"]
end
{script:menu.2}
on click do
  go["card2"]
end
{script:menu.3}
on click do
  go["card3"]
end
{end}
```

### P004_INTERACTIVE_CARD
```javascript
{card:interactive}
script:"interactive.0"
{widgets}
textInput:{"type":"field","size":[200,25],"pos":[156,100],"text":"","border":1,"locked":0,"script":"interactive.1"}
slider:{"type":"slider","size":[200,20],"pos":[156,150],"value":50,"range":[0,100],"script":"interactive.2"}
submitBtn:{"type":"button","size":[100,30],"pos":[206,200],"text":"Submit","style":"rect","script":"interactive.3"}
output:{"type":"field","size":[300,30],"pos":[106,250],"locked":1,"text":"Output will appear here"}
{script:interactive.0}
on view do
  output.text:"Ready"
end
{script:interactive.1}
on change do
  send["input-changed:" this.text]
end
{script:interactive.2}
on change do
  output.text:"Value: " this.value
end
{script:interactive.3}
on click do
  result:textInput.text " - " slider.value
  output.text:result
end
{end}
```

### P005_CANVAS_CARD
```javascript
{card:canvas_demo}
script:"canvas_demo.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,20],"locked":1,"text":"Canvas Demo","align":"center"}
canvas:{"type":"canvas","size":[400,250],"pos":[56,60],"animated":1,"script":"canvas_demo.1","scale":1}
clearBtn:{"type":"button","size":[80,25],"pos":[56,320],"text":"Clear","style":"rect","script":"canvas_demo.2"}
animateBtn:{"type":"button","size":[80,25],"pos":[146,320],"text":"Animate","style":"rect","script":"canvas_demo.3"}
{script:canvas_demo.0}
on view do
  frame:0
end
{script:canvas_demo.1}
on view do
  me.clear[]
  me.text["Canvas Ready" me.size/2 "center"]
end
{script:canvas_demo.2}
on click do
  canvas.clear[]
end
{script:canvas_demo.3}
on click do
  frame:(frame+1)%360
  canvas.clear[]
  x:50+30*sin[frame*0.1]
  canvas.rect[x,50 20,20 "fill"]
end
{end}
```

### P006_GRID_CARD
```javascript
{card:data_grid}
script:"data_grid.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,20],"locked":1,"text":"Data Grid","align":"center"}
dataGrid:{"type":"grid","size":[400,200],"pos":[56,60],"script":"data_grid.1","headers":["Name","Score","Level"],"widths":[150,100,100],"value":[["Alice","95","Expert"],["Bob","87","Advanced"],["Charlie","92","Expert"]]}
addBtn:{"type":"button","size":[80,25],"pos":[56,270],"text":"Add Row","style":"rect","script":"data_grid.2"}
removeBtn:{"type":"button","size":[80,25],"pos":[146,270],"text":"Remove","style":"rect","script":"data_grid.3"}
{script:data_grid.0}
on view do
  send["grid-initialized"]
end
{script:data_grid.1}
on click do
  selected:me.selection
  if selected
    alert["Selected: %s" format me.value[selected]]
  end
end
{script:data_grid.2}
on click do
  newRow:["New Player" "0" "Beginner"]
  dataGrid.value:dataGrid.value,newRow
end
{script:data_grid.3}
on click do
  selected:dataGrid.selection
  if selected
    rows:dataGrid.value
    dataGrid.value:rows[0,selected-1],rows[selected+1,count rows]
  end
end
{end}
```

### P007_CONTRAPTION_CARD
```javascript
{card:contraption_demo}
script:"contraption_demo.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,20],"locked":1,"text":"Contraption Demo","align":"center"}
clock:{"type":"contraption","size":[150,100],"pos":[56,60],"def":"digitalClock","script":"contraption_demo.1"}
dice:{"type":"contraption","size":[100,100],"pos":[220,60],"def":"diceRoller","script":"contraption_demo.2"}
counter:{"type":"contraption","size":[120,80],"pos":[340,60],"def":"simpleCounter","script":"contraption_demo.3"}
{script:contraption_demo.0}
on view do
  send["contraptions-loaded"]
end
{script:contraption_demo.1}
on view do
  // Clock updates automatically
end
{script:contraption_demo.2}
on click do
  // Dice roller interaction
end
{script:contraption_demo.3}
on click do
  // Counter interaction
end
{end}
```

### P008_TRANSITION_CARD
```javascript
{card:transition_demo}
script:"transition_demo.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,20],"locked":1,"text":"Transition Demo","align":"center"}
slideLeft:{"type":"button","size":[100,30],"pos":[56,80],"text":"Slide Left","style":"rect","script":"transition_demo.1"}
slideRight:{"type":"button","size":[100,30],"pos":[166,80],"text":"Slide Right","style":"rect","script":"transition_demo.2"}
boxIn:{"type":"button","size":[100,30],"pos":[276,80],"text":"Box In","style":"rect","script":"transition_demo.3"}
wipeUp:{"type":"button","size":[100,30],"pos":[386,80],"text":"Wipe Up","style":"rect","script":"transition_demo.4"}
backBtn:{"type":"button","size":[100,30],"pos":[206,280],"text":"Back","style":"rect","script":"transition_demo.5"}
{script:transition_demo.0}
on view do
  send["transitions-ready"]
end
{script:transition_demo.1}
on click do
  go["target" "SlideLeft"]
end
{script:transition_demo.2}
on click do
  go["target" "SlideRight"]
end
{script:transition_demo.3}
on click do
  go["target" "BoxIn"]
end
{script:transition_demo.4}
on click do
  go["target" "WipeUp"]
end
{script:transition_demo.5}
on click do
  go["Back"]
end
{end}
```

## Contraption Patterns

### BASIC_CONTRAPTION
```javascript
{contraption:simpleClock}
size:[150,80]
resizable:1
margin:[8,8,8,8]
description:"A simple digital clock"
script:"simpleClock.0p"
attributes:{"name":["format"],"label":["Time Format"],"type":["string"]}
{widgets}
display:{"type":"field","size":[150,40],"pos":[0,20],"locked":1,"style":"plain","align":"center"}
{script:simpleClock.0p}
on view do
  currentTime:"%H:%M:%S" format sys.now
  display.text:currentTime
end
on set_format x do
  timeFormat:x
end
on get_format do
  timeFormat
end
{end}
```

### INTERACTIVE_CONTRAPTION
```javascript
{contraption:diceRoller}
size:[100,100]
resizable:0
margin:[5,5,5,5]
description:"A six-sided die roller"
script:"diceRoller.0p"
attributes:{"name":["sides"],"label":["Number of Sides"],"type":["number"]}
{widgets}
canvas:{"type":"canvas","size":[90,60],"pos":[5,5],"animated":0,"script":"diceRoller.1p"}
rollBtn:{"type":"button","size":[90,25],"pos":[5,70],"text":"Roll","style":"rect","script":"diceRoller.2p"}
{script:diceRoller.0p}
on view do
  sides:6
  lastRoll:1
end
on set_sides x do
  sides:x
end
on get_sides do
  sides
end
{script:diceRoller.1p}
on view do
  me.clear[]
  me.text[string[lastRoll] me.size/2 "center"]
end
{script:diceRoller.2p}
on click do
  lastRoll:1+random[sides]
  canvas.clear[]
  canvas.text[string[lastRoll] canvas.size/2 "center"]
end
{end}
```

## Transition Patterns

### BUILTIN_TRANSITIONS
```javascript
SLIDE_TRANSITIONS: ["SlideLeft","SlideRight","SlideUp","SlideDown"]
WIPE_TRANSITIONS: ["WipeLeft","WipeRight","WipeUp","WipeDown"]
BOX_TRANSITIONS: ["BoxIn","BoxOut"]
```

### CUSTOM_TRANSITION
```javascript
CUSTOM_FADE: transition[on CustomFade c a b t do
  c.clear[]
  c.paste[a 0,0]
  c.paste[b 0,0 t]
end]
```

## Asset Patterns

### FONT_DEFINITION
```javascript
{fonts}
customFont:"%%FNT..." // Base64 encoded font data
titleFont:"%%FNT..." // Another font
```

### SOUND_DEFINITION
```javascript
{sounds}
clickSound:"%%SND..." // Base64 encoded sound data
bgMusic:"%%SND..." // Background music
```

### IMAGE_EMBEDDING
```javascript
CARD_IMAGE: image:"%%IMG..." // In card definition
WIDGET_IMAGE: "image":"%%IMG..." // In widget definition
CANVAS_IMAGE: canvas.paste["%%IMG..." position] // In canvas script
```

## Error Handling Patterns

### VALIDATION_PATTERNS
```javascript
WIDGET_EXISTS: if card.widgets["name"] action else alert["Widget not found"] end
VALUE_VALIDATION: if input~"[0-9]+" processNumber[0+input] else alert["Invalid number"] end
CARD_EXISTS: if cardExists["name"] go["name"] else alert["Card not found"] end
```

### USER_FEEDBACK
```javascript
SUCCESS_MESSAGE: alert["Operation completed successfully"]
ERROR_MESSAGE: alert["Error: %s" format errorMessage]
CONFIRMATION: alert["Are you sure?"]
```

## Performance Patterns

### OPTIMIZATION_PATTERNS
```javascript
LAZY_LOADING: on view do if not loaded initialize[] loaded:1 end end
EFFICIENT_CANVAS: // Use animated:1 only when needed, batch operations
MEMORY_MANAGEMENT: // Clear large data structures, use volatile:1 for frequent updates
```

### CACHING_PATTERNS
```javascript
DATA_CACHE: if not cache cache:loadData[] end
RESULT_CACHE: if not results[key] results[key]:calculate[key] end
```

## Complete Advanced Example

### FULL_DECK_WITH_CONTRAPTIONS
```javascript
{deck}
version:1
card:0
size:[512,342]
name:"Advanced Demo"

{fonts}
titleFont:"%%FNT..."

{sounds}
clickSound:"%%SND..."

{card:main}
image:"%%IMG..."
script:"main.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,20],"locked":1,"font":"titleFont","text":"Advanced Demo","align":"center"}
gameCanvas:{"type":"canvas","size":[400,200],"pos":[56,50],"animated":1,"script":"main.1","scale":1}
clock:{"type":"contraption","size":[100,50],"pos":[56,260],"def":"digitalClock","script":"main.2"}
scoreGrid:{"type":"grid","size":[200,100],"pos":[200,260],"script":"main.3","headers":["Player","Score"],"widths":[100,100],"value":[["Alice","100"],["Bob","85"]]}
nextBtn:{"type":"button","size":[80,25],"pos":[420,320],"text":"Next","style":"rect","script":"main.4"}
{script:main.0}
on view do
  gameState:"initialized"
  frame:0
  send["game-loaded"]
end
{script:main.1}
on view do
  frame:(frame+1)%360
  me.clear[]
  me.text["Game Running" me.size/2 "center"]
  x:50+30*sin[frame*0.1]
  me.rect[x,50 20,20 "fill"]
end
{script:main.2}
on view do
  // Clock contraption handles itself
end
{script:main.3}
on click do
  selected:me.selection
  if selected
    player:me.value[selected][0]
    alert["Selected player: %s" format player]
  end
end
{script:main.4}
on click do
  go["nextcard" "SlideLeft"]
end
{end}

{contraption:digitalClock}
size:[100,50]
resizable:0
margin:[5,5,5,5]
description:"Real-time digital clock"
script:"digitalClock.0p"
{widgets}
display:{"type":"field","size":[100,30],"pos":[0,10],"locked":1,"style":"plain","align":"center"}
{script:digitalClock.0p}
on view do
  currentTime:"%H:%M:%S" format sys.now
  display.text:currentTime
end
{end}
```

---

*This comprehensive machine-readable schema covers all advanced Decker features including contraptions, canvas operations, grid widgets, transitions, and asset management.*
