//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555
import 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin'
import ViewportCoordinatePlugin from 'phaser3-rex-plugins/plugins/viewportcoordinate-plugin'

import Debug from './scenes/debug'
import Game from './scenes/game'
import Marge from './scenes/game/marge'
import Menu from './scenes/game/menu'
import Synth from './scenes/game/synth'

import colors from './data/colors'

class App extends Phaser.Scene
{
  graphics: Phaser.GameObjects.Graphics

  constructor()
  {
    super({
      key: 'BootScene'
    })
  }

  preload()
  {
    this.load.image('x', '../../../assets/prototype/x.png')
    this.graphics = this.add.graphics()
  }

  create()
  {
    this.scene.launch('GameScene')
    this.scene.launch('MenuScene')
    this.scene.launch('SynthScene')
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

let scenes =
{
  app: new App(),
  debug: new Debug(),
  game: new Game(),
  marge: new Marge(),
  menu: new Menu(),
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
  hasFocus: boolean
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
}

const gameConfig: Phaser.Types.Core.GameConfig = 
{
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [scenes.app, scenes.debug, scenes.game, scenes.marge, scenes.menu, scenes.synth],
  backgroundColor: '#facade',
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  type: Phaser.CANVAS,
  plugins:
  {
    scene: 
    [{
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
    }],
    global: 
    [
      {
        key: 'dragRotate',
        plugin: DragRotatePlugin,
        start: true,
        mapping: 'dragRotate'
      },
      {
        key: 'rexViewportCoordinate',
        plugin: ViewportCoordinatePlugin,
        start: true,
        mapping: 'rexViewportCoordinate'
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
        y: 0.1,
      },
      debug: true,
    }
  }
};

var game: Phaser.Game
window.addEventListener('load', () => {
  game = new Phaser.Game(gameConfig)
  window['game'] = game

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
  })
}, this);

import { GUI } from 'dat.gui'
var datGui = 
{
  macro: new GUI({name: 'macro'}),
  meso: new GUI({name: 'meso'}),
  micro: new GUI({name: 'micro'})
}
datGui.macro.domElement.id = 'macroGUI'
datGui.macro.domElement.setAttribute('style', 'opacity: 0.33')
datGui.meso.domElement.id = 'mesoGUI'
datGui.meso.domElement.setAttribute('style', 'opacity: 0.33')
datGui.micro.domElement.id = 'microGUI'
datGui.micro.domElement.setAttribute('style', 'opacity: 0.33')

import * as Tone from 'tone'
const synth = new Tone.Synth().toDestination()

export
{
  AppData,
  appData,
  colors,
  datGui,
  game,
  gameConfig,
  scenes,
  synth,
}

window.addEventListener
('resize', () => {
  appData.width = window.innerWidth
  appData.height = window.innerHeight
  appData.scaleRatio =  window.devicePixelRatio / 3
})
appData.width = window.innerWidth
appData.height = window.innerHeight