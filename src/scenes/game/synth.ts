import { app, appData } from '../../app'
import { Scene } from 'phaser'
import * as Tone from 'tone'

export default class Synth extends Scene
{
    graphics: any
    constants: any
    state: any
    buffer: any

    domElement: HTMLBodyElement
    audioStartEvent: () => Promise<void>

    constructor()
    {
        super(
        {
            key: 'SynthScene'
        })
    }

    preload()
    {
        this.domElement = document.querySelector('body')
    }

    create()
    {
        this.audioStartEvent = (async() =>
        {
            await Tone.start()
            appData.audioStarted = true //DON'T DO THIS!!!
            console.log('audio ready')
            this.removeAudioStartEvent()
        })
        this.domElement?.addEventListener('click', this.audioStartEvent)
    }

    removeAudioStartEvent()
    {
        this.domElement?.removeEventListener('click', this.audioStartEvent)
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