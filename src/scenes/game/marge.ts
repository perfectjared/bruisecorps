import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { scenes } from '../../app';
import { placeReactiveSprite } from '../../lib/utilities';
import DragRotate from 'phaser3-rex-plugins/plugins/dragrotate';

export default class Marge extends Scene 
{
  graphics: any
  dragRotatePlugin: any

  buffer: any
  constants : any
  state : any

  dashSprite: GameObjects.Sprite

  signal:
  {
    circle: Phaser.GameObjects.Shape
    sprite: GameObjects.Sprite | null
    dragRotate: DragRotate
  }

  shifter: 
  {
    circle: Phaser.GameObjects.Shape
    sprite: GameObjects.Sprite | null
    dragRotate: DragRotate
  }

  bandConfig: object

  constructor() 
  {
    super({
      key: 'MargeScene'
    });
  }

  preload(): void 
  {
    this.load.plugin('rexDragRotate')
    this.dragRotatePlugin = this.plugins.get('rexDragRotate')

    this.load.image('shifter', '../../../assets/image/marge/shifter.png')
    this.load.image('signal', '../../../assets/image/marge/signal.png')

    this.constants =
    {
      gearValues: { min: 0, max: 4, step: 1 , start: 0},
      signalConfig:
      {},
      shifter:
      {
        startingGear: 0,
        angles:
        [
          15, 0, -15, -30, -45, -60
        ]
      },
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

    this.signal = 
    {
      circle: this.add.circle(),
      sprite: null,
      dragRotate: this.dragRotatePlugin.add(this, {})
    }

    this.shifter = 
    {
      circle: this.add.circle(),
      sprite: null,
      dragRotate: this.dragRotatePlugin.add(this, {})
    }
    this.shifter.dragRotate.on('drag', function(dragRotate)
    {
    this.shifter.circle.rotation += dragRotate.deltaRotation
      console.log(this.shifter.circle.rotation)
    })

  }
  
  create(): void 
  {
    this.scene.launch(scenes.rearview)
    this.graphics = this.add.graphics()

    this.signal.sprite = this.add.sprite(0, 0, 'signal')
    this.shifter.sprite = this.add.sprite(0, 0, 'shifter')

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
    this.graphics.clear()
    this.angleShifter()
  }

  debug(): void
  {
    this.drawDragRotators()
  }
  
  angleShifter(): void
  {
    if (this.state.gear == this.buffer.lastGear) return
    this.shifter.sprite.angle = 
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
      this.shifter.sprite.setOrigin(0.5, 0.5)
      placeReactiveSprite
      (this.shifter.sprite,
        {
          x: 0.66,
          y: 0.85,
          width: 0.3,
          maxScale: 2,
          minScale: 0.1
        }
      )
      this.shifter.circle.x = this.shifter.sprite.x
      this.shifter.circle.y = this.shifter.sprite.y
      this.shifter.circle.width = this.shifter.sprite.width / 2
      this.shifter.dragRotate.x = this.shifter.circle.x
      this.shifter.dragRotate.y = this.shifter.circle.y
      this.shifter.dragRotate.setRadius(this.shifter.circle.width)
  }

  placeSignal(): void
  {
    this.signal.sprite.setOrigin(0.5, 0.5)
    placeReactiveSprite(this.signal.sprite,
      {
        x: 0.125,
        y: 0.85,
        width: 0.3,
        maxScale: 2,
        minScale: 0.1
      }
    )
  }

  drawDragRotators(): void
  {
    let shifterGraphics = this.graphics.lineStyle(3, 0xffffff, 1)
    .strokeCircle(this.shifter.sprite.x, this.shifter.sprite.y, this.shifter.sprite.displayWidth / 2)
    .lineBetween(this.shifter.sprite.x, this.shifter.sprite.y, this.shifter.sprite.x + (this.shifter.sprite.displayWidth / 2), this.shifter.sprite.y)
  }
}
