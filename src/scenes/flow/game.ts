import { Scene } from 'phaser';
import { appState } from '../../app';
import { Tuple } from '../../data-types'

export default class Game extends Scene 
{
  buffer: any
  constants: any
  state : any
  
  road: Scene
  tour: Scene
  marge: Scene
  phone: Scene

  relationships: any[]

  metronomeTween: any

  constructor() 
  {
    super({
      key: 'GameScene'
    });
  }
  
  preload(): void
  {
    this.constants = 
    {
      speedMin: 60,
      speedMax: 240,
      stepMax: 256,
      healthValues: { min: 0, max: 100, start: 86, step : .01 },
      bleedValues: [.11, .33, .66, .99],
      
      speedValues: { min: 60, max: 240, start: 60, step: 1 },
      stepValues: { min: 0, max: 256, start: 0, 
        step: function() 
        { 
          this.min +=1
        }
      }
    }

    this.state = 
    {
      scale: innerWidth / (this.sys.game.config.width as number),

      step: 0,
      
      started: false,
      playing: false,
      speed: this.constants.speedValues.start,
      health: this.constants.healthValues.start,
      money: 5, //0 - 100, .1 steps, then interpreted into a dollar amount, exponential.
      distance: 100, //100 - 0, 1 steps, interpreted into a miles amount, exponential
    }

    this.buffer = 
    {
      lastPlaying: false,
      lastSpeed: 0
    }
  }

  create(): void 
  {
    this.road = this.scene.launch('RoadScene').scene
    this.tour = this.scene.launch('TourScene').scene
    this.marge = this.scene.launch('MargeScene').scene
    this.phone = this.scene.launch('PhoneScene').scene
    this.scene.launch('DebugScene')

    this.metronomeTween = this.time.addEvent({
      delay: 1000,
      callback: () => {
          if (this.state.playing) 
            {
              {
                let speedChanged = this.state.speed != this.buffer.lastSpeed
                if (speedChanged)
                {
                  let constrainedSpeed = Math.min(Math.max(this.state.speed, this.constants.speedMin), this.constants.speedMax)
                  this.metronomeTween.delay = 60000 / constrainedSpeed
                  this.buffer.lastSpeed = this.state.speed
                  console.log(this.metronomeTween.delay)
                }
                else
                {
                  console.log("metronome")
                  let stepMax = this.state.step == this.constants.stepMax
                  this.state.step = (stepMax) ? 0 : this.state.step + 1
                }
              }
            }
      },
      loop: true,
  });
  }

  startGame(): void
  {
    console.log("game start")
    this.state.started = true
    this.state.playing = true
    this.metronomeTween.play
    this.startRoad()
  }

  startRoad(): void
  {
    console.log("implement startRoad()")
  }

  update(): void 
  {
    this.control()
    this.process()
    this.system()
    this.feedback()
    this.debug()
  }

  control(): void
  {
    //listen for input from RoadScene
    //listen for input from MargeScene
    //listen for input from UIScene
    //listen for input from MenuScene
    //listen for player input
  }

  process(): void
  {
    if (!this.state.started) 
    {
      this.state.playing = false
      return
    }
    if (!this.state.playing) return

    let startPlaying = this.state.playing && !this.buffer.lastPlaying
    if (startPlaying)
    {
      this.startGame()
    }

    let stopPlaying = !this.state.playing && this.buffer.lastPlaying
    {

    }
    this.buffer.lastPlaying = this.state.playing
  }

  system(): void
  {
    this.state.scale = innerWidth / (this.sys.game.config.width as number)
  }

  feedback(): void
  {
  }

  debug(): void
  {
    
  }
}