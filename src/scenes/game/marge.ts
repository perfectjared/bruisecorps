import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import Rearview from '../game/marge/rearview'
import { scenes } from '../../app';
import { appState } from '../../app';
import { placeSprite } from '../../lib/utilities';

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
      let height: number = appState.height as number
      let width: number = appState.width as number

      let minScale: number = 0.1
      let maxScale: number = 0.45
      let minX: number = width / 6
      let maxX: number = width / 2
      let minY: number = height
      let maxY: number = height

      this.shifterSprite.setOrigin(1, 0.5)

      placeSprite(this.shifterSprite, minScale, maxScale, minX, maxX, minY, maxY)

      this.shifterSprite.angle = 
      (
        (this.state.gear == 0) ? 15 :
        (this.state.gear == 1) ? 0 :
        (this.state.gear == 2) ? -15 :
        (this.state.gear == 3) ? -30 :
        (this.state.gear == 4) ? -45 :
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
