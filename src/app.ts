//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser'
import { GUI } from 'dat.gui'

import Boot from './scenes/flow/boot'
import Preload from './scenes/flow/preload'
import Game from './scenes/flow/game'
import Marge from './scenes/game/marge'
import Phone from './scenes/game/phone'
import Road from './scenes/game/road'
import Tour from './scenes/game/tour'
import UI from './scenes/game/ui'
import Debug from './scenes/debug'

export var appState =
{
  width: 0,
  height: 0
}

export var datGui = new GUI({ name: 'debug' })

let bootScene: Boot = new Boot()
let preloadScene: Preload = new Preload()
export let gameScene: Game = new Game()
export let roadScene: Road = new Road()
export let margeScene: Marge = new Marge()
export let phoneScene: Phone = new Phone()
export let tourScene: Tour = new Tour()
export let uiScene: UI = new UI()
export let debugScene: Debug = new Debug()

const config: Phaser.Types.Core.GameConfig = {
  title: 'bruisecorps presents summer-tour: margemaster',

  scene: [bootScene, preloadScene, gameScene, roadScene, margeScene, phoneScene, uiScene, debugScene],
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

window.addEventListener
('resize', () => {
  appState.width = window.innerWidth
  appState.height = window.innerHeight
})
