// Decker UI communication and message handling system
import { AppData } from '../config/app-config'
import * as Tone from 'tone'

export function setupDeckerCommunication(
  appData: AppData,
  synth: Tone.Synth,
  switchToMargeCamera: () => void,
  switchToRearviewCamera: () => void,
  handleHealthChange: (health: number) => void,
  setFocus: (focused: boolean) => void
): void {
  appData.deckerFrame = document.getElementById('deck-iframe') as HTMLIFrameElement
  
  // Debug iframe visibility
  if (appData.deckerFrame) {
    console.log('✅ Decker iframe found');
    console.log('Iframe visibility:', window.getComputedStyle(appData.deckerFrame).visibility);
    console.log('Iframe display:', window.getComputedStyle(appData.deckerFrame).display);
    console.log('Iframe opacity:', window.getComputedStyle(appData.deckerFrame).opacity);
    console.log('Iframe z-index:', window.getComputedStyle(appData.deckerFrame).zIndex);
    
    // Check container too
    const container = document.getElementById('deck-container');
    if (container) {
      console.log('Container visibility:', window.getComputedStyle(container).visibility);
      console.log('Container display:', window.getComputedStyle(container).display);
      console.log('Container opacity:', window.getComputedStyle(container).opacity);
      console.log('Container z-index:', window.getComputedStyle(container).zIndex);
    }
    
    // Force visibility just in case
    appData.deckerFrame.style.visibility = 'visible';
    appData.deckerFrame.style.display = 'block';
    appData.deckerFrame.style.opacity = '1';
    
    if (container) {
      container.style.visibility = 'visible';
      container.style.display = 'flex';
      container.style.opacity = '1';
    }
    
    // Wait for iframe to load, then force it to home card
    if (appData.deckerFrame.contentWindow) {
      setTimeout(() => {
        console.log('🏠 Forcing Decker to home card on startup');
        sendToDecker(appData, 'go', { card: 'home' });
      }, 1000);
    } else {
      appData.deckerFrame.addEventListener('load', () => {
        setTimeout(() => {
          console.log('🏠 Decker loaded, forcing to home card');
          sendToDecker(appData, 'go', { card: 'home' });
        }, 500);
      });
    }
  } else {
    console.error('❌ Decker iframe NOT found!');
  }
  
  window.addEventListener('message', (event) => {
    if (event.source !== appData.deckerFrame?.contentWindow) return
    
    const message = event.data
      if (typeof message === 'object' && message.type) {
      handleDeckerObjectMessage(message, appData, synth, switchToMargeCamera, switchToRearviewCamera, setFocus)
    }
    
    if (typeof message === 'string') {
      handleDeckerStringMessage(
        message, 
        appData, 
        synth, 
        switchToMargeCamera, 
        switchToRearviewCamera, 
        handleHealthChange, 
        setFocus
      )
    }
  })
  
  // Send periodic updates to Decker
  setInterval(() => {
    sendToDecker(appData, 'pointerUpdate', {
      active: appData.pointerActive.active,
      targetSprite: appData.pointerActive.targetSprite?.texture.key || null
    })
  }, 100)
}

function handleDeckerObjectMessage(
  message: any,
  appData: AppData,
  synth: Tone.Synth,
  switchToMargeCamera: () => void,
  switchToRearviewCamera: () => void,
  setFocus: (focused: boolean) => void
): void {
  const { type, data } = message
  
  switch (type) {
    case 'switchCamera':
      if (data.camera === 'marge') switchToMargeCamera()
      else if (data.camera === 'rearview') switchToRearviewCamera()
      break
      
    case 'playSound':
      if (data.frequency && data.duration) {
        synth.triggerAttackRelease(data.frequency, data.duration)
      }
      break
      
    case 'decker-pointer-passthrough':
      handlePointerPassthrough(message, appData)
      break
      
    case 'requestGameState':
      sendToDecker(appData, 'gameState', {
        hasFocus: appData.hasFocus,
        pointerActive: appData.pointerActive.active,
        targetSprite: appData.pointerActive.targetSprite?.texture.key || null,
        width: appData.width,
        height: appData.height
      })
      break
      
    case 'deckScript':
      if (data.action === 'switchCamera') {
        if (data.target === 'marge') switchToMargeCamera()
        else if (data.target === 'rearview') switchToRearviewCamera()
      } else if (data.action === 'playSound') {
        synth.triggerAttackRelease(data.frequency || 440, data.duration || 0.5)
      }
      break
      
    case 'decker-message':
      if (message.message === 'focus') setFocus(true)
      else if (message.message === 'blur') setFocus(false)
      else if (message.data?.action === 'game-started') {
        appData.gameStarted = true
        setFocus(true)
      }
      break
  }
}

function handleDeckerStringMessage(
  message: string,
  appData: AppData,
  synth: Tone.Synth,
  switchToMargeCamera: () => void,
  switchToRearviewCamera: () => void,
  handleHealthChange: (health: number) => void,
  setFocus: (focused: boolean) => void
): void {
  if (message.startsWith('camera:')) {
    const camera = message.split(':')[1]
    if (camera === 'marge') switchToMargeCamera()
    else if (camera === 'rearview') switchToRearviewCamera()
  } else if (message.startsWith('sound:')) {
    if (!appData.gameStarted) return
    
    if (!appData.audioStarted) appData.audioStarted = true
    const params = message.split(':')[1]
    const [freq, dur] = params.split(',')
    synth.triggerAttackRelease(parseFloat(freq) || 440, parseFloat(dur) || 0.5)
  } else if (message === 'getState') {
    sendToDecker(appData, 'gameState', {
      hasFocus: appData.hasFocus,
      pointerActive: appData.pointerActive.active,
      targetSprite: appData.pointerActive.targetSprite?.texture.key || null,
      width: appData.width,
      height: appData.height
    })
  } else if (message === 'focus') {
    setFocus(true)
  } else if (message === 'blur') {
    setFocus(false)
  } else if (message.startsWith('health-changed:')) {
    const healthValue = parseInt(message.split(':')[1])
    handleHealthChange(healthValue)
  } else if (message === 'game-started') {
    console.log('🎮 Game started message received');
    appData.gameStarted = true
    appData.audioStarted = true
    setFocus(true)
    
    // Force Decker to home card first, then to marge card
    setTimeout(() => {
      console.log('🎯 Sending go to home card');
      sendToDecker(appData, 'go', { card: 'home' });
      setTimeout(() => {
        console.log('🎯 Sending go to marge card');
        sendToDecker(appData, 'go', { card: 'marge' });
      }, 500);
    }, 100);
  } else if (message === 'audioInitialized') {
    appData.audioStarted = true
  }
}

function handlePointerPassthrough(message: any, appData: AppData): void {
  if (!appData.gameStarted) return
  
  const pointerEvent = message.event
  const canvas = document.querySelector('canvas') as HTMLCanvasElement
  
  if (canvas && pointerEvent) {
    // Simple approach: Convert ALL touch events to mouse events
    let eventType = pointerEvent.type
    let clientX = pointerEvent.clientX || 0
    let clientY = pointerEvent.clientY || 0
    
    // Handle touch events by converting to mouse events
    if (pointerEvent.type.startsWith('touch')) {
      // Convert touch event types to mouse event types
      if (pointerEvent.type === 'touchstart') eventType = 'mousedown'
      else if (pointerEvent.type === 'touchend') eventType = 'mouseup'
      else if (pointerEvent.type === 'touchmove') eventType = 'mousemove'
      
      // Get coordinates from first touch point
      if (pointerEvent.touches && pointerEvent.touches.length > 0) {
        clientX = pointerEvent.touches[0].clientX
        clientY = pointerEvent.touches[0].clientY
      } else if (pointerEvent.changedTouches && pointerEvent.changedTouches.length > 0) {
        clientX = pointerEvent.changedTouches[0].clientX
        clientY = pointerEvent.changedTouches[0].clientY
      }
    }
    
    // Create and dispatch simple mouse event
    const syntheticEvent = new MouseEvent(eventType, {
      clientX,
      clientY,
      button: pointerEvent.button || 0,
      buttons: pointerEvent.buttons || (eventType === 'mousedown' ? 1 : 0),
      bubbles: true,
      cancelable: true
    })
    
    canvas.dispatchEvent(syntheticEvent)
  }
}

export function sendToDecker(appData: AppData, type: string, data: any): void {
  if (appData.deckerFrame?.contentWindow) {
    appData.deckerFrame.contentWindow.postMessage({ type, data }, '*')
  }
}
