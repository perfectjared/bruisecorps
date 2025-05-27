import { appData } from '../../app'
import { Scene } from 'phaser'
import * as Tone from 'tone'

export default class Synth extends Scene
{
    graphics: any
    constants: any
    state: 
    {
        step: number
    }
    player: Tone.Player

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
        this.constants =
        {
            bpms:
            [
                60,
                80,
                120,
                140
            ]
        }
        this.state =
        {
            step: 0
        }
        this.player = new Tone.Player()
        this.player.toDestination()
        Tone.getTransport().bpm.value = this.constants.bpms[0]
    }

    create()
    {
        this.audioStartEvent = (async() =>
        {
            await Tone.start()
            appData.audioStarted = true //DON'T DO THIS!!!
            console.log('synth: audio ready')
            this.removeAudioStartEvent()
        })
        this.domElement?.addEventListener('click', this.audioStartEvent)
    }

    removeAudioStartEvent()
    {
        this.domElement?.removeEventListener('click', this.audioStartEvent)
        this.startMetronome()
    }

    startMetronome()
    {
        Tone.getTransport().scheduleRepeat((time) =>
        {
            this.state.step ++
            if (this.state.step > 256) this.state.step = 0
        }, "4n")
        Tone.getTransport().start()
    }

    update()
    {
    }

    control()
    {

    }

    beat()
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