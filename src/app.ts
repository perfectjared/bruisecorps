//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser';
import Boot from './scenes/boot';
import Preload from './scenes/preload';
import { Game as GameScene } from './scenes/game';
import { Marge as MargeScene } from "./scenes/game/marge";

const config: Phaser.Types.Core.GameConfig = {
  title: 'bruisecorps presents summer-tour: margemaster',

  scene: [Boot, Preload, GameScene, MargeScene],
  backgroundColor: '#333',
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
});
