//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555
import 'phaser'

import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin.js'

import { GUI } from 'dat.gui'
var datGui = 
{
  macro: new GUI({name: 'macro'}),
  meso: new GUI({name: 'meso'}),
  micro: new GUI({name: 'micro'})
}

import * as Tone from 'tone'
const synth = new Tone.Synth().toDestination()

var appData = 
{
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false, //TODO: SET BY SYNTH.TS
  hasFocus: true,
}

var dataManagers =
{
  game: null,
}

import Boot from './scenes/flow/boot'
import Debug from './scenes/debug'
import Game from './scenes/game'

import Marge from './scenes/game/marge'
import Menu from './scenes/game/menu'
import Synth from './scenes/game/synth'
let scenes =
{
  boot: new Boot(),
  debug: new Debug(),
  game: new Game(),
  marge: new Marge(),
  menu: new Menu(),
  synth: new Synth()
}

var game: Phaser.Game
window.addEventListener('load', () => {
  game = new Phaser.Game(gameConfig)
  window['game'] = game
  dataManagers.game = game.registry
  dataManagers.game.merge([])

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

const gameConfig: Phaser.Types.Core.GameConfig = 
{
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [scenes.boot, scenes.debug, scenes.game, scenes.marge, scenes.menu, scenes.synth],
  backgroundColor: '#facade',
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  type: Phaser.CANVAS,
  plugins:
  {
    global: 
    [
      {
        key: 'rexDragRotate',
        plugin: DragRotatePlugin,
        start: true
      },
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

      },
      debug: true,
    }
  }
};

import Command from '../src/data-types/command'
var commandList = new Array<Command>

export
{
  appData,
  commandList,
  dataManagers,
  datGui,
  game,
  gameConfig,
  scenes,
  synth,
}

window.addEventListener
('resize', () => {
  let w = window.innerWidth * window.devicePixelRatio
  let h = window.innerHeight * window.devicePixelRatio
  appData.width = w
  appData.height = h
  appData.scaleRatio =  window.devicePixelRatio / 3
})
appData.width = window.innerWidth * window.devicePixelRatio
appData.height = window.innerHeight * window.devicePixelRatio

datGui.macro.domElement.id = 'macroGUI'
datGui.macro.domElement.setAttribute('style', 'opacity: 0.33')
datGui.meso.domElement.id = 'mesoGUI'
datGui.meso.domElement.setAttribute('style', 'opacity: 0.33')
datGui.micro.domElement.id = 'microGUI'
datGui.micro.domElement.setAttribute('style', 'opacity: 0.33')