import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { Rearview as RearviewScene } from '../game/rearview'

export default class Marge extends Scene 
{
  constants : any
  state : any

  indicator: any
  indicatorSprite: GameObjects.Sprite

  rearviewScene: RearviewScene

  shifter: any
  shifterSprite: GameObjects.Sprite
  dash: GameObjects.Sprite
  renderSettings: any
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
    this.constants =
    {
      indicatorConfig:
      {},
      shifterConfig:
      {},
      startingGear: 0,
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
    this.shifter = 
    {
      gear: this.constants.startingGear
    }
    this.indicator =
    {
      signal: false
    }
    this.state = 
    {
      shifter: this.shifter,
      indicator: this.indicator
    }
  }
  
  create(): void 
  {
    this.scene.launch('RearviewScene')
  }
  
  update(): void 
  {
    this.placeShifter()
    this.placeIndicator()
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
      (this.shifter.gear == 0) ? 45 :
      (this.shifter.gear == 1) ? 15 :
      (this.shifter.gear == 2) ? 0 :
      (this.shifter.gear == 3) ? -15 :
      (this.shifter.gear == 4) ? -30 :
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
    this.indicatorSprite.angle = (this.indicator.signal == true) ? 33 : 0
  }
}
