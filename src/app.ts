//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

//imports
import 'phaser'

import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin.js'

import { GUI } from 'dat.gui'
export var gui = 
{
  macro: new GUI({name: 'macro'}),
  meso: new GUI({name: 'meso'}),
  micro: new GUI({name: 'micro'})
}

import * as Tone from 'tone'
export const synth = new Tone.Synth().toDestination()

import Command from '../src/data-types/command'
export interface GameData
{
  commandList?: Command[]
}

export var appData = 
{
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false,
  hasFocus: true,
}

export let dataManagers =
{
  game: null,
}

import Boot from './scenes/flow/boot'
import Debug from './scenes/debug'
import Game from './scenes/game'
import Marge from './scenes/game/marge'
import Menu from './scenes/game/menu'
let bootScene: Boot = new Boot()
let debugScene: Debug = new Debug()
let gameScene: Game = new Game()
let margeScene: Marge = new Marge()
let menuScene: Menu = new Menu()
export let scenes =
{
    game: gameScene,
    marge: margeScene,
    menu: menuScene,
    debug: debugScene
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

export const gameConfig: Phaser.Types.Core.GameConfig = 
{
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [bootScene, gameScene, margeScene, menuScene, debugScene],
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
      {

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

      },
      debug: true,
    }
  }
};

window.addEventListener
('resize', () => {
  let w = window.innerWidth * window.devicePixelRatio
  let h = window.innerHeight * window.devicePixelRatio
  appData.width = w
  appData.height = h
  appData.scaleRatio =  window.devicePixelRatio / 3
})

document.querySelector('body')?.addEventListener('click', async() =>
{
  //await Tone.start()
  appData.audioStarted = true
  console.log('audio ready')
})

appData.width = window.innerWidth * window.devicePixelRatio
appData.height = window.innerHeight * window.devicePixelRatio

gui.macro.domElement.id = 'macroGUI'
gui.macro.domElement.setAttribute('style', 'opacity: 0.33')
gui.meso.domElement.id = 'mesoGUI'
gui.meso.domElement.setAttribute('style', 'opacity: 0.33')
gui.micro.domElement.id = 'microGUI'
gui.micro.domElement.setAttribute('style', 'opacity: 0.33')