import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import ReactiveSprite from "./reactivesprite"
import { Scene } from "phaser"
import { scenes } from "../app"

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

    constructor(scene: Scene, sprite: ReactiveSprite, config: DragDialConfig)
    {
        let graphics = scene.add.graphics()
        let plugin = scene.plugins.get('rexDragRotate')
        
        this.config = config
        this.sprite = sprite
        
        this.dragRotatePlugin = plugin
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
            console.log(scenes.input.buffer.objectsTouching)
            if (!scenes.input.buffer.objectsTouching[scene.scene.key]?.includes(this))
            {
                return
            }
            let newRotation = Math.max
            (Math.min(sprite.rotation + dragRotate.deltaRotation, 
                Phaser.Math.DegToRad(this.config.maxAngle)), 
                Phaser.Math.DegToRad(this.config.minAngle))
            sprite.rotation = newRotation
        }, this)

        if (config.startAngle)
        {
            sprite.setRotation(Phaser.Math.DegToRad(config.startAngle))
        }
        
        scene.events.on('update', function()
        {
            this.placeRelative()
        }, this)

        scene.events.on('render', function()
        {
            graphics.clear()
        }, this)

        sprite.setInteractive()
    }   

    placeRelative()
    {
        this.dragRotate.x = this.sprite.x
        this.dragRotate.y = this.sprite.y
        this.dragRotate.maxRadius = this.sprite.displayWidth
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