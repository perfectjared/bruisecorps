// Phaser game configuration
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import DragRotatePlugin from 'phaser3-rex-plugins/plugins/dragrotate-plugin.js'
import AnchorPlugin from 'phaser3-rex-plugins/plugins/anchor-plugin.js'
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js'
import SliderPlugin from 'phaser3-rex-plugins/plugins/slider-plugin.js'

import Debug from '../debug'
import Game from '../game/game'
import Marge from '../game/marge/marge'
import Menu from '../game/menu/menu'
import Synth from '../game/synth'
import Road from '../game/marge/road'
import Rearview from '../game/marge/rearview'

// Main scenes collection
export const scenes = {
  app: null, // Will be set in app.ts to avoid circular dependency
  debug: new Debug(),
  game: new Game(),
  marge: new Marge(),
  menu: new Menu(),
  rearview: new Rearview(),
  road: new Road(),
  synth: new Synth()
}

// Phaser game configuration
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: [scenes.app, scenes.debug, scenes.game, scenes.marge, scenes.menu, scenes.rearview, scenes.road, scenes.synth],
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      },
      {
        key: 'rexDragRotate',
        plugin: DragRotatePlugin,
        start: true,
        mapping: 'rexDragRotate'
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
  physics: {
    default: 'matter',
    matter: {
      enabled: true,
      enableSleeping: false,
      gravity: {
        y: 0.1
      },
      debug: true
    }
  }
}

// Factory function to create game configuration with scenes
export function createGameConfig(sceneCollection: any): Phaser.Types.Core.GameConfig {
  return {
    title: 'bruisecorps presents summer-tour: margemaster',
    parent: 'game-container', // Ensure Phaser canvas goes into the correct container
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    scene: [
      sceneCollection.app, 
      sceneCollection.debug, 
      sceneCollection.game, 
      sceneCollection.marge, 
      sceneCollection.menu, 
      sceneCollection.rearview, 
      sceneCollection.road, 
      sceneCollection.synth
    ],
    backgroundColor: '#1a1a1a',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      min: {
        width: 320
      }
    },
    plugins: {
      scene: [
        {
          key: 'rexUI',
          plugin: UIPlugin,
          mapping: 'rexUI'
        }
      ],
      global: [
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
    physics: {
      default: 'matter',
      matter: {
        enabled: true,
        enableSleeping: false,
        gravity: {
          y: 0.1
        },
        debug: true
      }
    }
  }
}
