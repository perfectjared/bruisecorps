# Dirty Decker API - Machine Readable Schema

## Core Patterns

### CARD_TEMPLATE
```
{card:NAME}
script:"NAME.0"
{widgets}
WIDGET_DEFINITIONS
{script:NAME.INDEX}
EVENT_HANDLERS
{end}
```

### WIDGET_SCHEMAS
```javascript
FIELD: {"type":"field","size":[W,H],"pos":[X,Y],"text":"STRING","align":"center|left|right","show":"transparent|opaque|rect","border":NUMBER,"locked":0|1,"volatile":0|1}
BUTTON: {"type":"button","size":[W,H],"pos":[X,Y],"text":"STRING","style":"rect|round","script":"SCRIPT_NAME"}
SLIDER: {"type":"slider","size":[W,H],"pos":[X,Y],"value":NUMBER,"range":[MIN,MAX],"script":"SCRIPT_NAME"}
```

### EVENT_SCHEMAS
```lil
VIEW_EVENT: on view do ACTIONS end
CLICK_EVENT: on click do ACTIONS end
CHANGE_EVENT: on change do ACTIONS end
```

### ACTION_SCHEMAS
```lil
NAVIGATE: go["CARD_NAME"|"Next"|"Prev"|"Back"]
MESSAGE: send["STRING"]|send["KEY:VALUE"]
WIDGET_READ: card.widgets["NAME"].PROPERTY
WIDGET_WRITE: card.widgets["NAME"].PROPERTY:VALUE
VALUE_ACCESS: this.value
```

## Pattern Library

### P001_WELCOME_CARD
```
{card:welcome}
script:"welcome.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,50],"text":"TITLE","align":"center","show":"transparent","border":0,"locked":1,"volatile":1}
button:{"type":"button","size":[120,40],"pos":[196,250],"text":"START","style":"rect","script":"welcome.1"}
{script:welcome.0}
on view do
  send["card-changed:welcome"]
end
{end}
{script:welcome.1}
on click do
  send["ACTION_MESSAGE"]
  go["TARGET_CARD"]
end
{end}
```

### P002_CONTROL_CARD
```
{card:control}
script:"control.0"
{widgets}
label:{"type":"field","size":[100,20],"pos":[50,150],"text":"LABEL:","align":"left","show":"transparent","border":0,"locked":1,"volatile":1}
slider:{"type":"slider","size":[200,30],"pos":[150,145],"value":50,"range":[0,100],"script":"control.1"}
display:{"type":"field","size":[50,20],"pos":[360,150],"text":"50%","align":"center","show":"transparent","border":0,"locked":1,"volatile":1}
{script:control.0}
on view do
  send["card-changed:control"]
end
{end}
{script:control.1}
on change do
  value:this.value
  card.widgets["display"].text:value "%"
  send["value-changed:" value]
end
{end}
```

### P003_NAVIGATION_CARD
```
{card:nav}
script:"nav.0"
{widgets}
title:{"type":"field","size":[300,30],"pos":[106,50],"text":"NAVIGATION","align":"center","show":"transparent","border":0,"locked":1,"volatile":1}
prevButton:{"type":"button","size":[80,30],"pos":[100,250],"text":"Previous","style":"rect","script":"nav.1"}
nextButton:{"type":"button","size":[80,30],"pos":[332,250],"text":"Next","style":"rect","script":"nav.2"}
{script:nav.0}
on view do
  send["card-changed:nav"]
end
{end}
{script:nav.1}
on click do
  go["Prev"]
end
{end}
{script:nav.2}
on click do
  go["Next"]
end
{end}
```

## Integration Patterns

### I001_EXTERNAL_CARD_SWITCH
```javascript
// External JS to Decker
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'switchCard') {
    const cardName = event.data.data.card;
    n_go([lms(cardName)], deck);
  }
});
```

### I002_DECKER_TO_EXTERNAL
```lil
// Decker to External JS
send["message-type:data"]
send["card-changed:cardname"]
send["value-changed:" value]
send["action-triggered"]
```

## Common Dimensions

### CARD_SIZE: [512, 342]
### BUTTON_SMALL: [80, 30]
### BUTTON_MEDIUM: [120, 40]  
### BUTTON_LARGE: [160, 50]
### FIELD_TITLE: [300, 30]
### FIELD_SUBTITLE: [200, 20]
### FIELD_DESCRIPTION: [400, 40]
### SLIDER_STANDARD: [200, 30]
### MARGINS: 20-50px from edges
### SPACING: 10-20px between elements

## Message Types

### SYSTEM_MESSAGES
- "card-changed:CARDNAME"
- "game-started"
- "value-changed:NUMBER"
- "action-triggered"

### NAVIGATION_MESSAGES
- "switch-to:CARDNAME"
- "navigate:next"
- "navigate:prev"
- "navigate:back"

### CONTROL_MESSAGES
- "slider-changed:NAME:VALUE"
- "button-clicked:NAME"
- "field-updated:NAME:VALUE"

## Error Patterns

### COMMON_ERRORS
- "go is not defined" → Use n_go([lms(cardname)], deck) in JS context
- "card.widgets undefined" → Check widget exists before access
- "send not working" → Verify message listener in parent window
- "script not executing" → Check script name matches widget script property

## Performance Notes

### OPTIMIZATION
- Use volatile:1 only for frequently changing widgets
- Minimize script complexity in event handlers
- Cache widget references for repeated access
- Use efficient message passing patterns

### ANTI_PATTERNS
- Don't use go[] in JavaScript context
- Don't access non-existent widgets
- Don't create circular navigation loops
- Don't send messages without listeners
