import { Scene } from 'phaser';

export class Game extends Scene 
{
  constructor() 
  {
    super({
      key: 'GameScene'
    });
  }
  
  preload(): void
  {

  }

  create(): void 
  {
    this.scene.launch('RoadScene');
  }

  update(): void 
  {
    
  }

  control(): void
  {

  }

  system(): void
  {

  }

  feedback(): void
  {
    
  }

  debug(): void
  {

  }
}