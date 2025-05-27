import { appData } from '../../app'
import { Scene } from 'phaser'
import * as Tone from 'tone'

export default class Synth extends Scene
{
    graphics: any
    constants: any
    state: any
    buffer: 
    {
        player: Tone.Player
    }

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
        this.buffer =
        {
            player: new Tone.Player()
        }
        this.buffer.player.toDestination()
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
            console.log("metronome")
        }, "4n")
        Tone.getTransport().start()
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