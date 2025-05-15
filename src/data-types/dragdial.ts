import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import ReactiveSprite from "./reactivesprite"

export interface DragDialConfig
{
    circle: Phaser.GameObjects.Shape
    handle: Phaser.GameObjects.Shape 
    angles?: number[]
    startAngle?: number
    minAngle?: number
    maxAngle?: number
    stickiness?: number
}

export default class DragDial
{
    dragRotate: DragRotate
    config: DragDialConfig
    sprite: ReactiveSprite

    constructor(scene: any, sprite: ReactiveSprite, config: DragDialConfig)
    {
        this.dragRotate = scene.dragRotatePlugin?.add(this)
        this.config = config
        this.sprite = sprite
        
        if (config.startAngle)
        {
            sprite.setRotation(Phaser.Math.DegToRad(config.startAngle))
        }

        config.circle = scene.add.config.circle
        config.handle = scene.add.config.handle

        // this.shifter = 
        // {
        //     circle: this.add.circle(),
        //     hitbox: this.add.rectangle(),
        //     sprite: shifterSprite,
        //     dragRotate: this.dragRotatePlugin.add(this),
        // }
        // let shifter = this.shifter
        // placeReactiveSprite(shifter.sprite, scene.constants.shifter.relativeTransform)
        // shifter.dragRotate.on('drag', function(dragRotate)
        // {
        // let newRotation = shifter.circle.rotation += dragRotate.deltaRotation
        // shifter.sprite.setRotation(newRotation)
        // })
    }   

    updateTransform()
    {
        //   shifter.sprite.setOrigin(0, 1)
        //   shifter.circle.x = shifter.sprite.x
        //   shifter.circle.y = shifter.sprite.y
        //   shifter.circle.width = shifter.sprite.displayWidth
        //   shifter.dragRotate.x = shifter.circle.x
        //   shifter.dragRotate.y = shifter.circle.y
        //   shifter.dragRotate.setRadius(shifter.circle.width)
        //   shifter.hitbox.x = shifter.circle.x + shifter.circle.width
        //   shifter.hitbox.y = shifter.circle.y - (shifter.circle.height / 2)
    }

//       placeShifter(): void
//   {
//     this.shifter.hitbox.x = this.shifter.sprite.x + (this.shifter.sprite.displayWidth * 0.2)
//     this.shifter.hitbox.y = this.shifter.sprite.y - (this.shifter.sprite.displayHeight * 0.3)
//     this.shifter.hitbox.width = 100
//     this.shifter.hitbox.height = this.shifter.sprite.height * 0.1
//   }

//   drawDragRotators(): void
//   {
//     if (this.shifter.sprite == null) return
//     this.graphics.lineStyle(3, 0xffffff, 1)
//     .strokeCircle(this.shifter.circle.x, this.shifter.circle.y, this.shifter.circle.width)
//   }
}