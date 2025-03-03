import { Scene } from 'phaser';
import { GameObjects } from 'phaser';

export class Marge extends Scene 
{
  rearview: GameObjects.Sprite

  constructor() 
  {
    super({
      key: 'MargeScene'
    });
  }

  preload(): void
  {
    this.load.image('rearview', '../../../assets/image/marge/rearview.png')
  }
  
  create(): void 
  {
    this.rearview = this.add.sprite(0, 0, 'rearview')
  }

  update(): void 
  {

  }

  placeRearview()
  {
    
  }
}
