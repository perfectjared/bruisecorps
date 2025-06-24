import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import { Scene } from "phaser"
import DynamicSprite from "./dynamicsprite"
import { scenes } from "../app"


export interface IDragDialConfig
{
    snaps?: number[]
    startAngle?: number
    minAngle?: number
    maxAngle?: number
    return?: boolean
    cw?: boolean
    ccw?: boolean
}

export default class DragDial
{
    config: IDragDialConfig
    
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
    
    dragRotatePlugin: any
    dragRotate: DragRotate
    dragging: boolean

    scene: Scene
    graphics: Phaser.GameObjects.Graphics


    dSprite: DynamicSprite
    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Scene, dSprite: DynamicSprite, config: IDragDialConfig = {})
    {
        this.scene = scene
        this.graphics = scene.add.graphics()
        
        this.dSprite = dSprite
        this.sprite = dSprite.sprite
        
        this.dragRotatePlugin = scene.plugins.get('rexDragRotate')
        this.dragRotate = this.dragRotatePlugin.add(scene, 
            {
                x: this.sprite.x,
                y: this.sprite.y,
                maxRadius: (this.sprite.displayWidth / 2),
                origin:
                {
                    x: this.sprite.originX,
                    y: this.sprite.originY
                }
            }
        )
        this.dragging = false

        this.config = config
        if (config.startAngle) this.sprite.setRotation(Phaser.Math.DegToRad(config.startAngle))

        this.dragRotate.on('dragstart', function()
        {
            this.dragging = true
        }, this)
        this.dragRotate.on('drag', function(dragRotate)
        {
            this.sprite.rotation += dragRotate.deltaRotation
        }, this)

        this.dragRotate.on('dragend', function()
        {
            this.dragging = false
        }, this)
        
        
        scene.events.on('update', function()
        {
            this.placeRelative()
            if (this.config.return) this.returnToCenter()
        }, this)

        scene.events.on('render', function()
        {
            this.graphics.clear()
            this.graphics.strokeCircle(this.sprite.x, this.sprite.y, this.dragRotate.maxRadius)
        }, this)


        this.sprite.setInteractive()
    }   

    placeRelative()
    {
        this.dragRotate.x = this.sprite.x
        this.dragRotate.y = this.sprite.y
        this.dragRotate.maxRadius = this.sprite.displayWidth / 2
    }

    returnToCenter(speed = .1)
    {
        if (this.dragging) return

        let center = Phaser.Math.DegToRad(this.config.startAngle)
        let rotation = this.sprite.rotation
        
        let diff = Phaser.Math.Angle.ShortestBetween(rotation, center)

        if (Math.abs(diff) < .001) {
            this.sprite.rotation = center
            return
        }

        this.sprite.rotation = rotation + (diff * speed)
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