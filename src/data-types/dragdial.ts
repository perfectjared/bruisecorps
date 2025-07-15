import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import { Scene } from "phaser"
import DynamicSprite from "./dynamicsprite"
import { scenes, appData } from "../app"

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
    
    isPressed: boolean
    initialPointerAngle: number
    initialSpriteRotation: number

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
        this.isPressed = false
        this.initialPointerAngle = 0
        this.initialSpriteRotation = 0

        this.config = config
        if (config.startAngle) this.sprite.setRotation(Phaser.Math.DegToRad(config.startAngle))

        this.sprite.setInteractive()
        
        this.sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) =>
        {
            this.isPressed = true
            this.dragging = true
            
            this.initialPointerAngle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                pointer.worldX, pointer.worldY
            )
            this.initialSpriteRotation = this.sprite.rotation
        })
        this.dragRotate.on('dragstart', function()
        {
            this.dragging = true
        }, this)
        
        this.dragRotate.on('drag', function(dragRotate)
        {
            if (this.isPressed)
            {
                this.sprite.rotation += dragRotate.deltaRotation
            }
        }, this)

        this.dragRotate.on('dragend', function()
        {
            if (!this.isPressed)
            {
                this.dragging = false
            }
        }, this)

        scene.events.on('update', function()
        {
            this.placeRelative()
            this.handleGlobalPointerTracking()
            if (this.config.return) this.returnToCenter()
        }, this)

        scene.events.on('render', function()
        {
            this.graphics.clear()
            this.graphics.strokeCircle(this.sprite.x, this.sprite.y, this.dragRotate.maxRadius)
        }, this)
    }

    placeRelative()
    {
        this.dragRotate.x = this.sprite.x
        this.dragRotate.y = this.sprite.y
        this.dragRotate.maxRadius = this.sprite.displayWidth / 2
    }

    returnToCenter(speed = .1)
    {
        if (this.dragging || this.isPressed) return

        const center = Phaser.Math.DegToRad(this.config.startAngle)
        const rotation = this.sprite.rotation

        const diff = Phaser.Math.Angle.ShortestBetween(rotation, center)

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
        // Create the underlying DynamicSprite
        this.dSprite.create()
    }

    update()
    {

    }

    handleGlobalPointerTracking()
    {
        if (this.isPressed && !appData.pointerActive.active)
        {
            this.isPressed = false
            this.dragging = false
        }
        
        if (this.isPressed && appData.pointerActive.active && this.scene.input.activePointer)
        {
            const pointer = this.scene.input.activePointer
            
            const currentAngle = Phaser.Math.Angle.Between(
                this.sprite.x, this.sprite.y,
                pointer.worldX, pointer.worldY
            )
            
            const angleDiff = currentAngle - this.initialPointerAngle
            
            this.sprite.rotation = this.initialSpriteRotation + angleDiff
        }
    }

    destroy()
    {
        this.isPressed = false
        this.dragging = false
        
        if (this.dragRotate)
        {
            this.dragRotate.destroy()
        }
        
        if (this.graphics)
        {
            this.graphics.destroy()
        }
    }
}