import { Scene } from 'phaser';
import { appState } from '../../app';

export default class Game extends Scene 
{
  state : any

  constructor() 
  {
    super({
      key: 'GameScene'
    });
  }
  
  preload(): void
  {
    this.state = 
    {
      scale: innerWidth / (this.sys.game.config.width as number),
      started: false,
      playing: false,
      step: 0,

      //not being used yet really
      health: 86,
      money: 5, //0 - 100, .1 steps, then interpreted into a dollar amount, exponential.
      speed: 0, //0 - 100, .1 steps, interpreted into a mph amount, exponential
      gear: 0, //0 - 4, 1 steps
      distance: 100, //100 - 0, 1 steps, interpreted into a miles amount, exponential
      signal: false
    }
  }

  create(): void 
  {
    let roadScene = this.scene.launch('RoadScene')
    let margeScene = this.scene.launch('MargeScene')
    let uiScene = this.scene.launch('UIScene')
    let debugScene = this.scene.launch('DebugScene')
    //let menuScene = this.scene.launch('MenuScene')
    //let phoneScene = this.scene.launch('PhoneScene')
  }

  startGame(): void
  {
    console.log("game start")
    this.state.started = true
    this.state.playing = true
    this.startRoad()
  }

  startRoad(): void
  {

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
    if (!this.state.started) return
    if (!this.state.playing) return
  }

  system(): void
  {
    this.state.scale = innerWidth / (this.sys.game.config.width as number)
  }

  feedback(): void
  {
  }

  debug(): void
  {
  }
}