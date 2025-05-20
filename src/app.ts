//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

//imports
import 'phaser'

import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin.js'

import { GUI } from 'dat.gui'
//import * as Tone from 'tone'

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

export interface AppData
{
  width: number,
  height: number,
  scaleRatio: number,
  audioStarted: boolean,
  hasFocus: boolean
}
var _startData: AppData =
{
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false,
  hasFocus: false
}

export class Command
{
  source: any
  target: any
  change: { key: string, value: any }
  dataManager: Phaser.Data.DataManager
  original: { key: string, value: any}
  time: number
  step: number

  constructor
  (
    source: any, 
    target: any, 
    change: { key: string, value: any }, 
    dataManager = game.registry
  )
  {
    this.Set(source, target, {key: change.key, value: change.value}, dataManager)
  }

  Set(source, target, change: {key: string, value: any }, dataManager)
  {
    let data = dataManager.get(change.key)
    if (data == undefined) 
    {
      console.log('undefined data ' + change.key)
      return
    }

    this.source = source
    this.target = target
    this.change = change
    this.dataManager = dataManager
    this.original = { key: change.key, value: data }
    this.time = 0 //TODO
    this.step = scenes.game.state.step //TODO
    
    let newData = { key: change.key, value: change.value }
    dataManager.set(newData.key, newData.value)
    commandList.push(this)
    console.log("command: " + commandList[Math.min(0, commandList.length - 1)].change.key + " from " + commandList[commandList.length - 1].original.value + " to " + commandList[commandList.length - 1].change.value)
  }
}
export var commandList: Command[]
commandList = []

export let game: Phaser.Game
window.addEventListener('load', () => {
  game = new Phaser.Game(gameConfig)
  window['game'] = game

  let registry = game.registry
  registry.merge(_startData)

  let loseFocus = function()
  {
    new Command(this, this, { key: 'hasFocus', value: false })
  }

  let gainFocus = function()
  {
    new Command(this, this, { key: 'hasFocus', value: true })
  }

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
      gainFocus()
  })
  game.events.on('blur', () => 
    {
      console.log('game event: blur')
      loseFocus()
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

export var gui = 
{
  macro: new GUI({name: 'macro'}),
  meso: new GUI({name: 'meso'}),
  micro: new GUI({name: 'micro'})
}

window.addEventListener
('resize', () => {
  let w = window.innerWidth * window.devicePixelRatio
  let h = window.innerHeight * window.devicePixelRatio
  _startData.width = w
  _startData.height = h
  game = window['game']
  if (game)
  {
    gameConfig.width = w
    gameConfig.height = h
  }
  _startData.scaleRatio =  window.devicePixelRatio / 3
})

document.querySelector('body')?.addEventListener('click', async() =>
{
  //await Tone.start()
  _startData.audioStarted = true
  console.log('audio ready')
})

// export const synth = new Tone.Synth().toDestination()

_startData.width = window.innerWidth * window.devicePixelRatio
_startData.height = window.innerHeight * window.devicePixelRatio

gui.macro.domElement.id = 'macroGUI'
gui.macro.domElement.setAttribute('style', 'opacity: 0.33')
gui.meso.domElement.id = 'mesoGUI'
gui.meso.domElement.setAttribute('style', 'opacity: 0.33')
gui.micro.domElement.id = 'microGUI'
gui.micro.domElement.setAttribute('style', 'opacity: 0.33')