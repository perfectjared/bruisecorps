import { Scene } from "phaser"

export default class UI extends Scene
{
    buffer: any
    constants: any
    state : 
    {
        start
    }

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

    }

    create(): void
    {
        this.state = 
        {
            start : false
        }
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
    }

    startButton(): void
    {
        //send an event or whatever
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