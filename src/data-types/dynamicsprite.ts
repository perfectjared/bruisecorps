import { appData, colors, game, scenes } from "../app";

export interface RelativeTransform
{
    texture?: string

    position: //relative
    {
        x: number,
        y: number
    }
    origin?: //relative
    {
        x: number,
        y: number
    }
    scale?: //relative
    {
        x: number,
        y?
        : number,
        min?: number,
        max?: number
    }
    _originalDimensions?: //pixel, = sprite.width || 64
    {
        x: number,
        y: number
    }
}


export default class DynamicSprite
{
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.Sprite
    relTransform: RelativeTransform
    viewportCoordinatePlugin: any
    viewport: Phaser.Geom.Rectangle

    constructor(sprite: Phaser.GameObjects.Sprite, relTransform: RelativeTransform)
    {
        this.scene = sprite.scene
        this.sprite = sprite
        this.relTransform = relTransform

        this.viewportCoordinatePlugin = this.scene.plugins.get('rexViewportCoordinate')
        this.viewport = new Phaser.Geom.Rectangle(0, 0, appData.width, appData.height)

        this.scene.add.existing(sprite)
        this.viewportCoordinatePlugin.add(sprite, this.viewport, relTransform.position.x, relTransform.position.y)
        this.scale()
        this.place()
        this.scene.scale.on('resize', () =>
        {
            this.scale()
            this.place()
        }, this)
    }

    scale()
    {
        if (this.relTransform.scale)
        {
            let scaleX = (this.viewport.width * this.relTransform.scale.x) / this.sprite.width
            if (this.relTransform.scale.y)
            {
                let scaleY  = (this.viewport.height * this.relTransform.scale.y) / this.sprite.height
                this.sprite.setScale(scaleX, scaleY)
            } 
            else
            {
                this.sprite.setScale(scaleX)
            }
        }
    }

    place()
    {
        this.viewport.setTo(0, 0, appData.width, appData.height)
    }
}