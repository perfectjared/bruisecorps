import Anchor from "phaser3-rex-plugins/plugins/anchor"
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { appData, scenes, UIPlugin } from "../app"

export default class DynamicSprite
{
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.Sprite
    graphics: Phaser.GameObjects.Graphics
    anchor: Anchor
    anchorConfig: any
    anchorPlugin: any
    sizer: Sizer
    uiPlugin: any

    constructor
    (scene: Phaser.Scene,
    anchor: any = {},
    sprite: Phaser.GameObjects.Sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'x'))
    {
        this.scene = scene
        this.sprite = sprite
        this.anchorConfig = anchor
        this.scene.events.on('update', this.update, this)
    }

    create()
    {
        this.scene.add.existing(this.sprite)
        this.anchorPlugin = this.scene.plugins.get('rexAnchor')
        if (this.anchorPlugin) {
            this.anchor = this.anchorPlugin.add(this.sprite, this.anchorConfig)
        }
        this.sizer = this.uiPlugin.add.sizer(new Sizer(this.scene))
    }

    update()
    {
        if (!this.uiPlugin)
        {
            this.uiPlugin = scenes.menu['rexUI']
            if (this.uiPlugin) this.create()
        }
        this.draw()
    }

    draw()
    {
        if (!this.graphics) return
        this.graphics.clear()
        this.graphics.lineStyle(1, 0xFFFFFF, 1)
        this.graphics.strokeRectShape(this.sprite.getBounds())
    }
}