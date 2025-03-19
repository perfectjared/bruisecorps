import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appState, gameScene } from "../../app"

export class UI extends Scene
{

    constructor()
    {
        super(
            {
                key: 'UiScene'
            }
        )
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