//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555
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

import colors from './data/colors'

class App extends Phaser.Scene
{
  graphics: Phaser.GameObjects.Graphics

  constructor()
  {
    super(
    {
      key: 'BootScene'
    })
  }

  preload()
  {
    this.load.image('x', './assets/image/x.png')
    this.graphics = this.add.graphics()
  }

  create()
  {
    this.scene.launch('SynthScene')
    this.scene.launch('MargeScene')
    this.scene.launch('RearviewScene')
  }

  update()
  {
    this.graphics.clear()
    if (!appData.audioStarted || !appData.hasFocus)
    {
      this.graphics.fillStyle(colors[5], 0.66)
      this.graphics.fillRect(0, 0, appData.width, appData.height)
    }
  }

  render()
  {

  }
}

const scenes =
{
  app: new App(),
  debug: new Debug(),
  game: new Game(),
  marge: new Marge(),
  menu: new Menu(),
  rearview: new Rearview(),
  road: new Road(),
  synth: new Synth()
}

interface AppData
{
  game: Phaser.Game,
  gameConfig: Phaser.Types.Core.GameConfig,
  width: number,
  height: number,
  scaleRatio: number,
  audioStarted: boolean,
  hasFocus: boolean,
  playing: boolean,
  pointerActive: {
    active: boolean,
    targetSprite: Phaser.GameObjects.Sprite | null
  },
  viewport: Phaser.Geom.Rectangle
}

var appData: AppData =
{
  game: null,
  gameConfig: null,
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false, //TODO: SET BY SYNTH.TS
  hasFocus: true,
  playing: false,
  pointerActive: {
    active: false,
    targetSprite: null
  },
  viewport: new Phaser.Geom.Rectangle(0, 0, window.innerWidth, window.innerHeight)
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

function markSceneReady(sceneName: keyof typeof scenesReady)
{
  if (scenesReady[sceneName]) return

  scenesReady[sceneName] = true

  if (Object.values(scenesReady).every(ready => ready))
  {
    console.log('scenes ready, initializing cameras')
    initializeCameras()
  }
}

function initializeCameras()
{
  if (!appData.game) return

  Object.keys(cameras).forEach(key =>
  {
    if (!cameras[key as keyof typeof cameras])
    {
      let sceneName = ''
      switch (key)
      {
        case 'marge':
          sceneName = 'MargeScene'
          break
        case 'rearview':
          sceneName = 'RearviewScene'
          break
      }

      if (sceneName)
      {
        const scene = appData.game.scene.getScene(sceneName)
        if (scene)
        {
          const camera = scene.cameras.main
          camera.setViewport(0, 0, appData.width, appData.height)
          cameras[key as keyof typeof cameras] = camera
        }
      }
    }
    else
    {
      const camera = cameras[key as keyof typeof cameras]
      if (camera && camera instanceof Phaser.Cameras.Scene2D.Camera)
      {
        camera.setViewport(0, 0, appData.width, appData.height)
      }
    }
  })

  if (cameras.marge && cameras.rearview)
  {
    cameras.marge.setVisible(true)
    cameras.rearview.setVisible(false)
  }
}

function resizeCameras()
{
  Object.keys(cameras).forEach(key =>
  {
    const camera = cameras[key as keyof typeof cameras]
    if (camera && camera instanceof Phaser.Cameras.Scene2D.Camera)
    {
      camera.setViewport(0, 0, appData.width, appData.height)
    }
  })
}

function switchToMargeCamera()
{
 if (cameras.marge && cameras.rearview)
 {
    cameras.marge.setVisible(true)
    cameras.rearview.setVisible(false)
  }
}

function switchToRearviewCamera()
{
  if (cameras.marge && cameras.rearview)
  {
    cameras.marge.setVisible(false)
    cameras.rearview.setVisible(true)
  }
}

function setupKeyboardControls()
{
  document.addEventListener('keydown', (event) =>
  {
    console.log('key:', event.key)
    switch (event.key)
    {
      case '1':
        switchToMargeCamera()
        break
      case '2':
        switchToRearviewCamera()
        break
    }
  })
}

function setupPointerTracking()
{
  function getSpriteUnderPointer(x: number, y: number): Phaser.GameObjects.Sprite | null
  {
    if (!appData.game) return null
    
    const activeScenes = appData.game.scene.getScenes(true)
    
    for (const scene of activeScenes)
    {
      if (!scene.cameras.main) continue
      
      const camera = scene.cameras.main
      const worldX = camera.scrollX + (x - camera.x) / camera.zoom
      const worldY = camera.scrollY + (y - camera.y) / camera.zoom
      
      let foundSprite: Phaser.GameObjects.Sprite | null = null
      
      scene.children.list.forEach((child) =>
      {
        if (child instanceof Phaser.GameObjects.Sprite && child.visible && child.active)
        {
          const bounds = child.getBounds()
          if (bounds.contains(worldX, worldY))
          {
            foundSprite = child
          }
        }
      })
      
      if (foundSprite) return foundSprite
    }
    
    return null
  }

  document.addEventListener('mousedown', (event) =>
  {
    appData.hasFocus = true
    
    const sprite = getSpriteUnderPointer(event.clientX, event.clientY)
    appData.pointerActive.active = true
    appData.pointerActive.targetSprite = sprite
    console.log('pointer active: mouse down', sprite ? `on sprite: ${sprite.texture.key}` : 'on background')
  })
  
  document.addEventListener('mouseup', () =>
  {
    if (!appData.hasFocus) return
    
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
    console.log('pointer inactive: mouse up')
  })
  
  document.addEventListener('touchstart', (event) =>
  {
    appData.hasFocus = true
    
    if (event.touches.length > 0)
    {
      const touch = event.touches[0]
      const sprite = getSpriteUnderPointer(touch.clientX, touch.clientY)
      appData.pointerActive.active = true
      appData.pointerActive.targetSprite = sprite
      console.log('Pointer active: touch start', sprite ? `on sprite: ${sprite.texture.key}` : 'on background')
    }
  })
  
  document.addEventListener('touchend', () =>
  {
    if (!appData.hasFocus) return
    
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  })
  
  document.addEventListener('touchcancel', () =>
  {
    if (!appData.hasFocus) return
    
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  })
  
  document.addEventListener('mouseleave', () =>
  {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  })
}

function isPointerActive(): boolean
{
  return appData.pointerActive.active
}

function getPointerTarget(): Phaser.GameObjects.Sprite | null
{
  return appData.pointerActive.targetSprite
}

function isPointerOnSprite(spriteOrTexture?: Phaser.GameObjects.Sprite | string): boolean
{
  if (!appData.pointerActive.active || !appData.pointerActive.targetSprite)
  {
    return false
  }
  
  if (!spriteOrTexture)
  {
    return true
  }
  
  if (typeof spriteOrTexture === 'string')
  {
    return appData.pointerActive.targetSprite.texture.key === spriteOrTexture
  }
  
  return appData.pointerActive.targetSprite === spriteOrTexture
}

let game: Phaser.Game
window.addEventListener('load', () =>
{
  game = new Phaser.Game(gameConfig)
  window['game'] = game
  appData.game = game
  setupKeyboardControls()
  setupPointerTracking()

  game.events.on('pause', () =>
  {
    console.log('game event: pause')
  })
  game.events.on('resume', () =>
  {
    console.log('game event: resume')
  })
  game.events.on('focus', () =>
  {
    console.log('game event: focus')
    appData.hasFocus = true
  })
  game.events.on('blur', () =>
  {
    console.log('game event: blur')
    appData.hasFocus = false
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  })
}, this);

window.addEventListener('resize', () =>
{
  appData.width = window.innerWidth
  appData.viewport.width = appData.width
  appData.height = window.innerHeight
  appData.viewport.height = appData.height
  appData.scaleRatio =  window.devicePixelRatio / 3
  resizeCameras()
})
appData.width = window.innerWidth
appData.height = window.innerHeight

export
{
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
  isPointerOnSprite
}