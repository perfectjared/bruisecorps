import Slider from 'phaser3-rex-plugins/plugins/slider.js'
import { Scene } from 'phaser'

export interface DragSliderConfig
{

}

export default class DragSlider
{
    config: DragSliderConfig
    defaultConfig: DragSliderConfig =
    {

    }

    sliderPlugin: any
    slider: Slider
    scene: Scene
    graphics: Phaser.GameObjects.Graphics

    constructor(scene, config: DragSliderConfig = this.defaultConfig)
    {

    }
}