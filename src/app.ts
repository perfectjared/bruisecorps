//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser'
import { GUI } from 'dat.gui'

import Boot from './scenes/flow/boot'
import Preload from './scenes/flow/preload'

import { Game as GameScene } from './scenes/flow/game'
import { Marge as MargeScene } from './scenes/game/marge'
import { Phone as PhoneScene } from './scenes/game/phone'
import { Rearview as RearviewScene } from './scenes/game/rearview'
import { Road as RoadScene } from './scenes/game/road'
import { UI as UIScene } from './scenes/game/ui'
import { Debug as DebugScene} from './scenes/debug'

let bootScene: Boot = new Boot()
let preloadScene: Preload = new Preload()
export let gameScene: GameScene = new GameScene()
export let roadScene: RoadScene = new RoadScene()
export let margeScene: MargeScene = new MargeScene()
export let phoneScene: PhoneScene = new PhoneScene()
export let rearviewScene: RearviewScene = new RearviewScene()
export let uiScene: UIScene = new UIScene()
export let debugScene: DebugScene = new DebugScene()
export var datGui = new GUI({ name: 'debug' })

export var appState =
{
  width: window.innerWidth,
  height: window.innerHeight
}

const config: Phaser.Types.Core.GameConfig = {
  title: 'bruisecorps presents summer-tour: margemaster',

  scene: [bootScene, preloadScene, gameScene, roadScene, margeScene, phoneScene, rearviewScene, uiScene, debugScene],
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
