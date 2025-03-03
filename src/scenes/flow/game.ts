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
    let roadScene = this.scene.launch('RoadScene')
    let margeScene = this.scene.launch('MargeScene')
    let uiScene = this.scene.launch('UIScene')
    let menuScene = this.scene.launch('MenuScene')
  }

  update(): void 
  {
    this.control()
    this.system()
    this.feedback()
    this.debug()
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