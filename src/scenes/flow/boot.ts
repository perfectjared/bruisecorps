import { Scene } from 'phaser';

export default class Boot extends Scene {
  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload(): void {
    //
  }

  create(): void {
    //this.scene.start('PreloadScene')
    this.scene.launch('GameScene')
    this.scene.start('MenuScene')
  }
}
