import { Scene } from "phaser"
import { appData } from "../../app"


export default class Menu extends Scene
{
    app: any
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
        this.graphics.clear()
        if (!appData.audioStarted || !appData.hasFocus)
        {
            this.graphics.fillStyle(this.constants.noFocusFillStyle.color, this.constants.noFocusFillStyle.alpha)
            this.graphics.fillRect(0, 0, appData.width, appData.height)
        }
    }

    debug(): void
    {

    }
}