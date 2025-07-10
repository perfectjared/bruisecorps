import { Scene } from 'phaser'
import Anchor from 'phaser3-rex-plugins/templates/ui/ui-components'
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle'
import { ConfirmAction } from 'phaser3-rex-plugins/templates/ui/ui-components'

import { appData, colors, scenes, UIPlugin } from '../../app'
import DynamicSprite from '../../data-types/dynamicsprite'

export default class Menu extends Scene
{
    config: any

    app: any
    graphics: any

    uiPlugin: any
    uiShapes: any

    fullScreenAnchor: any
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
                key: 'MenuScene'
            }
        )
    }

    preload(): void
    {
        this.uiPlugin = this['rexUI']

        this.fullScreenAnchor =
        {
            centerX: 'center',
            centerY: 'center',
            width: '80%',
            height: '80%',
            enable: true
        }
        this.startDialogContent =
        {
            title: 'welcome to bruisecorps',
            content: 'heres an explanation of the game OR an overview of the players save',
            buttonA: 'key turning animation'
        }
        this.startDialogStyle =
        {
            anchor: this.fullScreenAnchor,
            space:
            {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            },
            expand:
            {
                title: true,
                content: true,
                action: true
            },
            background:
            {
                color: colors[0]
            },
            align:
            {
                actions: 'right'
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
                text:
                {
                    fontSize: 20,
                    color: colors[4]
                }
            },
            buttonMode: 1,
            button:
            {
                text:
                {
                    fontSize: 20,
                    color: '#facade'
                },
                background:
                {
                    color: colors[2],
                    'hover.color': colors[5]
                }
            }
        }

        // this.startDialog = this.uiPlugin.add.confirmDialog(this.startDialogStyle).resetDisplayContent(this.startDialogContent).layout().modalPromise().then(() =>
        // {
        //     scenes.game.state.playing = true //DON'T DO THIS!!!
        // }, this)
    }

    create(): void
    {
        this.initiateStartDialog()
    }

    initiateStartDialog()
    {
        // this.startDialogSprite = new DynamicSprite(this, this.fullScreenAnchor)
        // this.startDialog.scene = this
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