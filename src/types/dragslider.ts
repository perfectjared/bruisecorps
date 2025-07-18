import { Scene } from 'phaser'
import Slider from 'phaser3-rex-plugins/plugins/slider'
import DynamicSprite from './dynamicsprite'
import { appData } from '../app'

export interface IDragSliderConfig
{

}

export default class DragSlider
{
    config: IDragSliderConfig
    defaultConfig: IDragSliderConfig =
    {

    }

    buffer:
    {
        lastDragging: boolean
    }

    sliderPlugin: any
    slider: Slider
    dragging: boolean

    scene: Scene
    graphics: Phaser.GameObjects.Graphics

    dSprite: DynamicSprite
    sprite: Phaser.GameObjects.Sprite

    relEndPoints: {x: number, y: number}[]

    snaps: number[] | null
    percent: number

    constructor(scene, dSprite: DynamicSprite, snaps: number[] = null, percent: number = 0.66, initialValue: number = 0)
    {
        this.buffer =
        {
            lastDragging: false
        }

        this.scene = scene
        this.graphics = scene.add.graphics

        this.dSprite = dSprite
        this.sprite = dSprite.sprite

        this.snaps = snaps
        this.percent = percent

        this.sliderPlugin = scene.plugins.get('rexSlider')
        this.slider = this.sliderPlugin.add(this.sprite,
            {
                endPoints:
                [
                    { x: 0, y:0 },
                    { x: 0, y:0 }
                ],
                value: initialValue,
                enable: true
            }
        )
        this.slider.on('valuechange', function(newValue, prevValue)
        {        }, this)

        this.relEndPoints = [ { x: 0, y:0 }, { x: 0, y:0 }]
        
        scene.events.on('update', function()
        {
            if (!this.slider.isDragging && this.buffer.lastDragging)
            {
                if (this.snaps != null) this.snap()
            }

            if (this.relEndPoints[0].x == 0 && this.dSprite.sprite.x != 0 && this.dSprite.sprite.x)
            {
                const relativePosition =
                {
                    x: this.dSprite.sprite.x / appData.width,
                    y: this.dSprite.sprite.y / appData.height
                }
                this.relEndPoints =
                [
                    { x: relativePosition.x, y: relativePosition.y * percent },
                    { x: relativePosition.x, y: relativePosition.y }
                ]
            }
            this.slider.endPoints =
            [
                { x: this.relEndPoints[0].x * appData.width, y: this.relEndPoints[0].y * appData.height },
                { x: this.relEndPoints[1].x * appData.width, y: this.relEndPoints[1].y * appData.height }
            ]

            this.buffer.lastDragging = this.slider.isDragging
        }, this)

        scene.events.on('render', function()
        {

        })

        this.sprite.setInteractive()
    }

    snap(): void
    {
        const diffs = [this.snaps.length - 1]
        const smallest =
        {
            val: Number.MAX_SAFE_INTEGER,
            index: -1
        }

        for (let i = 0; i < this.snaps.length; i++)
        {
            diffs[i] = Math.abs(this.snaps[i] - this.slider.value)
        }

        for (let i = 0; i < diffs.length; i ++)
        {
            if (diffs[i] < smallest.val)
            {
                smallest.val = diffs[i]
                smallest.index = i
            }
        }
        this.slider.setValue(this.snaps[smallest.index])
    }
}