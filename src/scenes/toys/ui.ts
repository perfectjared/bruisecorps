import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appData } from "../../app"

export default class UI extends Scene
{
    state : any
    uiFolder : any

    constructor()
    {
        super(
            {
                key: 'UIScene'
            }
        )
    }

    preload(): void
    {

    }    create(): void
    {
        this.state = 
        {
            start : false
        }
        // UI folder functionality removed - can be re-implemented if needed
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
        if (this.state.start == true)
        {
            this.startButton()
        }
    }    startButton(): void
    {
        //send an event or whatever
        // Game start functionality can be re-implemented if needed
        this.state.start = false
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