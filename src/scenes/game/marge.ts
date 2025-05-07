import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { scenes } from '../../app';
import { placeReactiveSprite } from '../../lib/utilities';

export default class Marge extends Scene 
{
  buffer: any
  constants : any
  state : any

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

    this.state = 
    {
      step: 0,
      gear: this.constants.gearValues.start,
      signal : false
    }

    this.buffer = 
    {
      lastGear: null
    }
  }
  
  create(): void 
  {
    this.scene.launch(scenes.rearview)
    this.shifterSprite = this.add.sprite(0, 0, 'shifter')
    this.signalSprite = this.add.sprite(0, 0, 'signal')
    this.placeShifter()
    this.placeSignal()
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
    let nextStep = (scenes.game.state.step != this.state.step)
    if (nextStep)
    {
      this.step()
      this.state.step = scenes.game.state.step
    }
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
    this.angleShifter()
  }

  debug(): void
  {

  }
  
  angleShifter(): void
  {
    if (this.state.gear == this.buffer.lastGear) return
    this.shifterSprite.angle = 
    (
      (this.state.gear == 0) ? 15 :
      (this.state.gear == 1) ? 0 :
      (this.state.gear == 2) ? -15 :
      (this.state.gear == 3) ? -30 :
      (this.state.gear == 4) ? -45 :
      0
    )
    this.buffer.lastGear = this.state.gear
  }

  placeShifter(): void
  {
      this.shifterSprite.setOrigin(0.5, 0.5)
      placeReactiveSprite(this.shifterSprite,
        {
          x: 0.66,
          y: 0.85,
          width: 0.3,
          maxScale: 2,
          minScale: 0.1
        }
      )

  }

  placeSignal(): void
  {
    this.signalSprite.setOrigin(0.5, 0.5)
    placeReactiveSprite(this.signalSprite,
      {
        x: 0.125,
        y: 0.85,
        width: 0.3,
        maxScale: 2,
        minScale: 0.1
      }
    )
  }
}
