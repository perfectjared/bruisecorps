import { Scene } from "phaser"
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin"

import { appData, colors } from "../../app"
import DynamicSprite, { RelativeTransform } from '../../data-types/dynamicsprite'

export default class Menu extends Scene
{
    config: any

    app: any
    graphics: any

    uiPlugin: any
    uiShapes: any

    startDialog: any
    startDialogSprite: DynamicSprite
    startDialogTransform: RelativeTransform

    constants: 
    {

    }
    state:
    {

    }
    buffer:
    {

    }

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
        this.uiPlugin = this.sys.plugins.install('rexUI', UIPlugin)

        this.constants = 
        {

        }

        this.startDialogTransform =
        {
            position:
            {
                x: 0.5,
                y: 0.5
            },
            scale:
            {
                x: 0.5,
            }
        }
    }

    create(): void
    {
        this.initiateStartDialog()
    }

    initiateStartDialog()
    {
        this.startDialogSprite = 
        new DynamicSprite (
            new Phaser.GameObjects.Sprite(this, 0, 0, 'x')
            , this.startDialogTransform
        )
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