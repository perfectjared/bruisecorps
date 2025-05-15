import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import ReactiveSprite from "./reactivesprite"
import { Scene } from "phaser"

export interface DragDialConfig
{
    angles?: number[]
    startAngle?: number
    minAngle?: number
    maxAngle?: number
    stickiness?: number
}

export default class DragDial
{
    config: DragDialConfig

    graphics: Phaser.GameObjects.Graphics
    dragRotatePlugin: any
    dragRotate: DragRotate

    buffer: 
    {
        lastDimensions:
        {
            x: number,
            y: number,
            width: number
        }
    }
    constants: any
    state: any
    
    sprite: ReactiveSprite
    arc: Phaser.GameObjects.Arc
    handle: Phaser.Geom.Circle

    constructor(scene: Scene, sprite: ReactiveSprite, config: DragDialConfig, handle?: { x: number, y: number, radius: number})
    {
        let graphics = scene.add.graphics()
        let plugin = scene.plugins.get('rexDragRotate')
        this.dragRotatePlugin = plugin
        this.dragRotate = this.dragRotatePlugin.add(scene, 
            {
                x: sprite.x,
                y: sprite.y,
                maxRadius: sprite.width / 2,
            }
        )
        this.dragRotate.on('drag', function(dragRotate)
        {
           let newRotation = sprite.rotation += dragRotate.deltaRotation
           sprite.setRotation(newRotation)
        })

        
        this.sprite = sprite
        this.config = config
        if (config.startAngle)
        {
            sprite.setRotation(Phaser.Math.DegToRad(config.startAngle))
        }

        if (handle)
        {
            this.handle = new Phaser.Geom.Circle(this.sprite.x + ((this.sprite.displayWidth / 2) * (handle.x - 0.5)), this.sprite.y + ((this.sprite.displayHeight / 2) * (handle.y - 0.5)), handle.radius * (this.sprite.displayWidth / 2))
        } 
        else
        {
            this.handle = new Phaser.Geom.Circle(this.sprite.x, this.sprite.y, this.sprite.displayWidth / 2)
        }

        scene.events.on('update', function()
        {
        })

        scene.events.on('render', function()
        {
            graphics.clear()
            //graphics.lineStyle(3, 0xffffff).strokeCircle(handle.x, handle.y, handle.radius)
        })
    }   

    placeRelative()
    {
        // this.circle.x = this.dragRotate.x = this.sprite.x
        // this.circle.y = this.dragRotate.y = this.handle.y = this.sprite.y
        // this.circle.width = this.sprite.displayWidth
        // this.dragRotate.setRadius(this.circle.width / 2)

        // //handle
        // this.handle.x = this.sprite.displayWidth * this.handle.x
        //   this.hitbox.x = shifter.circle.x + shifter.circle.width
        //   shifter.hitbox.y = shifter.circle.y - (shifter.circle.height / 2)
    }

    placeHandle()
    {

    }

    drawHandle()
    {

    }

    drawDragRotate()
    {

    }

    preload()
    {

    }

    create()
    {
    }

    update()
    {

    }
}