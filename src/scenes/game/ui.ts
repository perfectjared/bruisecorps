import { Scene } from "phaser"
import { GameObjects } from "phaser"
import { appState, datGui, gameScene } from "../../app"

export class UI extends Scene
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

    }

    create(): void
    {
        this.state = 
        {
            start : false
        }
        const uiFolder = datGui.addFolder('ui')
        uiFolder.add(this.state, 'start' as keyof Object, false)
        uiFolder.open()
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
        gameScene.startGame()
        this.state.start = false
        datGui.updateDisplay()
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