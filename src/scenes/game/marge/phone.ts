import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appState, scenes } from "../../../app"
import { placeReactiveSprite } from "../../../lib/utilities"

export default class Phone extends Scene
{
    phoneBase: GameObjects.Sprite
    phoneScreen: GameObjects.Sprite
    phoneCracks: GameObjects.Sprite
    phoneSprites: Array<GameObjects.Sprite>

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
        this.phoneSprites = Array<GameObjects.Sprite>(3)
        this.phoneSprites[0] = this.phoneBase
        this.phoneSprites[1] = this.phoneScreen
        this.phoneSprites[2] = this.phoneCracks
        this.placePhone()
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
                sprite.setOrigin(0.1, 0.5)
                placeReactiveSprite(sprite,
                    {
                        x: 0.6,
                        y: 0.9,
                        width: 0.6,
                        maxScale: 2,
                        minScale: 0.2
                    }
                )
            },

        )
    }
}