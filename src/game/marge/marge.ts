import { Scene } from 'phaser';
import { scenes, cameras, markSceneReady, sendGameDataToHydra } from '../../app';
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
  wheel: DragDial
  ignition: DragDial
  signal: DragSlider
  shifter: DragSlider
  rearviewSprite: DynamicSprite

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
        y: '75%',
        width: '100%',
        height: '40%'
      }
    )

    this.wheel = new DragDial(this, new DynamicSprite(this,
      {
        x: '50%',
        y: '70%',
        width: '50%',
        height: '40%'
      }
    ),
    {
      startAngle: 3,
      return: true
    })

    this.signal = new DragSlider(this, new DynamicSprite(this,
      {
        x: '10%',
        y: '65%',
        width: '20%',
        height: '20%'
      }),
      [0, 1]
    )
    this.shifter = new DragSlider(this, new DynamicSprite
      (this,
      {
        x: '90%',
        y: '65%',
        width: '20%',
        height: '20%'
      }),
      [0, .3, .4, .6, .8, 1],
      0.4
    )

    this.rearviewSprite = new DynamicSprite(this,
      {
          x: '50%',
          y: '5%',
          width: '85%',
          height: '27%'
      }
    )

    this.constants =
    {
      gearValues: { min: 0, max: 4, step: 1 , start: 0 },
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
        }
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
      signal : false,
      position: 0.5
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
    this.dashSprite.create()
    this.wheel.create()
    this.signal.dSprite.create()
    this.shifter.dSprite.create()
    this.rearviewSprite.create()

    markSceneReady('marge')
  }

  update(): void
  {
    if (scenes.synth?.state?.step !== undefined) {
      const nextStep = (scenes.synth.state.step != this.state.step)
      if (nextStep)
      {
        this.step()
      }
    }

    this.control()
    this.process()
    this.system()
    this.feedback()
    this.debug()
  }

  control(): void
  {
    const wheelRotation = this.wheel.sprite.rotation;
    const steeringInput = wheelRotation / Math.PI;
    
    this.state.position += steeringInput * 0.01;
    
    this.state.position = Math.max(0, Math.min(1, this.state.position));
  }

  step(): void
  {
    this.state.step = scenes.synth.state.step
  }

  process(): void
  {

  }

  system(): void
  {

  }

  feedback(): void
  {
    this.graphics.clear();
  }

  debug(): void
  {

  }
}