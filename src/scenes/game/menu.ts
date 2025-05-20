import { Scene } from "phaser"

export default class Menu extends Scene
{
    graphics: any
    graphicsConfig: any
    appState: Phaser.Data.DataManager

    buffer: 
    {

    }
    constants: 
    {
        noFocusFillStyle: 
        {
            color: number,
            alpha: number
        }
    }
    state : 
    {
        start
    }

    noFocusForeground: any

    constructor()
    {
        super(
            {
                key: 'MenuScene'
            }
        )
        
    }

    preload(): void
    {
        this.graphics = this.add.graphics()
        this.constants = 
        {
            noFocusFillStyle:
            {
                color: 0x000000,
                alpha: 0.66
            }
        }
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

    }

    startButton(): void
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
        this.graphics.clear()
        // if (!_appState.audioStarted || !_appState.hasFocus)
        // {
        //     this.graphics.fillStyle(this.constants.noFocusFillStyle.color, this.constants.noFocusFillStyle.alpha)
        //     this.graphics.fillRect(0, 0, _appState.width, _appState.height)
        // }
    }

    debug(): void
    {

    }
}