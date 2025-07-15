import Anchor from "phaser3-rex-plugins/plugins/anchor";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { scenes } from "../app";

export default class DynamicSprite {
    scene: Phaser.Scene;
    sprite: Phaser.GameObjects.Sprite;
    graphics: Phaser.GameObjects.Graphics;
    anchor: Anchor;
    anchorConfig: any;
    sizer: Sizer;
    uiPlugin: any;

    constructor(scene: Phaser.Scene, anchor: any = {}, sprite?: Phaser.GameObjects.Sprite) {
        this.scene = scene;
        this.sprite = sprite || new Phaser.GameObjects.Sprite(scene, 0, 0, 'x');
        this.anchorConfig = anchor;
        this.scene.events.on('update', this.update, this);
    }

    create() {
        this.scene.add.existing(this.sprite);
        
        const anchorPlugin = this.scene.plugins.get('rexAnchor') as any;
        if (anchorPlugin) {
            this.anchor = anchorPlugin.add(this.sprite, this.anchorConfig);
        }
        
        this.uiPlugin = this.scene.plugins.get('rexUI') || scenes.menu?.['rexUI'];
        if (this.uiPlugin) {
            this.sizer = this.uiPlugin.add.sizer(new Sizer(this.scene));
        }
    }

    update() {
        if (!this.uiPlugin) {
            this.uiPlugin = this.scene.plugins.get('rexUI') || scenes.menu?.['rexUI'];
        }
        this.draw();
    }

    draw() {
        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }
        this.graphics.clear();
        this.graphics.lineStyle(1, 0xFFFFFF, 1);
        this.graphics.strokeRectShape(this.sprite.getBounds());
    }
}