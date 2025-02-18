//https://phaser.discourse.group/t/game-scaling-resizing-example-v3/1555

import 'phaser';
import Boot from './scenes/flow/boot';
import Preload from './scenes/flow/preload';
import { Game as GameScene } from './scenes/flow/game';
import { Marge as MargeScene } from './scenes/game/marge';
import { Road as RoadScene } from './scenes/game/road';

const config: Phaser.Types.Core.GameConfig = {
  title: 'bruisecorps presents summer-tour: margemaster',

  scene: [Boot, Preload, GameScene, MargeScene, RoadScene],
  backgroundColor: '#facade',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'game-container',
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

window.addEventListener('load', () => {
  window['game'] = new Phaser.Game(config);
});
