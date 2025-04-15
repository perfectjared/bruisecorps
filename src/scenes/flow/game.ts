import { Scene } from 'phaser';
import { appState, debugScene, margeScene, phoneScene, roadScene, tourScene } from '../../app';
import { Tuple } from '../../data-types'
import  Marge from '../game/marge'

export default class Game extends Scene 
{
  //organize it this way VV book of lenses
  space: any
  time: any
  objects: any
  actions: any
  rules: any

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
      healthNumbers: { min: 0, max: 100, start: 86, step : .01 },
      bleedValues: [0, .1, .4, 1.6, 3.1],
      speedNumbers: { min: 60, max: 240, start: 60, step: 1 },
      stepNumbers: { min: 0, max: 256, start: 0, 
        step: function() 
        { 
          this.min +=1
        }
      },
      progressNumbers: { min: 0, max: 100, start: 0, step: .01 },
      progressValues: [0, 1, 2, 4, 8]
    }

    this.state = 
    {
      step: 0,
      scale: innerWidth / (this.sys.game.config.width as number),
      
      started: false,
      playing: false,
      speed: this.constants.speedNumbers.start,
      health: this.constants.healthNumbers.start,
      money: 5, //0 - 100, .1 steps, then interpreted into a dollar amount, exponential.
      progress: 0, //0 - 100, .1 steps, interpreted into miles with tour state
    }

    this.buffer = 
    {
      lastPlaying: false,
      lastSpeed: 0,
      lastStep: 0,
    }
  }

  create(): void 
  {
    this.road = this.scene.launch(roadScene).scene
    this.tour = this.scene.launch(tourScene).scene
    this.marge = this.scene.launch(margeScene).scene
    this.phone = this.scene.launch(phoneScene).scene

    this.scene.launch(debugScene)

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
                  console.log("mtrnm bpm @ " + this.metronomeTween.delay)
                }
                else
                {
                  let stepMax = this.state.step == this.constants.stepNumbers.max
                  this.state.step = (stepMax == true) ? 0 : this.state.step + 1
                  console.log("mtrnm step @ " + this.state.step)
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
    let nextStep = (this.buffer.lastStep != this.state.step)
    if (nextStep) this.step()
    //listen for input from RoadScene
    //listen for input from MargeScene
    //listen for input from UIScene
    //listen for input from MenuScene
    //listen for player input
  }

  step(): number
  {
    this.healthBleed()
    this.progressIncrement()

    this.buffer.lastStep = this.state.step
    return this.state.step
  }

  healthBleed(): number
  {
    let bleedAmount = this.constants.bleedValues[Math.round(Math.random() * margeScene.state.shifter.gear)]
    this.state.health -= bleedAmount
    console.log('bleed ' + bleedAmount + ', health ' + this.state.health)
    return this.state.health
  }

  progressIncrement(): number
  {
    let progressAmount = this.constants.progressValues[margeScene.state.shifter.gear]
    this.state.progress += progressAmount
    console.log('progress ' + progressAmount)
    return this.state.progress
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