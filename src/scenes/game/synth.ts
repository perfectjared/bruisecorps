import { app, appData } from '../../app'
import { Scene } from 'phaser'
import * as Tone from 'tone'

export default class Synth extends Scene
{
    graphics: any
    constants: any
    state: any
    buffer: any

    constructor()
    {
        super(
        {
            key: 'SynthScene'
        })
    }

    preload()
    {

    }

    create()
    {
        document.querySelector('body')?.addEventListener('click', async() =>
        {
            await Tone.start()
            appData.audioStarted = true
            console.log('audio ready')
        })
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