import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import RelativeTransform from "./relativetransform"
import { Scene } from "phaser"

export interface DragDialConfig
{
    angles: number[]
    startAngle: number
    minAngle: number
    maxAngle: number
    stickiness?: number
}

export default class DragDial
{
    config: DragDialConfig

    graphics: Phaser.GameObjects.Graphics
    dragRotatePlugin: any
    dragRotate: DragRotate
    dragging: boolean

    debugArc: Phaser.GameObjects.Arc

    buffer: 
    {
        lastDimensions:
        {
            x: number,
            y: number,
            width: number
        },
        last
    }
    constants: any
    state: any
    
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Scene, sprite: Phaser.GameObjects.Sprite, config: DragDialConfig)
    {
        this.graphics = scene.add.graphics()
        
        this.config = config
        this.sprite = sprite
        
        this.dragRotatePlugin = scene.plugins.get('rexDragRotate')
        this.dragRotate = this.dragRotatePlugin.add(scene, 
            {
                x: sprite.x,
                y: sprite.y,
                maxRadius: sprite.width,
                origin:
                {
                    x: sprite.originX,
                    y: sprite.originY
                }
            }
        )

        this.dragRotate.on('drag', function(dragRotate)
        {
            // console.log(scenes.input.buffer.objectsPointing)
            // if (!scenes.input.buffer.objectsPointing[scene.scene.key]?.includes(this))
            // {
            //     return
            // }
            let newRotation = Math.max
            (Math.min(sprite.rotation + dragRotate.deltaRotation, 
                Phaser.Math.DegToRad(this.config.maxAngle)), 
                Phaser.Math.DegToRad(this.config.minAngle))
            //this.snap(newRotation)
            sprite.rotation = newRotation
        }, this)

        if (config.startAngle)
        {
            sprite.setRotation(Phaser.Math.DegToRad(config.startAngle))
        }

        this.debugArc = new Phaser.GameObjects.Arc(scene, this.dragRotate.x, this.dragRotate.y, this.dragRotate.maxRadius)
        if (config.minAngle && config.maxAngle)
        {
            this.debugArc.setStartAngle(Phaser.Math.DegToRad(config.minAngle))
            this.debugArc.setEndAngle(Phaser.Math.DegToRad(config.maxAngle))
        }
        
        scene.events.on('update', function()
        {
            this.placeRelative()
        }, this)

        scene.events.on('render', function()
        {
            this.graphics.clear()
        }, this)

        sprite.setInteractive()
    }   

    placeRelative()
    {
        this.dragRotate.x = this.sprite.x
        this.dragRotate.y = this.sprite.y
        this.dragRotate.maxRadius = this.sprite.displayWidth
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