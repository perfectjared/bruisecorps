import { Scene } from 'phaser';
import { appState } from '../../app';

export class Game extends Scene 
{
  State

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
    let phoneScene = this.scene.launch('PhoneScene')

    //local state
    this.State = 
    {
      scale: innerWidth / (this.sys.game.config.width as number)
    }
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
    //update State
    this.State.scale = innerWidth / (this.sys.game.config.width as number)
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