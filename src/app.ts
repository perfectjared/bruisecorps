//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser'
import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin.js'

import { GUI } from 'dat.gui'
import * as NovelJS from 'novel-js'
import * as AnimeJS from 'animejs'
import * as HydraSynth from 'hydra-synth'


import * as Tone from 'tone'
export const synth = new Tone.Synth().toDestination()

import Boot from './scenes/flow/boot'
//import Preload from './scenes/flow/preload'
import Game from './scenes/game'
  import Marge from './scenes/game/marge'
    //import Rearview from './scenes/game/marge/rearview'
  import Novel from './scenes/game/novel'
  import Synth from './scenes/game/synth'
  //import Phone from './scenes/game/marge/phone'
  //import Road from './scenes/game/road'
//import Tour from './scenes/game/tour'
import Menu from './scenes/game/menu'
import Debug from './scenes/debug'

export var appState =
{
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false
}

export var microGUI = new GUI({ name: 'micro' })
microGUI.domElement.setAttribute('style', 'opacity: 0.33')
microGUI.domElement.id = 'microGUI'

let menuScene: Menu = new Menu()
let debugScene: Debug = new Debug()
let bootScene: Boot = new Boot()
//let preloadScene: Preload = new Preload()
let gameScene: Game = new Game()
  // let tourScene: Tour = new Tour()
  let margeScene: Marge = new Marge()
  let synthScene: Synth = new Synth()
  //   let roadScene: Road = new Road()
  //   let rearviewScene: Rearview = new Rearview()
  let novelScene: Novel = new Novel()
  //   let phoneScene: Phone = new Phone()
export let scenes =
{
    game: gameScene,
    // road: roadScene,
    marge: margeScene,
    // phone: phoneScene,
    // rearview: rearviewScene,
    // tour: tourScene,
    menu: menuScene,
    debug: debugScene
}

const config: Phaser.Types.Core.GameConfig = 
{
  title: 'bruisecorps presents summer-tour: margemaster',
  scene: [bootScene, /*preloadScene,*/ gameScene, /*roadScene,*/ margeScene, novelScene, synthScene, /*phoneScene, rearviewScene, tourScene,*/ menuScene, debugScene],
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
      setBounds:
      {

      },
      debug: 
      {
        
      },
    }
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
});

//three debug GUIs for three levels of the game
export var macroGUI = new GUI({ name: 'macro' })
  macroGUI.domElement.id = 'macroGUI'
  macroGUI.domElement.setAttribute('style', 'opacity: 0.33')

export var mesoGUI = new GUI({ name: 'meso' })
  mesoGUI.domElement.setAttribute('style', 'opacity: 0.33')
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

document.querySelector('body')?.addEventListener('click', async() =>
{
  await Tone.start()
  appState.audioStarted = true
  console.log('audio ready')
})