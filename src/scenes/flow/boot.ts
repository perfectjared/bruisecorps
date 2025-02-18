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
    this.load.image("bg", '/assets/background.png');
    this.load.image("car", './assets/carSingle.png');
    this.load.image("logo", './assets/logo.png');
    this.load.image("billboard", './assets/billboard.png');
    this.scene.start('PreloadScene');
  }
}
