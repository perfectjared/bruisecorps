import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appState, gameScene } from "../../app"

export default class Dash extends Scene
{
    signal : any
    shifter : any
    wheel : any

    constructor()
    {
        super(
            {
                key: 'DashScene'
            }
        )

        this.signal = 
        {

        }

        this.shifter = 
        {

        }

        this.wheel = 
        {
            sprite : new Phaser.GameObjects.Sprite(this, 0, 0, 'hello')
        }
    }

    preload(): void
    {

    }

    create(): void
    {

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