import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appState, scenes } from "../../../app"
import { placeSprite } from "../../../lib/utilities"

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
                let width = appState.width as number
                let height = appState.height as number

                let minScale: number = 0.5
                let maxScale: number = 0.9
                let minX: number = width / 3
                let maxX: number = width
                let minY: number = 0
                let maxY : number = height

                sprite.setOrigin(0.1, 0.5)
                placeSprite(sprite, minScale, maxScale, minX, maxX)
            },

        )
    }
}