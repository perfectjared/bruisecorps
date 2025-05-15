//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser'
import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin.js'

import { GUI } from 'dat.gui'
import Boot from './scenes/flow/boot'
import Preload from './scenes/flow/preload'
import Game from './scenes/game'
import Marge from './scenes/game/marge'
import InputScene from './scenes/input'
import Phone from './scenes/game/marge/phone'
import Rearview from './scenes/game/marge/rearview'
import Road from './scenes/game/road'
import Tour from './scenes/game/tour'
import Menu from './scenes/game/menu'
import Debug from './scenes/debug'

export var appState =
{
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3
}

export var routing =
{
  assets: "../assets",
}

export var microGUI = new GUI({ name: 'micro' })
microGUI.domElement.setAttribute("style", "opacity: 0.33")
microGUI.domElement.id = 'microGUI'

let menuScene: Menu = new Menu()
let debugScene: Debug = new Debug()
let bootScene: Boot = new Boot()
let preloadScene: Preload = new Preload()
let inputScene: InputScene = new InputScene()
let gameScene: Game = new Game()
  let roadScene: Road = new Road()
  let tourScene: Tour = new Tour()
  let margeScene: Marge = new Marge()
    let rearviewScene: Rearview = new Rearview()
    let phoneScene: Phone = new Phone()
export let scenes =
{
    game: gameScene,
    road: roadScene,
    marge: margeScene,
    phone: phoneScene,
    rearview: rearviewScene,
    tour: tourScene,
    menu: menuScene,
    debug: debugScene,
    input: inputScene
}

const config: Phaser.Types.Core.GameConfig = {
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [bootScene, preloadScene, gameScene, roadScene, margeScene, phoneScene, rearviewScene, tourScene, menuScene, debugScene, inputScene],
  backgroundColor: '#facade',
  scale: {
    mode: Phaser.Scale.RESIZE, //TODO Phaser.Scale.RESIZE
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
      }
    ]
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
});

//three debug GUIs for three levels of the game
export var macroGUI = new GUI({ name: 'macro' })
  macroGUI.domElement.id = 'macroGUI'
  macroGUI.domElement.setAttribute("style", "opacity: 0.33")

export var mesoGUI = new GUI({ name: 'meso' })
  mesoGUI.domElement.setAttribute("style", "opacity: 0.33")
  mesoGUI.domElement.id = 'mesoGUI'

appState.width = window.innerWidth * window.devicePixelRatio
appState.height = window.innerHeight * window.devicePixelRatio
window.addEventListener
('resize', () => {
  let w = window.innerWidth * window.devicePixelRatio
  let h = window.innerHeight * window.devicePixelRatio
  appState.width = w
  appState.height = h
  if (window['game'])
  {
    window['game'].config.width = w
    window['game'].config.height = h
  }
  appState.scaleRatio =  window.devicePixelRatio / 3
})
