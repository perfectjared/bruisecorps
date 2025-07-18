// Main application entry point - now modular and organized
import 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import AnchorPlugin from 'phaser3-rex-plugins/plugins/anchor-plugin.js'
import * as Tone from 'tone'
import { GUI } from 'dat.gui'

// Scene imports
import Debug from './debug'
import Game from './game/game'
import Marge from './game/marge/marge'
import Menu from './game/menu/menu'
import Synth from './game/synth'
import Road from './game/marge/road'
import Rearview from './game/marge/rearview'

// Configuration
import { AppData, createInitialAppData, setGlobalAppData } from './config/app-config'
import { createGameConfig } from './config/game-config'

// Core game systems
import { gameState } from './game/state'
import { gameHistory } from './game/history'
import { storyManager } from './game/story'
import { deckerBridge } from './game/decker-bridge'

// Modular systems
import { 
  markSceneReady, 
  initializeCameras, 
  resizeCameras,
  switchToMargeCamera, 
  switchToRearviewCamera,
  handleCardChange,
  cameras,
  setAppData
} from './systems/camera-manager'
import { 
  setupPointerTracking, 
  isPointerActive, 
  getPointerTarget, 
  isPointerOnSprite 
} from './systems/pointer-tracker'
import { setupDeckerCommunication, sendToDecker } from './systems/decker-communication'
import { 
  setupHydraEffects, 
  sendToHydra, 
  sendSynthDataToHydra, 
  sendPointerToHydra, 
  sendGameDataToHydra 
} from './systems/hydra-integration'
import { setFocus, setupWindowEventListeners } from './systems/focus-manager'
import { setupKeyboardControls } from './systems/keyboard-controls'

// Utilities
import { initVectorGraphics } from './lib/vector-graphics'
import colors from './data/colors'

// Global application data and synth
let appData: AppData
const synth = new Tone.Synth().toDestination()

// Initialize dat.gui debugging panels
const datGui = {
  macro: new GUI({ name: 'macro' }),
  meso: new GUI({ name: 'meso' }),
  micro: new GUI({ name: 'micro' })
}
datGui.macro.domElement.id = 'macroGUI'
datGui.macro.domElement.setAttribute('style', 'opacity: 0.33')
datGui.meso.domElement.id = 'mesoGUI'
datGui.meso.domElement.setAttribute('style', 'opacity: 0.33')
datGui.micro.domElement.id = 'microGUI'
datGui.micro.domElement.setAttribute('style', 'opacity: 0.33')

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
    this.initializeCoreSystemsAndEventListeners()
    
    // Launch scenes
    this.scene.launch('SynthScene')
    this.scene.launch('MargeScene')
    this.scene.launch('RearviewScene')
  }

  private initializeCoreSystemsAndEventListeners(): void {
    gameState.startGame()
    storyManager.startStory()
    this.setupSystemEventListeners()
    
    const deckerFrame = appData.deckerFrame
    if (deckerFrame) {
      deckerBridge.connectToIframe(deckerFrame)
    }
  }

  private setupSystemEventListeners(): void {
    // Game state events
    gameState.on('game-started', () => {
      console.log('Game started')
      appData.gameStarted = true
    })
    
    gameState.on('game-paused', () => {
      console.log('Game paused')
      appData.gameStarted = false
    })
    
    // Story events
    storyManager.on('story-node-entered', (node) => {
      console.log(`Story node entered: ${node.title}`)
      deckerBridge.syncStoryState()
    })
    
    storyManager.on('objective-completed', (objective) => {
      console.log(`Objective completed: ${objective.title}`)
    })
    
    // History events for debugging
    gameHistory.on('command-executed', (command) => {
      console.log(`Command executed: ${command.type}`)
    })
    
    // Decker bridge events
    deckerBridge.on('decker-connected', () => {
      console.log('Decker bridge connected')
      deckerBridge.syncGameState()
      deckerBridge.syncStoryState()
    })
    
    deckerBridge.on('decker-event', (event) => {
      console.log(`Decker event: ${event.type} on ${event.widget}`)
    })
  }

  update() {
    this.graphics.clear()
    if (!appData.gameStarted || !appData.hasFocus) {
      this.graphics.fillStyle(colors[5], 0.66)
      this.graphics.fillRect(0, 0, appData.width, appData.height)
    }
  }
}

// Scene collection
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

// Health change handler
function handleHealthChange(healthValue: number): void {
  sendToDecker(appData, 'healthChanged', { health: healthValue })
}

// Event listeners specific to the Marge scene
function setupMargeEventListeners(): void {
  // Vehicle control events from Marge scene
  scenes.marge.events.on('significant-position-change', (data) => {
    console.log(`Significant driving event: position ${data.position.toFixed(3)}`)
    // This could trigger story events or game state changes
  })
  
  scenes.marge.events.on('gear-changed', (data) => {
    console.log(`Gear changed to: ${data.newValue.toFixed(2)}`)
    // Only create commands for meaningful gear changes (like first time putting in gear)
    if (data.oldValue >= 1 && data.newValue < 1) {
      console.log('Player first engaged gear - significant game event')
      // This could trigger story progression
    }
  })
}

// Initialize application
let game: Phaser.Game

window.addEventListener('load', () => {
  // Initialize app data
  appData = createInitialAppData()
  setGlobalAppData(appData)
  
  // Create game configuration
  const gameConfig = createGameConfig(scenes)
  appData.gameConfig = gameConfig
    // Create and start Phaser game
  game = new Phaser.Game(gameConfig)
  window['game'] = game
  appData.game = game
  
  // Initialize camera system with appData
  setAppData(appData)
  
  // Set up all systems with proper dependencies
  const wrappedSwitchToMarge = () => switchToMargeCamera(() => sendToDecker(appData, 'switchCard', { card: 'marge' }))
  const wrappedSwitchToRearview = () => switchToRearviewCamera(() => sendToDecker(appData, 'switchCard', { card: 'rearview' }))
  const wrappedSetFocus = (focused: boolean, immediate = false) => setFocus(appData, focused, immediate)
  const wrappedResizeCameras = () => resizeCameras(appData)
  
  // Initialize all systems
  setupKeyboardControls(appData, wrappedSwitchToMarge, wrappedSwitchToRearview)
  setupPointerTracking(appData, (x, y, pressed) => sendPointerToHydra(appData, x, y, pressed))
  setupDeckerCommunication(
    appData, 
    synth, 
    wrappedSwitchToMarge, 
    wrappedSwitchToRearview,
    handleHealthChange,
    wrappedSetFocus
  )  
  setupHydraEffects(appData)
  setupWindowEventListeners(appData, wrappedResizeCameras)
  
  // Initialize debug canvas monitoring
  setTimeout(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      console.log('Canvas found and ready')
    }
  }, 1000)
  
  // Initialize vector graphics
  setTimeout(() => {
    initVectorGraphics()
  }, 100)
})

// Export core systems and data for other modules
export {
  UIPlugin,
  AnchorPlugin,
  AppData,
  appData,
  colors,
  datGui,
  game,
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
  setupHydraEffects,
  handleCardChange,
  setupMargeEventListeners,
  gameState,
  gameHistory,
  storyManager,
  deckerBridge
}
