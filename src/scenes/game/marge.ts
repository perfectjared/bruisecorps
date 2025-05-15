import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { scenes } from '../../app';
import ReactiveSprite from '../../data-types/reactivesprite';
import DragDial from '../../data-types/dragdial';

export default class Marge extends Scene 
{
  graphics: any
  dragRotatePlugin: any

  buffer: any
  constants : any
  state : any

  dashSprite: GameObjects.Sprite

  signal: ReactiveSprite
  shifter: DragDial

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
    this.graphics = this.add.graphics()

    this.load.image('shifter', '../../../assets/image/marge/shifter.png')
    this.load.image('signal', '../../../assets/image/marge/signal.png')

    this.constants =
    {
      gearValues: { min: 0, max: 4, step: 1 , start: 0},
      shifter:
      {
        dragDialConfig:
        {
          angles:
          [
            15, 0, -15, -30, -45, -60
          ],
          startAngle: 15,
        },
        handle:
        {
          x: .6,
          y: 0.4,
          radius: 0.5,
        },
        relativeTransform: 
        {
          origin: 
          {
            x: 0,
            y: 1
          },
          x: 0.6,
          y: 0.82,
          width: 0.3,
          maxScale: 2,
          minScale: 0.1
        },

      },
      signal:
      {
        start: 0,
        angles:
        [
          0, 60
        ],
        relativeTransform:
        {
          origin:
          {
            x: 1,
            y: 1
          },
        x: 0.2,
        y: 0.85,
        width: 0.3,
        maxScale: 1,
        minScale: 0.1
        }
      }
    }

    this.state = 
    {
      step: 0,
      gear: this.constants.gearValues.start,
      signal : false
    }

    this.buffer = 
    {
      dragging: false,
      lastGear: null,
      lastSignal: null
    }
  }
  
  create(): void 
  {
    this.scene.launch(scenes.rearview)
    this.shifter = new DragDial(this, new ReactiveSprite(this, 'shifter', this.constants.shifter.relativeTransform), this.constants.shifter.dragDialConfig, this.constants.shifter.handle)
    //this.signal = new ReactiveSprite(this, 'signal', this.constants.signal.relativeTransform)
  }
  
  update(): void 
  {
    let nextStep = (scenes.game.state.step != this.state.step)
    if (nextStep)
    {
      this.step()
      this.state.step = scenes.game.state.step
    }

    this.control()
    this.process()
    this.system()
    this.feedback()
    this.debug()
  }

  control(): void
  {

  }
  
  step(): void
  {
    
  }

  process(): void
  {
    // this.shifter.updateTransform()
  }
  
  system(): void
  {

  }

  feedback(): void
  {
    this.graphics.clear()
  }

  debug(): void
  {
    // this.drawDragRotators()
  }

  // placeSignal(): void
  // {
  //   this.signal.sprite.setOrigin(1, 1)
  //   placeReactiveSprite
  //   (this.signal.sprite,
  //     {
  //       x: 0.2,
  //       y: 0.915,
  //       width: 0.3,
  //       maxScale: 1,
  //       minScale: 0.1
  //     }
  //   )
  // }
}
