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
  airCon: DragDial
  signal: DragSlider
  shifter: DragSlider
  rearviewSprite: DynamicSprite
  
  // Debug UI elements
  debugText: Phaser.GameObjects.Text | null

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

    this.rearviewSprite = new DynamicSprite(this,
      {
          x: '50%',
          y: '10%',
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
      position: 0.5  // Road position: 0=left, 0.5=center, 1=right
    }

    this.buffer =
    {
      dragging: false,
      lastGear: null,
      lastSignal: null
    }
    
    this.debugText = null;
  }

  create(): void
  {
    // Create all the DynamicSprites and controls
    this.dashSprite.create()
    this.wheel.create()
    this.ignition.create()
    this.airCon.create()
    this.signal.dSprite.create()  // DragSlider doesn't have create(), but its DynamicSprite does
    this.shifter.dSprite.create() // DragSlider doesn't have create(), but its DynamicSprite does
    this.rearviewSprite.create()
    
    // Create debug text once
    this.debugText = this.add.text(20, 20, '', {
      fontSize: '20px',
      color: '#ffffff'
    }).setDepth(1000);
    
    // Signal that this scene is ready
    markSceneReady('marge')
  }

  update(): void
  {
    if (scenes.synth?.state?.step !== undefined) {
      const nextStep = (scenes.synth.state.step != this.state.step)
      if (nextStep)
      {
        this.step()
        this.state.step = scenes.synth.state.step
        
        const speed = Math.abs(this.wheel.sprite.rotation) / Math.PI
        const intensity = (this.ignition.sprite.rotation + this.airCon.sprite.rotation) / (Math.PI * 2)
        
        sendGameDataToHydra({
          scene: 'marge',
          level: Math.floor(this.state.step / 64) + 1,
          speed: speed,
          intensity: intensity,
          position: this.state.position
        })
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
    // Update road position based on steering wheel rotation
    const wheelRotation = this.wheel.sprite.rotation;
    const steeringInput = wheelRotation / Math.PI; // Normalize to -1 to 1
    
    // Accumulate position changes (scaled down for smooth movement)
    this.state.position += steeringInput * 0.01;
    
    // Clamp position to road bounds (0-1)
    this.state.position = Math.max(0, Math.min(1, this.state.position));
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
    // Show position indicator on screen
    const positionX = this.state.position * (this.scale.width - 40) + 20;
    this.graphics.fillStyle(0x00ff88);
    this.graphics.fillCircle(positionX, 50, 8);
    
    // Update debug text (reuse existing text object)
    if (this.debugText) {
      this.debugText.setText(`Position: ${this.state.position.toFixed(3)}`);
    }
  }
}
