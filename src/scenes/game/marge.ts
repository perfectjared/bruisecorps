import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import Rearview from '../game/marge/rearview'
import { scenes } from '../../app';

export default class Marge extends Scene 
{
  buffer: any
  constants : any
  state : any
  renderSettings: any

  dashSprite: GameObjects.Sprite

  signal: any
  signalSprite: GameObjects.Sprite

  shifter: any
  shifterSprite: GameObjects.Sprite

  bandConfig: object

  constructor() 
  {
    super({
      key: 'MargeScene'
    });
  }

  //load and manage things having to do with this object only
  preload(): void 
  {
    this.load.image('shifter', '../../../assets/image/marge/shifter.png')
    this.load.image('signal', '../../../assets/image/marge/signal.png')

    this.constants =
    {
      gearValues: { min: 0, max: 4, step: 1 , start: 0},
      indicatorConfig:
      {},
      shifterConfig:
      {},
      startingGear: 0,
    }

    this.renderSettings =
    {
      width: this.sys.game.config.width,
      height: this.sys.game.config.height
    }

    this.state = 
    {
      step: 0,
      gear: this.constants.gearValues.start,
      signal : false
    }

    this.buffer = 
    {

    }
  }
  
  create(): void 
  {
    this.scene.launch(scenes.rearview)
    this.shifterSprite = this.add.sprite(0, 0, 'shifter')
    this.signalSprite = this.add.sprite(0, 0, 'signal')
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
    //listen for input from scenes.game
    let nextStep = (scenes.game.state.step != this.state.step)
    if (nextStep)
    {
      this.step()
      this.state.step = scenes.game.state.step
    }

    //listen for input from MenuScene
  }
  
  step(): void
  {
    
  }

  process(): void
  {

  }
  
  system(): void
  {

  }

  feedback(): void
  {
    this.placeShifter()
    this.placeSignal()
  }

  debug(): void
  {

  }

  placeShifter(): void
  {
      this.shifterSprite.setOrigin(.1 , .9)
      this.shifterSprite.setScale(0.4, 0.4)
      this.shifterSprite.setPosition
      (
      this.renderSettings.width * .5, 
      this.renderSettings.height * .925
      )
      this.shifterSprite.angle = 
      (
      (this.state.gear == 0) ? 30 :
      (this.state.gear == 1) ? 15 :
      (this.state.gear == 2) ? 0 :
      (this.state.gear == 3) ? -15 :
      (this.state.gear == 4) ? -30 :
      0
      )
  }

  placeSignal(): void
  {
      this.signalSprite.setOrigin(.9, .9)
      this.signalSprite.setScale(0.25, 0.25)
      this.signalSprite.setPosition
      (
        this.renderSettings.width * .28,
        this.renderSettings.height * .95
      )
      this.signalSprite.angle = (this.state.signal == true) ? 33 : 0
  }
}
