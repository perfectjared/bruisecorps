import { Scene } from 'phaser';
import { appState, datGui } from '../../app';
import { GUI } from 'dat.gui'

export class Game extends Scene 
{
  State : any
  gui : any

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
    let uiScene = this.scene.launch('UiScene')
    let menuScene = this.scene.launch('MenuScene')
    //let phoneScene = this.scene.launch('PhoneScene')

    //local state
    this.State = 
    {
      scale: innerWidth / (this.sys.game.config.width as number),
      started: false,
      playing: false,
      health: 86,
      money: 5, //0 - 100, .1 steps, then interpreted into a dollar amount, exponential.
      speed: 0, //0 - 100, .1 steps, interpreted into a mph amount, exponential
      gear: 0, //0 - 4, 1 steps
      distance: 100, //100 - 0, 1 steps, interpreted into a miles amount, exponential
      signal: false
    }

    this.gui = datGui.addFolder('game')
    this.gui.add(this.State, 'started' as keyof Object, false)
    this.gui.add(this.State, 'playing' as keyof Object, false)
    this.gui.add(this.State, 'health' as keyof Object, 0, 100, 1)
    this.gui.add(this.State, 'money' as keyof Object, 0, 100, .1)
    this.gui.add(this.State, 'speed' as keyof Object, 0, 100, .1)
    this.gui.add(this.State, 'gear' as keyof Object, 0, 4, 1)
    this.gui.open()
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