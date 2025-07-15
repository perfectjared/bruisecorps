import { appData, sendSynthDataToHydra } from '../app'
import { Scene } from 'phaser'
import * as Tone from 'tone'

export default class Synth extends Scene
{
    constants: any
    state: { step: number }
    player: Tone.Player
    clickNoise: Tone.Noise
    clickEnv: Tone.AmplitudeEnvelope

    constructor()
    {
        super({ key: 'SynthScene' })
    }

    preload()
    {
        this.constants = {
            bpms: [60, 80, 120, 140]
        }
        this.state = { step: 0 }
        
        this.player = new Tone.Player().toDestination()
        
        // Create percussive click sound using noise
        this.clickNoise = new Tone.Noise('white')
        this.clickEnv = new Tone.AmplitudeEnvelope({
            attack: 0.001,
            decay: 0.01,
            sustain: 0,
            release: 0.01
        })
        
        // Chain: Noise -> Envelope -> Gain -> Destination
        const clickGain = new Tone.Gain(-46)
        this.clickNoise.chain(this.clickEnv, clickGain, Tone.getDestination())
        
        Tone.getTransport().bpm.value = this.constants.bpms[0]
    }

    create()
    {
        setTimeout(() => this.initAudio(), 1000)
    }
    
    async initAudio()
    {
        if (!appData.audioStarted) {
            setTimeout(() => this.initAudio(), 1000)
            return
        }
        
        try {
            await Tone.start()
            setTimeout(() => this.startMetronome(), 1000)
        } catch (error) {
            console.error('Failed to start Tone.js:', error)
        }
    }

    startMetronome()
    {
        Tone.getTransport().scheduleRepeat((time) =>
        {
            this.state.step++
            if (this.state.step > 256) this.state.step = 0
            
            const currentBPM = Tone.getTransport().bpm.value
            const volume = 0.5 + (this.state.step % 16) / 32
            
            sendSynthDataToHydra({
                bpm: currentBPM,
                step: this.state.step,
                volume: volume
            })
            
            if (appData.hasFocus) {
                this.clickNoise.start(time)
                this.clickEnv.triggerAttackRelease('64n', time)
                this.clickNoise.stop(time + 0.02)
            }
        }, "4n")
        
        Tone.getTransport().start()
    }

    update() {}
    control() {}
    beat() {}
    process() {}
    system() {}
    feedback() {}
    debug() {}
}