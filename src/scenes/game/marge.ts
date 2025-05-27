import { GameObjects, Scene } from 'phaser';
import { scenes } from '../../app';
import DragDial from '../../data-types/dragdial';

export default class Marge extends Scene 
{
  graphics: any
  world: MatterJS.World

  buffer: any
  constants : any
  state : any

  dashSprite: GameObjects.Sprite

  signal: DragDial
  shifter: DragDial

  bandConfig: object

  constructor() 
  {
    super(
    {
      key: 'MargeScene'
    });
  }

  preload(): void 
  {
    this.graphics = this.add.graphics()

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
          minAngle: -40,
          maxAngle: 60
        },
        relativeTransformConfig: 
        {
          origin: 
          {
            x: 0,
            y: 1
          },
          x: 0.45,
          y: 0.95,
          width: 0.3,
          maxScale: 2,
          minScale: 0.1
        },
      },
      signal:
      {
        start: 0,
        dragDialConfig:
        {
          angles:
          [
            0, 50
          ],
          startAngle: 0,
          minAngle: 0,
          maxAngle: 50
        },
        relativeTransform:
        {
          origin:
          {
            x: 1,
            y: 1
          },
        x: 0.2,
        y: 0.97,
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

  }
}
