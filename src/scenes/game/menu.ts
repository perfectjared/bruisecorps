import { Scene } from 'phaser'
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle'
import { ConfirmAction } from 'phaser3-rex-plugins/templates/ui/ui-components'

import { appData, colors, scenes } from '../../app'
import DynamicSprite from '../../data-types/dynamicsprite'

export default class Menu extends Scene
{
    config: any

    app: any
    graphics: any

    uiPlugin: any
    uiShapes: any

    startDialogAnchor: any
    startDialogStyle: any
    startDialog: any
    startDialogContent: any
    startDialogSprite: DynamicSprite

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
        this.uiPlugin = (this['rexUI'])

        this.startDialogAnchor =
        {
            x: '50%',
            y: '50%',
            width: '60%',
            height: '80%'
        }
        this.startDialogContent = 
        {
            title: 'welcome to bruisecorps',
            content: 'heres an explanation of the game OR an overview of the players save',
            buttonA: 'key turning animation'
        }   
        this.startDialogStyle =
        {
            anchor: this.startDialogAnchor,
            background: 
            {
                color: colors[0]
            },
            title:
            {
                text:
                {
                    fontSize: 24,
                    color: colors[4]
                },
                background:
                {
                    color: colors[1]
                }
            },
            content:
            {
                space:
                {
                    left: 5, right: 5, top: 5, bottom: 5
                },
                text:
                {
                    fontSize: 20,
                    color: colors[4]
                },
            },
            buttonMode: 1,
            button:
            {
                background:
                {
                    color: colors[2],
                    'hover.strokeColor': colors[5]
                }
            },
            align: 
            {
                actions: 'right'
            }
        }

        this.startDialog = this.uiPlugin.add.confirmDialog(this.startDialogStyle).resetDisplayContent(this.startDialogContent).layout().modalPromise().then(() =>
        {
            scenes.game.state.playing = true
        }, this)
    }

    create(): void
    {
        this.initiateStartDialog()
    }

    initiateStartDialog()
    {
        this.startDialogSprite = new DynamicSprite(this, this.startDialogAnchor)
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