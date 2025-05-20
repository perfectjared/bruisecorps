import { Scene } from 'phaser'

export default class Novel extends Scene
{
    graphics: any
    buffer: any
    constants: any
    state: any

    novelConfig: any

    constructor()
    {
        super({
            key: 'NovelScene'
        })
    }
}