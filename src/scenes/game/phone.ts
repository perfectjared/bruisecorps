import { Scene } from "phaser"
import RelativeTransform from "../../data-types/relativetransform"

            // placeReactiveSprite(sprite,
            //     {
            //         x: 0.6,
            //         y: 0.9,
            //         width: 0.6,
            //         maxScale: 2,
            //         minScale: 0.2
            //     }
            // )

export default class Phone extends Scene
{
    relativeTransform: RelativeTransform
    
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
        // this.relativeTransform = 
        // {
        //     origin:
        //     {
        //         x: 0,
        //         y: 0
        //     },
        //     x: 0.6,
        //     y: 0.9,
        //     width: 0.6,
        //     minScale: 0.2,
        //     maxScale: 2
        // }
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
}