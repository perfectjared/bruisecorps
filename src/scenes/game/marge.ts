import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { scenes } from '../../app';
import ReactiveSprite from '../../data-types/reactivesprite';
import DragRotate from 'phaser3-rex-plugins/plugins/dragrotate';
import { DragDialConfig } from '../../data-types/dragdial';
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
  shifter: ReactiveSprite

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
      shifter:
      {
        start: 0,
        angles:
        [
          15, 0, -15, -30, -45, -60
        ],
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
          x: 0.1,
          y: 0.85,
          width: 0.3,
          maxScale: 2,
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
    this.graphics = this.add.graphics()
    this.shifter = new ReactiveSprite(this, 'shifter', this.constants.shifter.relativeTransform)
    this.signal = new ReactiveSprite(this, 'signal', this.constants.signal.relativeTransform)
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
