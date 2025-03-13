import { Scene } from 'phaser';
import { GameObjects } from 'phaser';

export class Marge extends Scene 
{
  indicator: GameObjects.Sprite
  rearview: GameObjects.Sprite
  shifter: GameObjects.Sprite
  renderSettings: any

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
    this.load.image('indicator', '../../../assets/image/marge/shifter.png')
  }
  
  create(): void 
  {
    this.renderSettings =
    {
      width: this.sys.game.config.width,
      height: this.sys.game.config.height,
      resolution: null //(computed)
    }

    this.rearview = this.add.sprite(0, 0, 'rearview')
    this.shifter = this.add.sprite(0, 0, 'shifter')
    this.placeRearview()
    this.placeShifter()
  }

  update(): void 
  {

  }

  //TODO trigger on window resize
  placeRearview(): void
  {
    this.rearview.setOrigin(0.5, 0.5)
    this.rearview.setScale(0.85, 0.85)
    this.rearview.setPosition(this.renderSettings.width / 2, this.renderSettings.height * 0.08);
  }

  placeShifter(): void
  {
    this.shifter.setOrigin(1, 1)
    this.shifter.setScale(0.66, 0.66)
    this.shifter.setPosition(this.renderSettings.width * 0.9, this.renderSettings.height * .99, 0)
  }
}
