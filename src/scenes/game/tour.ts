import { Scene } from "phaser";

export default class Tour extends Scene
{
    constants: any
    state: any
    buffer: any

    space: any
    time: any
    objects: any
    actions: any
    rules: any

    constructor()
    {
        super('TourScene')
    }

    preload()
    {

    }

    create()
    {

    }

    update()
    {
        this.control()
        this.process()
        this.system()
        this.feedback()
        this.debug()
    }

    control()
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