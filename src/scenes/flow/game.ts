import { Scene } from 'phaser';
import { appState } from '../../app';
import { Tuple } from '../../data-types'

export default class Game extends Scene 
{
  state : any
  
  road: Scene
  marge: Scene
  phone: Scene

  relationships: Tuple<Scene, Scene>[]

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
    this.road = this.scene.launch('RoadScene').scene
    this.marge = this.scene.launch('MargeScene').scene
    this.phone = this.scene.launch('PhoneScene').scene
    
    this.scene.launch('DebugScene')
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