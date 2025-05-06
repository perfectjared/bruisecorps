import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appState, scenes } from "../../../app"

export default class Phone extends Scene
{
    phoneBase: GameObjects.Sprite
    phoneScreen: GameObjects.Sprite
    phoneCracks: GameObjects.Sprite
    phoneSprites: Array<GameObjects.Sprite>
    renderSettings: any

    constructor()
    {
        super({
            key: 'PhoneScene'
        })
    }

    preload(): void
    {
        this.load.image('phone-base', '../../../assets/image/phone/phone-perspective-base.png')
        this.load.image('phone-screen', '../../../assets/image/phone/phone-perspective-screen.png')
        this.load.image('phone-cracks', '../../../assets/image/phone/phone-perspective-cracks.png')
    }
 
    create(): void
    {
        this.phoneBase = this.add.sprite(0, 0, 'phone-base')
        this.phoneScreen = this.add.sprite(0, 0, 'phone-screen')
        this.phoneCracks = this.add.sprite(0, 0, 'phone-cracks')

        this.renderSettings = 
        {
            width: this.sys.game.config.width,
            height: this.sys.game.config.height,
            resolution: null //(computed)
        }

        this.phoneSprites = Array<GameObjects.Sprite>(3)
        this.phoneSprites[0] = this.phoneBase
        this.phoneSprites[1] = this.phoneScreen
        this.phoneSprites[2] = this.phoneCracks
    }

    update(): void
    {
        this.control()
        this.process()
        this.system()
        this.feedback()
        this.debug()
    }

    control(): void
    {

    }

    process(): void
    {

    }

    system(): void
    {

    }

    feedback(): void
    {
        this.placePhone()
    }

    debug(): void
    {

    }

    placePhone(): void
    {
        this.phoneSprites.forEach
        (
            (sprite: GameObjects.Sprite) =>
            {
                let height: number = this.sys.game.config.height as number
                let width: number = this.sys.game.config.width as number
                let minScale: number = 0.5
                let maxScale: number = 0.9
                let minPosition: number = width / 3
                let maxPosition: number = width
                
                let scale = scenes.game.state.scale
                scale = (scale > maxScale) ? maxScale : (scale < minScale) ? minScale : scale
                
                let scalePosition = (scale - minScale) / (maxScale - minScale)
                let position: number = (((scalePosition - (minPosition * width)) / ((maxPosition * width) - (minPosition * width))) + (sprite.width))


                sprite.setOrigin(0.1, 0.5)
                sprite.setPosition(position, height)
                sprite.setScale(scale)
            },

        )
    }
}