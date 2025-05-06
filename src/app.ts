//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser'
import { GUI } from 'dat.gui'
import Boot from './scenes/flow/boot'
import Preload from './scenes/flow/preload'
import Game from './scenes/flow/game'
import Marge from './scenes/game/marge'
import Phone from './scenes/game/marge/phone'
import Rearview from './scenes/game/marge/rearview'
import Road from './scenes/game/road'
import Tour from './scenes/game/tour'
import UI from './scenes/game/ui'
import Debug from './scenes/debug'

export var appState =
{
  width: 0,
  height: 0
}

export var routing =
{
  assets: "../assets",
}

export var microGUI = new GUI({ name: 'micro' })
microGUI.domElement.setAttribute("style", "opacity: 0.33")
microGUI.domElement.id = 'microGUI'

let uiScene: UI = new UI()
let debugScene: Debug = new Debug()
let bootScene: Boot = new Boot()
let preloadScene: Preload = new Preload()
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
    ui: uiScene,
    debug: debugScene
}

const config: Phaser.Types.Core.GameConfig = {
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [bootScene, preloadScene, scenes.game, roadScene, margeScene, phoneScene, rearviewScene, tourScene, uiScene, debugScene],
  backgroundColor: '#facade',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH, //TODO Phaser.Scale.RESIZE
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
  appState.width = window.innerWidth
});

//three debug GUIs for three levels of the game
export var macroGUI = new GUI({ name: 'macro' })
  macroGUI.domElement.id = 'macroGUI'
  macroGUI.domElement.setAttribute("style", "opacity: 0.33")

export var mesoGUI = new GUI({ name: 'meso' })
  mesoGUI.domElement.setAttribute("style", "opacity: 0.33")
  mesoGUI.domElement.id = 'mesoGUI'

window.addEventListener
('resize', () => {
  appState.width = window.innerWidth
  appState.height = window.innerHeight
})
