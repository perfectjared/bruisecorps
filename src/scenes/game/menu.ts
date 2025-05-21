import { Scene } from "phaser"
import { appData, colors } from "../../app"
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin"
import RelativeTransform from "../../data-types/relativetransform"

export default class Menu extends Scene
{
    config: any

    app: any
    graphics: any

    uiPlugin: any
    uiShapes: any

    constants: 
    {
        noFocusFillStyle: 
        {
            color: number,
            alpha: number
        },
        startDialogConfig: any,
        startDialogTransform: RelativeTransform
    }
    state:
    {

    }
    buffer:
    {

    }

    startDialog: any

    constructor()
    {
        super(
            {
                key: 'MenuScene',
            }
        )
    }


    preload(): void
    {
        this.graphics = this.add.graphics()
        this.uiPlugin = this.sys.plugins.install('rexUI', UIPlugin)

        this.constants = 
        {
            noFocusFillStyle:
            {
                color: colors[5],
                alpha: 0.66
            },
            startDialogConfig:
            {
                x: 0,
                y: 0,
                anchor: undefined,
                width: undefined,
                height: undefined,
                originX: 0.5,
                originY: 1
            },
            startDialogTransform:
            {
                sprite: new Phaser.GameObjects.Sprite(this, 0, 0, ''),
                origin:
                {
                    x: 0.5,
                    y: 0.95
                },
                x: 0.5,
                y: 0.5,
                width: 1,
                height: 1
            }
        }
    }

    create(): void
    {
        this.createStartButton()
    }

    createStartButton()
    {
        let CreateLabel = function(this) 
        {
            return this.uiPlugin.add.label
            ({
                background: this.add.rectangle(0, 0, 0, 0, colors[0]),
                text: this.add.text(0, 0, "ok", { fontSize: '24px' }),
                space: 
                {
                    left: 10,
                    right: 10, 
                    top: 10,
                    bottom: 10
                }
            })
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