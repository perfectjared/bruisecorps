import { Scene } from 'phaser';
import { scenes } from '../../app';
import DynamicSprite from '../../data-types/dynamicsprite';
import DragDial from '../../data-types/dragdial'
import DragSlider from '../../data-types/dragslider'

export default class Marge extends Scene 
{
  graphics: any
  world: MatterJS.World

  buffer: any
  constants : any
  state : any

  dashSprite: DynamicSprite
  rearviewSprite: DynamicSprite
  wheel: DragDial
  ignition: DragDial
  airCon: DragDial
  signal: DragSlider
  shifter: DragSlider

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

    this.dashSprite = new DynamicSprite(this,
      {
        x: '50%',
        y: '80%',
        width: '100%',
        height: '40%'
      }
    )
    this.rearviewSprite = new DynamicSprite(this,
      {
        x: '50%',
        y: '10%',
        width: '85%',
        height: '27%'
      }
    )

    this.wheel = new DragDial(this, new DynamicSprite(this, 
      {
        x: '50%',
        y: '75%',
        width: '50%',
        height: '40%'
      }
    ),
    {
      startAngle: 3,
      return: true
    })
    this.ignition = new DragDial(this, new DynamicSprite(this,
      {
        x: '85%',
        y: '90%',
        width: '15%',
        height: '15%'
      }
    ),
    {
      startAngle: 0,
      return: true
    })
    this.airCon = new DragDial(this, new DynamicSprite(this,
      {
        x: '15%',
        y: '90%',
        width: '15%',
        height: '15%'
      }
    ))

    this.signal = new DragSlider(this, new DynamicSprite(this,
      {
        x: '10%',
        y: '70%',
        width: '20%',
        height: '20%'
      }),
      [0, 1]
    )
    this.shifter = new DragSlider(this, new DynamicSprite
      (this,
      {
        x: '90%',
        y: '70%',
        width: '20%',
        height: '20%'
      }),
      [0, .3, .4, .6, .8, 1],
      0.4
    )

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
    let nextStep = (scenes.synth.state.step != this.state.step)
    if (nextStep)
    {
      this.step()
      this.state.step = scenes.synth.state.step
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
