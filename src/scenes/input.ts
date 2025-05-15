import { Scene } from "phaser";
import { scenes } from "../app";

export default class InputScene extends Scene
{
    constants
    state
    buffer:
    {
        objectsTouching: Phaser.GameObjects.GameObject[][]
    }

    constructor()
    {
        super({
            key: 'InputScene'
        })
    }

    preload()
    {

    }

    create()
    {
        this.buffer = 
        {
            objectsTouching: []
        }

        Object.values(scenes).forEach((scene: Scene) =>
        {
            this.buffer.objectsTouching[scene.scene.key] = []
            let buffer = this.buffer
            scene.input.on('pointerdown', function(pointer, gameObjects)
            {
                if (gameObjects.length > 0) buffer.objectsTouching[scene.scene.key].push(gameObjects) 
                console.log(buffer.objectsTouching[scene.scene.key])
            }, this)
            scene.input.on('pointerup', function(pointer)
            {
                buffer.objectsTouching[scene.scene.key] = []
            }, this)
        }, this)    
    }

    update()
    {

    }

    control()
    {

    }

    step()
    {

    }

    process()
    {

    }

    system()
    {

    }

    feedback()
    {

    }

    debug()
    {

    }
}