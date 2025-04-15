import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import Rearview from '../game/rearview'
import { gameScene } from '../../app';

export default class Marge extends Scene 
{
  buffer: any
  constants : any
  state : any
  renderSettings: any

  bandConfig: object

  indicator: any
  indicatorSprite: GameObjects.Sprite

  rearview: any
  rearviewScene: Rearview

  shifter: any
  shifterSprite: GameObjects.Sprite

  dash: GameObjects.Sprite

  constructor() 
  {
    super({
      key: 'MargeScene'
    });
  }

  //load and manage things having to do with this object only
  preload(): void 
  {
    this.constants =
    {
      gearValues: { min: 0, max: 4, step: 1 , start: 0},
      indicatorConfig:
      {},
      shifterConfig:
      {},
      startingGear: 0,
      bleedValues: [.11, .33, .66, .99],
    }
    
    this.load.image('shifter', '../../../assets/image/marge/shifter.png')
    this.load.image('indicator', '../../../assets/image/marge/indicator.png')

    this.shifterSprite = this.add.sprite(0, 0, 'shifter')
    this.indicatorSprite = this.add.sprite(0, 0, 'indicator')

    this.renderSettings =
    {
      width: this.sys.game.config.width,
      height: this.sys.game.config.height
    }

    this.state = 
    {
      step: 0,
      shifter: { gear: this.constants.gearValues.start },
      indicator : { signal: false }
    }

    this.buffer = 
    {

    }
  }
  
  create(): void 
  {
    this.scene.launch('RearviewScene')
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
    //listen for input from GameScene
    let nextStep = (gameScene.state.step != this.state.step)
    if (nextStep)
    {
      this.step()
      this.state.step = gameScene.state.step
    }

    //listen for input from MenuScene
  }
  
  step(): void
  {
    this.bleedHealth()
  }

  bleedHealth(): number //do this AT game.state
  {
    let bleedAmount = this.constants.bleedValues
      [Math.ceil(Math.random() * this.state.shifter.gear )]
    this.state.health -= bleedAmount
    console.log(bleedAmount)
    return bleedAmount
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
    this.placeIndicator()
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
      (this.state.shifter.gear == 0) ? 45 :
      (this.state.shifter.gear == 1) ? 15 :
      (this.state.shifter.gear == 2) ? 0 :
      (this.state.shifter.gear == 3) ? -15 :
      (this.state.shifter.gear == 4) ? -30 :
      0
    )
  }

  placeIndicator(): void
  {
    this.indicatorSprite.setOrigin(.9, .9)
    this.indicatorSprite.setScale(0.25, 0.25)
    this.indicatorSprite.setPosition
    (
      this.renderSettings.width * .28,
      this.renderSettings.height * .95
    )
    this.indicatorSprite.angle = (this.state.indicator.signal == true) ? 33 : 0
  }
}
