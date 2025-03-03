import { Scene } from 'phaser';

export class Game extends Scene 
{
  State

  constructor() 
  {
    super({
      key: 'GameScene'
    });

    //local state
    let State = 
    {

    }
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
    this.process()
    this.system()
    this.feedback()
    this.debug()
  }

  control(): void
  {
    //listen for input from RoadScene
    //listen for input from MargeScene
    //listen for input from UIScene
    //listen for input from MenuScene
    
    //listen for player input
  }

  process(): void
  {
    //respond to input
  }

  system(): void
  {
    //what happens always
  }

  feedback(): void
  {
    //
  }

  debug(): void
  {
    //
  }
}