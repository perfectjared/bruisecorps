import { Scene } from 'phaser'
import Slider from 'phaser3-rex-plugins/plugins/slider'
import DynamicSprite from './dynamicsprite'
import { appData, scenes } from '../app'

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
        lastDimensions:
        {
            x: number,
            y: number,
            width: number
        },
        last
    }

    sliderPlugin: any
    slider: Slider
    dragging: boolean

    scene: Scene
    graphics: Phaser.GameObjects.Graphics

    dSprite: DynamicSprite
    sprite: Phaser.GameObjects.Sprite

    relEndPoints: {x: number, y: number}[]

    constructor(scene, dSprite: DynamicSprite)
    {
        this.scene = scene
        this.graphics = scene.add.graphics

        this.dSprite = dSprite
        this.sprite = dSprite.sprite

        this.sliderPlugin = scene.plugins.get('rexSlider')
        this.slider = this.sliderPlugin.add(this.sprite,
            {
                endPoints:
                [
                    {x: 0, y:0},
                    {x: 0, y:0}
                ],
                value: 0,
                enable: true
            }
        )
        this.slider.on('valuechange', function(newValue, prevValue)
        {
            console.log(this.slider.endPoints)
        }, this)

        this.relEndPoints = [ {x: 0, y:0}, {x: 0, y:0}]
        scene.events.on('update', function()
        {
            if (this.relEndPoints[0].x == 0 && this.dSprite.sprite.x != 0 && this.dSprite.sprite.x != undefined)
            {
                let relativePosition = 
                {
                    x: this.dSprite.sprite.x / appData.width,
                    y: this.dSprite.sprite.y / appData.height
                }
                this.relEndPoints = 
                [
                    {x: relativePosition.x, y: relativePosition.y * 0.66},
                    {x: relativePosition.x, y: relativePosition.y}
                ]
            }
            this.slider.endPoints =
            [
                {x: this.relEndPoints[0].x * appData.width, y: this.relEndPoints[0].y * appData.height},
                {x: this.relEndPoints[1].x * appData.width, y: this.relEndPoints[1].y * appData.height}
            ]
        }, this)

        scene.events.on('render', function()
        {
            
        })

        this.sprite.setInteractive() 
    }
}