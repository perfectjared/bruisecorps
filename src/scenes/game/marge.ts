import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { scenes } from '../../app';
import { placeReactiveSprite } from '../../lib/utilities';
import DragRotate from 'phaser3-rex-plugins/plugins/dragrotate';

export interface RotateSwitch
{
  circle: Phaser.GameObjects.Shape
  hitbox: Phaser.GameObjects.Shape 
  sprite: GameObjects.Sprite
  dragRotate: DragRotate
  updateTransform: Function
}

function UpdateRotateSwitchTransform(rotateSwitch: RotateSwitch)
{
  rotateSwitch.circle.x = rotateSwitch.sprite.x
  rotateSwitch.circle.y = rotateSwitch.sprite.y
  rotateSwitch.circle.width = rotateSwitch.sprite.displayWidth
}

export default class Marge extends Scene 
{
  graphics: any
  dragRotatePlugin: any

  buffer: any
  constants : any
  state : any

  dashSprite: GameObjects.Sprite

  signal: RotateSwitch
  shifter: RotateSwitch

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
        startingGear: 0,
        angles:
        [
          15, 0, -15, -30, -45, -60
        ],
        relativeTransform: {
          x: 0.5,
          y: 0.95,
          width: 0.3,
          maxScale: 2,
          minScale: 0.1
        },

      },
      signal:
      {

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
      lastGear: null,
      lastSignal: null
    }
  }
  
  create(): void 
  {
    let scene = this
    this.scene.launch(scenes.rearview)
    this.graphics = this.add.graphics()

    //this.signal.sprite = this.add.sprite(0, 0, 'signal')
    let shifterSprite = this.add.sprite(0, 0, 'shifter')
    this.shifter = 
    {
      circle: this.add.circle(),
      hitbox: this.add.rectangle(),
      sprite: shifterSprite,
      dragRotate: this.dragRotatePlugin.add(this),
      updateTransform: function() {}
    }
    let shifter = this.shifter
    placeReactiveSprite(shifter.sprite, scene.constants.shifter.relativeTransform)

    shifter.dragRotate.on('drag', function(dragRotate)
    {
      let newRotation = shifter.circle.rotation += dragRotate.deltaRotation
      shifter.sprite.setRotation(newRotation)
    })
    shifter.updateTransform = function()
    {
      shifter.sprite.setOrigin(0, 1)
      shifter.circle.x = shifter.sprite.x
      shifter.circle.y = shifter.sprite.y
      shifter.circle.width = shifter.sprite.displayWidth * 0.8
      shifter.dragRotate.x = shifter.circle.x
      shifter.dragRotate.y = shifter.circle.y
      shifter.dragRotate.setRadius(shifter.circle.width)
      shifter.hitbox.x = shifter.circle.x + shifter.circle.width
      shifter.hitbox.y = shifter.circle.y - (shifter.circle.height / 2)
    }
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
    this.shifter.updateTransform()
  }
  
  system(): void
  {

  }

  feedback(): void
  {
    this.graphics.clear()
    //this.angleShifter()
  }

  debug(): void
  {
    
    this.drawDragRotators()
  }
  
  angleShifter(): void
  {
    if (this.state.gear == this.buffer.lastGear) return
    if (this.shifter.sprite == null) return

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

   
    
    // this.shifter.hitbox.x = this.shifter.sprite.x + (this.shifter.sprite.displayWidth * 0.2)
    // this.shifter.hitbox.y = this.shifter.sprite.y - (this.shifter.sprite.displayHeight * 0.3)
    // this.shifter.hitbox.width = 100
    // this.shifter.hitbox.height = this.shifter.sprite.height * 0.1
  }

  placeSignal(): void
  {
    if (this.signal.sprite == null) return
    if (this.shifter.dragRotate == null) return

    this.signal.sprite.setOrigin(1, 1)
    placeReactiveSprite
    (this.signal.sprite,
      {
        x: 0.2,
        y: 0.915,
        width: 0.3,
        maxScale: 1,
        minScale: 0.1
      }
    )
  }

  drawDragRotators(): void
  {
    if (this.shifter.sprite == null) return
    this.graphics.lineStyle(3, 0xffffff, 1)
    .strokeCircle(this.shifter.circle.x, this.shifter.circle.y, this.shifter.circle.width)
  }
}
