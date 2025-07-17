import 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin'
import AnchorPlugin from 'phaser3-rex-plugins/plugins/anchor-plugin'
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin'
import SliderPlugin from 'phaser3-rex-plugins/plugins/slider-plugin'

import Debug from './debug'
import Game from './game/game'
import Marge from './game/marge/marge'
import Menu from './game/menu/menu'
import Synth from './game/synth'
import Road from './game/marge/road'
import Rearview from './game/marge/rearview'
import { initVectorGraphics } from './lib/vector-graphics'
import colors from './data/colors'

// Import new systems
import { gameState } from './game/state'
import { gameHistory } from './game/history'
import { roadSystem } from './game/road'
import { storyManager } from './game/story'
import { deckerBridge } from './game/decker-bridge'

class App extends Phaser.Scene {
  graphics: Phaser.GameObjects.Graphics

  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    this.load.image('x', './assets/image/x.png')
    this.graphics = this.add.graphics()
  }

  create() {
    // Initialize core systems first
    this.initializeCoreSystemsAndEventListeners();
    
    // Launch scenes
    this.scene.launch('SynthScene')
    this.scene.launch('MargeScene')
    this.scene.launch('RearviewScene')
  }

  private initializeCoreSystemsAndEventListeners(): void {
    // Initialize game state
    gameState.startGame();
    
    // Initialize story manager
    storyManager.startStory();
    
    // Set up cross-system event listeners for clean communication
    this.setupSystemEventListeners();
    
    // Initialize road system (will be activated by Marge scene)
    roadSystem.reset();
    
    // Initialize Decker bridge
    const deckerFrame = appData.deckerFrame;
    if (deckerFrame) {
      deckerBridge.connectToIframe(deckerFrame);
    }
  }

  private setupSystemEventListeners(): void {
    // Game state events
    gameState.on('game-started', () => {
      console.log('Game started');
      appData.gameStarted = true;
    });
    
    gameState.on('game-paused', () => {
      console.log('Game paused');
      appData.gameStarted = false;
    });
    
    // Story events (these can create commands)
    storyManager.on('story-node-entered', (node) => {
      console.log(`Story node entered: ${node.title}`);
      deckerBridge.syncStoryState();
    });
    
    storyManager.on('objective-completed', (objective) => {
      console.log(`Objective completed: ${objective.title}`);
      // This could create a command for major objectives
    });
    
    // Road system events (mostly informational, not command-worthy)
    roadSystem.on('major-position-change', (data) => {
      console.log(`Major position change: ${data.change.toFixed(3)}`);
      // Could create a command for significant driving events
    });
    
    // History events for debugging (much cleaner now)
    gameHistory.on('command-executed', (command) => {
      console.log(`Command executed: ${command.type}`);
    });
    
    // Decker bridge events
    deckerBridge.on('decker-connected', () => {
      console.log('Decker bridge connected');
      deckerBridge.syncGameState();
      deckerBridge.syncStoryState();
    });
    
    deckerBridge.on('decker-event', (event) => {
      console.log(`Decker event: ${event.type} on ${event.widget}`);
      // Decker events can create commands for menu navigation, story choices, etc.
    });
  }

  update() {
    this.graphics.clear()
    if (!appData.gameStarted || !appData.hasFocus) {
      this.graphics.fillStyle(colors[5], 0.66)
      this.graphics.fillRect(0, 0, appData.width, appData.height)
    }
  }
}

const scenes = {
  app: new App(),
  debug: new Debug(),
  game: new Game(),
  marge: new Marge(),
  menu: new Menu(),
  rearview: new Rearview(),
  road: new Road(),
  synth: new Synth()
}

// Export new systems for global access
export { gameState, gameHistory, roadSystem, storyManager, deckerBridge };

interface AppData {
  game: Phaser.Game,
  gameConfig: Phaser.Types.Core.GameConfig,
  width: number,
  height: number,
  scaleRatio: number,
  audioStarted: boolean,
  hasFocus: boolean,
  gameStarted: boolean,
  playing: boolean,
  lastPointerTime: number,
  pointerActive: {
    active: boolean,
    targetSprite: Phaser.GameObjects.Sprite | null
  },
  viewport: Phaser.Geom.Rectangle,
  deckerFrame: HTMLIFrameElement | null,
  hydraFrame: HTMLIFrameElement | null
}

var appData: AppData = {
  game: null,
  gameConfig: null,
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false,
  hasFocus: false,
  gameStarted: false,
  playing: false,
  lastPointerTime: 0,
  pointerActive: {
    active: false,
    targetSprite: null
  },
  viewport: new Phaser.Geom.Rectangle(0, 0, window.innerWidth, window.innerHeight),
  deckerFrame: null,
  hydraFrame: null
}

let focusTimeout: ReturnType<typeof setTimeout> | null = null

function setFocus(focused: boolean, immediate = false) {
  if (focusTimeout) clearTimeout(focusTimeout)
  
  if (focused) {
    appData.hasFocus = true
  } else if (immediate) {
    appData.hasFocus = false
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  } else {
    focusTimeout = setTimeout(() => {
      if (!document.hasFocus()) {
        appData.hasFocus = false
        appData.pointerActive.active = false
        appData.pointerActive.targetSprite = null
      }
    }, 100)
  }
}

const gameConfig: Phaser.Types.Core.GameConfig =
{
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [scenes.app, scenes.debug, scenes.game, scenes.marge, scenes.menu, scenes.road, scenes.rearview, scenes.synth],
  backgroundColor: colors[3],
  scale:
  {
    mode: Phaser.Scale.RESIZE,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min:
    {
      width: 320
    }
  },
  type: Phaser.CANVAS,
  plugins:
  {
    scene:
    [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      }
    ],
    global:
    [
      {
        key: 'rexDragRotate',
        plugin: DragRotatePlugin,
        start: true
      },
      {
        key: 'rexAnchor',
        plugin: AnchorPlugin,
        start: true,
        mapping: 'rexAnchor'
      },
      {
        key: 'rexRoundRectanglePlugin',
        plugin: RoundRectanglePlugin,
        start: true,
        mapping: 'rexRoundRectanglePlugin'
      },
      {
          key: 'rexSlider',
          plugin: SliderPlugin,
          start: true
      }
    ]
  },
  physics:
  {
    default: 'matter',
    matter:
    {
      enabled: true,
      enableSleeping: false,
      gravity:
      {
        y: 0.1
      },
      debug: true
    }
  }
};

import { GUI } from 'dat.gui'
const datGui =
{
  macro: new GUI(
  {
    name: 'macro'
  }),
  meso: new GUI(
  {
    name: 'meso'
  }),
  micro: new GUI(
  {
    name: 'micro'
  })
}
datGui.macro.domElement.id = 'macroGUI'
datGui.macro.domElement.setAttribute('style', 'opacity: 0.33')
datGui.meso.domElement.id = 'mesoGUI'
datGui.meso.domElement.setAttribute('style', 'opacity: 0.33')
datGui.micro.domElement.id = 'microGUI'
datGui.micro.domElement.setAttribute('style', 'opacity: 0.33')

import * as Tone from 'tone'
const synth = new Tone.Synth().toDestination()

const cameras =
{
  marge: null as Phaser.Cameras.Scene2D.Camera | null,
  rearview: null as Phaser.Cameras.Scene2D.Camera | null
}

const scenesReady =
{
  marge: false,
  rearview: false
}

function markSceneReady(sceneName: keyof typeof scenesReady) {
  if (scenesReady[sceneName]) return

  scenesReady[sceneName] = true

  // Set up event listeners when specific scenes are ready
  if (sceneName === 'marge') {
    setupMargeEventListeners();
  }

  if (Object.values(scenesReady).every(ready => ready)) {
    initializeCameras()
  }
}

function initializeCameras() {
  if (!appData.game) return

  Object.keys(cameras).forEach(key => {
    const cameraKey = key as keyof typeof cameras
    if (!cameras[cameraKey]) {
      let sceneName = ''
      switch (key) {
        case 'marge':
          sceneName = 'MargeScene'
          break
        case 'rearview':
          sceneName = 'RearviewScene'
          break
      }

      if (sceneName) {
        const scene = appData.game.scene.getScene(sceneName)
        if (scene) {
          const camera = scene.cameras.main
          camera.setViewport(0, 0, appData.width, appData.height)
          cameras[cameraKey] = camera
        }
      }
    } else {
      const camera = cameras[cameraKey]
      if (camera) {
        camera.setViewport(0, 0, appData.width, appData.height)
      }
    }
  })

  if (cameras.marge && cameras.rearview) {
    cameras.marge.setVisible(true)
    cameras.rearview.setVisible(false)
  }
}

function resizeCameras() {
  Object.keys(cameras).forEach(key => {
    const camera = cameras[key as keyof typeof cameras]
    if (camera) {
      camera.setViewport(0, 0, appData.width, appData.height)
    }
  })
}

function switchToMargeCamera() {
  if (cameras.marge && cameras.rearview) {
    cameras.marge.setVisible(true)
    cameras.rearview.setVisible(false)
    // Also switch Decker to marge card
    sendToDecker('switchCard', { card: 'marge' })
  }
}

function switchToRearviewCamera() {
  if (cameras.marge && cameras.rearview) {
    cameras.marge.setVisible(false)
    cameras.rearview.setVisible(true)
    // Also switch Decker to rearview card
    sendToDecker('switchCard', { card: 'rearview' })
  }
}

function handleCardChange(cardName: string) {
  // Switch camera view based on card
  if (cardName === 'marge') {
    if (cameras.marge && cameras.rearview) {
      cameras.marge.setVisible(true)
      cameras.rearview.setVisible(false)
    }
  } else if (cardName === 'rearview') {
    if (cameras.marge && cameras.rearview) {
      cameras.marge.setVisible(false)
      cameras.rearview.setVisible(true)
    }
  }
}

function handleHealthChange(healthValue: number) {
  // Update game state based on health value
  sendToDecker('healthChanged', { health: healthValue })
}

function setupKeyboardControls() {
  document.addEventListener('keydown', (event) => {
    // Only handle keyboard controls if game has started
    if (!appData.gameStarted) return
    
    if (!appData.audioStarted) appData.audioStarted = true
    
    switch (event.key) {
      case '1':
        switchToMargeCamera()
        break
      case '2':
        switchToRearviewCamera()
        break
    }
  })
}

function setupPointerTracking() {
  function initializeAudio() {
    // Audio only initializes after game starts
    if (appData.gameStarted && !appData.audioStarted) {
      appData.audioStarted = true
    }
  }

  function getSpriteUnderPointer(x: number, y: number): Phaser.GameObjects.Sprite | null {
    if (!appData.game) return null
    
    const activeScenes = appData.game.scene.getScenes(true)
    
    for (const scene of activeScenes) {
      if (!scene.cameras.main) continue
      
      const camera = scene.cameras.main
      const worldX = camera.scrollX + (x - camera.x) / camera.zoom
      const worldY = camera.scrollY + (y - camera.y) / camera.zoom
      
      let foundSprite: Phaser.GameObjects.Sprite | null = null
      
      scene.children.list.forEach((child) => {
        if (child instanceof Phaser.GameObjects.Sprite && child.visible && child.active) {
          const bounds = child.getBounds()
          if (bounds.contains(worldX, worldY)) {
            foundSprite = child
          }
        }
      })
      
      if (foundSprite) return foundSprite
    }
    
    return null
  }

  document.addEventListener('mousedown', (event) => {
    initializeAudio()
    const sprite = getSpriteUnderPointer(event.clientX, event.clientY)
    appData.pointerActive.active = true
    appData.pointerActive.targetSprite = sprite
    appData.lastPointerTime = Date.now()
    sendPointerToHydra(event.clientX, event.clientY, true)
  })
  
  document.addEventListener('mouseup', (event) => {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
    sendPointerToHydra(event.clientX, event.clientY, false)
  })
  
  document.addEventListener('mousemove', (event) => {
    appData.lastPointerTime = Date.now()
    sendPointerToHydra(event.clientX, event.clientY, appData.pointerActive.active)
  })
  
  document.addEventListener('touchstart', (event) => {
    initializeAudio()
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      const sprite = getSpriteUnderPointer(touch.clientX, touch.clientY)
      appData.pointerActive.active = true
      appData.pointerActive.targetSprite = sprite
      appData.lastPointerTime = Date.now()
      sendPointerToHydra(touch.clientX, touch.clientY, true)
    }
  })
  
  document.addEventListener('touchend', (event) => {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
    if (event.changedTouches.length > 0) {
      const touch = event.changedTouches[0]
      sendPointerToHydra(touch.clientX, touch.clientY, false)
    }
  })
  
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      appData.lastPointerTime = Date.now()
      sendPointerToHydra(touch.clientX, touch.clientY, appData.pointerActive.active)
    }
  })
  
  document.addEventListener('mouseleave', () => {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  })
}

function isPointerActive(): boolean {
  return appData.pointerActive.active
}

function getPointerTarget(): Phaser.GameObjects.Sprite | null {
  return appData.pointerActive.targetSprite
}

function isPointerOnSprite(spriteOrTexture?: Phaser.GameObjects.Sprite | string): boolean {
  if (!appData.pointerActive.active || !appData.pointerActive.targetSprite) {
    return false
  }
  
  if (!spriteOrTexture) {
    return true
  }
  
  if (typeof spriteOrTexture === 'string') {
    return appData.pointerActive.targetSprite.texture.key === spriteOrTexture
  }
  
  return appData.pointerActive.targetSprite === spriteOrTexture
}

function setupDeckerCommunication() {
  appData.deckerFrame = document.getElementById('deck-iframe') as HTMLIFrameElement
  
  window.addEventListener('message', (event) => {
    if (event.source !== appData.deckerFrame?.contentWindow) return
    
    const message = event.data
    
    if (typeof message === 'object' && message.type) {
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
          if (!appData.gameStarted) break
          
          const pointerEvent = message.event
          const canvas = document.querySelector('canvas') as HTMLCanvasElement
          if (canvas && pointerEvent) {
            const syntheticEvent = pointerEvent.type.startsWith('touch') 
              ? new TouchEvent(pointerEvent.type, { bubbles: true, cancelable: true })
              : new MouseEvent(pointerEvent.type, {
                  clientX: pointerEvent.clientX,
                  clientY: pointerEvent.clientY,
                  button: pointerEvent.button,
                  buttons: pointerEvent.buttons,
                  bubbles: true,
                  cancelable: true
                })
            
            canvas.dispatchEvent(syntheticEvent)
          }
          break
          
        case 'requestGameState':
          sendToDecker('gameState', {
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
    
    if (typeof message === 'string') {
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
        sendToDecker('gameState', {
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
        appData.gameStarted = true
        appData.audioStarted = true
        setFocus(true)
        
        // Switch to Marge card and allow clicks through to Phaser
        sendToDecker('go', { card: 'marge' })
        
        // Set Decker container to allow clicks through but keep iframe interactive
        const deckContainer = document.getElementById('deck-container')
        if (deckContainer) {
          deckContainer.style.pointerEvents = 'none'
          
          // Keep iframe interactive
          const deckIframe = document.getElementById('deck-iframe') as HTMLIFrameElement
          if (deckIframe) {
            deckIframe.style.pointerEvents = 'auto'
          }
        }
      } else if (message === 'audioInitialized') {
        appData.audioStarted = true
      }
    }
  })
  
  // Send periodic updates to Decker
  setInterval(() => {
    sendToDecker('pointerUpdate', {
      active: appData.pointerActive.active,
      targetSprite: appData.pointerActive.targetSprite?.texture.key || null
    })
  }, 100)
}

function sendToDecker(type: string, data: any) {
  if (appData.deckerFrame?.contentWindow) {
    appData.deckerFrame.contentWindow.postMessage({ type, data }, '*')
  }
}

// Hydra Integration Functions
function sendToHydra(data: any) {
  if (appData.hydraFrame?.contentWindow) {
    appData.hydraFrame.contentWindow.postMessage(data, '*');
  }
}

function sendSynthDataToHydra(data: { bpm?: number, step?: number, volume?: number, frequency?: number }) {
  sendToHydra({ type: 'hydra-synth-data', data });
}

function sendPointerToHydra(x: number, y: number, pressed: boolean) {
  sendToHydra({ 
    type: 'hydra-pointer', 
    x: x / window.innerWidth,
    y: y / window.innerHeight,
    pressed 
  });
}

function sendGameDataToHydra(data: { scene?: string, level?: number, speed?: number, intensity?: number, position?: number }) {
  sendToHydra({ type: 'hydra-game-data', data });
}

function setupHydraEffects() {
  appData.hydraFrame = document.getElementById('hydra-container') as HTMLIFrameElement;
  
  window.addEventListener('message', (event) => {
    if (event.source === appData.hydraFrame?.contentWindow && event.data.type === 'hydra-ready') {
      // Hydra is ready
    }
  });
}

// Initialize application
let game: Phaser.Game
window.addEventListener('load', () => {
  game = new Phaser.Game(gameConfig)
  window['game'] = game
  appData.game = game
  
  // Initialize debug canvas monitoring
  setTimeout(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      // Canvas found and ready
    }
  }, 1000)
  
  setupKeyboardControls()
  setupPointerTracking()
  setupDeckerCommunication()
  setupHydraEffects()
  
  setTimeout(() => {
    initVectorGraphics()
  }, 100)

  window.addEventListener('focus', () => {
    if (appData.gameStarted) setFocus(true)
  })
  window.addEventListener('blur', () => {
    if (appData.gameStarted) setFocus(false)
  })
  
  document.addEventListener('visibilitychange', () => {
    if (appData.gameStarted) setFocus(!document.hidden, true)
  })
  
  appData.hasFocus = !document.hidden && document.hasFocus()
})

window.addEventListener('resize', () => {
  appData.width = window.innerWidth
  appData.height = window.innerHeight
  appData.viewport.width = appData.width
  appData.viewport.height = appData.height
  appData.scaleRatio = window.devicePixelRatio / 3
  resizeCameras()
})

appData.width = window.innerWidth
appData.height = window.innerHeight

export {
  UIPlugin,
  AnchorPlugin,
  AppData,
  appData,
  colors,
  datGui,
  game,
  gameConfig,
  scenes,
  synth,
  cameras,
  initializeCameras,
  switchToMargeCamera,
  switchToRearviewCamera,
  markSceneReady,
  isPointerActive,
  getPointerTarget,
  isPointerOnSprite,
  sendToDecker,
  sendToHydra,
  sendSynthDataToHydra,
  sendPointerToHydra,
  sendGameDataToHydra,
  setupHydraEffects
}

// New function to set up event listeners specific to the Marge scene
function setupMargeEventListeners() {
  // Vehicle control events from Marge scene
  scenes.marge.events.on('significant-position-change', (data) => {
    console.log(`Significant driving event: position ${data.position.toFixed(3)}`);
    // This could trigger story events or game state changes
  });
  
  scenes.marge.events.on('gear-changed', (data) => {
    console.log(`Gear changed to: ${data.newValue.toFixed(2)}`);
    // Only create commands for meaningful gear changes (like first time putting in gear)
    if (data.oldValue >= 1 && data.newValue < 1) {
      console.log('Player first engaged gear - significant game event');
      // This could trigger story progression
    }
  });
}