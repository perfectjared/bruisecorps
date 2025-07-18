import DragRotate from "phaser3-rex-plugins/plugins/dragrotate"
import { Scene } from "phaser"
import DynamicSprite from "./dynamicsprite"
import { getAppData } from "../config/app-config"

// DragDial component for interactive rotating controls

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
        last: any
    }

    // Track relative position for repositioning
    relativePosition: { x: number, y: number } = { x: 0, y: 0 }
    isPositionInitialized: boolean = false

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
            this.handleGlobalPointerTracking()
            if (this.config.return) this.returnToCenter()
            
            // Only update positioning occasionally, not every frame
            if (!this.isPositionInitialized || this.scene.time.now % 200 < 16) { // Every ~200ms
                this.updateRelativePosition()
                this.placeRelative()
            }
        }, this)

        scene.events.on('render', function()
        {
            this.graphics.clear()
            this.graphics.strokeCircle(this.sprite.x, this.sprite.y, this.dragRotate.maxRadius)
        }, this)
    }
    
    updateRelativePosition()
    {
        const appData = getAppData()
        // Only store relative position once when sprite is properly positioned and we haven't initialized yet
        if (!this.isPositionInitialized && this.dSprite.sprite.x > 0 && this.dSprite.sprite.y > 0) {
            this.relativePosition.x = this.dSprite.sprite.x / appData.width
            this.relativePosition.y = this.dSprite.sprite.y / appData.height
            this.isPositionInitialized = true
            console.log(`🎯 DragDial: Initialized relative position: ${this.relativePosition.x.toFixed(3)}, ${this.relativePosition.y.toFixed(3)}`)
        }
    }

    placeRelative()
    {
        const appData = getAppData()
        // Only update position if we have properly initialized relative coordinates
        if (this.isPositionInitialized && this.relativePosition.x > 0) {
            const newX = this.relativePosition.x * appData.width
            const newY = this.relativePosition.y * appData.height
            
            // Only update if position has significantly changed to avoid constant repositioning
            if (Math.abs(this.sprite.x - newX) > 5 || Math.abs(this.sprite.y - newY) > 5) {
                console.log(`🎯 DragDial: Position changed significantly - updating from ${this.sprite.x.toFixed(1)}, ${this.sprite.y.toFixed(1)} to ${newX.toFixed(1)}, ${newY.toFixed(1)}`)
                
                this.sprite.x = newX
                this.sprite.y = newY
                
                // Update drag plugin position to match
                this.dragRotate.x = this.sprite.x
                this.dragRotate.y = this.sprite.y
                this.dragRotate.maxRadius = this.sprite.displayWidth / 2
            }
        }
    }

    returnToCenter(speed = .1)
    {
        if (this.dragging || this.isPressed) return

        const center = Phaser.Math.DegToRad(this.config.startAngle || 0)
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
        
        // Delay relative position initialization to ensure sprite is properly positioned
        this.scene.time.delayedCall(200, () => {
            console.log(`🎯 DragDial: Delayed initialization - sprite position: ${this.dSprite.sprite.x}, ${this.dSprite.sprite.y}`)
            if (!this.isPositionInitialized) {
                this.updateRelativePosition()
            }
        })
    }

    update()
    {
        this.handleGlobalPointerTracking()
    }

    handleGlobalPointerTracking()
    {
        const appData = getAppData()
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