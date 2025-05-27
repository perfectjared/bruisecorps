import Anchor from "phaser3-rex-plugins/plugins/anchor";
import { appData } from "../app";

export default class DynamicSprite
{
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.Sprite
    graphics: Phaser.GameObjects.Graphics
    anchor: Anchor
    anchorPlugin: any

    constructor
    (scene: Phaser.Scene, 
    anchor: any = {}, 
    sprite: Phaser.GameObjects.Sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'x'))
    {
        this.scene = scene
        this.sprite = sprite
        this.scene.add.existing(sprite)

        this.anchorPlugin = this.scene.plugins.get('rexAnchor')
        this.anchor = this.anchorPlugin.add(this.sprite, anchor)

        sprite.setVisible(false)
        this.graphics = this.scene.add.graphics()
        
        this.scene.events.on('update', this.update, this)
    }

    update()
    {
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