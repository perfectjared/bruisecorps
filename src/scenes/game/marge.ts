import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { GUI } from 'dat.gui'

export class Marge extends Scene 
{
  indicator: any
  indicatorSprite: GameObjects.Sprite
  rearview: GameObjects.Sprite
  shifter: any
  shifterSprite: GameObjects.Sprite
  dash: GameObjects.Sprite
  renderSettings: any

  gui: GUI

  constructor() 
  {
    super({
      key: 'MargeScene'
    });
  }

  preload(): void
  {
    this.load.image('rearview', '../../../assets/image/marge/rearview.png')
    this.load.image('shifter', '../../../assets/image/marge/shifter.png')
    this.load.image('indicator', '../../../assets/image/marge/indicator.png')
  }
  
  create(): void 
  {
    const margeGui = new GUI({name: 'marge'})

    this.renderSettings =
    {
      width: this.sys.game.config.width,
      height: this.sys.game.config.height,
      resolution: null //(computed)
    }

    this.rearview = this.add.sprite(0, 0, 'rearview')
    this.placeRearview()

    this.shifter = 
    {
      gear: 2
    }
    this.shifterSprite = this.add.sprite(0, 0, 'shifter')
    const shifterFolder = margeGui.addFolder('shifter')
    shifterFolder.add(this.shifter, 'gear' as keyof Object, 1, 3, 1)

    this.indicator =
    {
      signal: false
    }
    this.indicatorSprite = this.add.sprite(0, 0, 'indicator')
    const indicatorFolder = margeGui.addFolder('indicator')
    indicatorFolder.add(this.indicator, 'signal', false)
  }
  
  update(): void 
  {
    this.placeShifter()
    this.placeRearview()
    this.placeIndicator()
  }

  //TODO trigger on window resize
  placeRearview(): void
  {
    this.rearview.setOrigin(0.5, 0.5)
    this.rearview.setScale(0.85, 0.85)
    this.rearview.setPosition(
      this.renderSettings.width / 2, 
      this.renderSettings.height * 0.08);
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
      (this.shifter.gear == 1) ? 30 :
      (this.shifter.gear == 2) ? 0 :
      (this.shifter.gear == 3) ? -30 :
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
