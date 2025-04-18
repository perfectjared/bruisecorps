import { Scene } from 'phaser';
import { debugScene, margeScene, phoneScene, rearviewScene, roadScene, tourScene } from '../../app';
import Tour from '../game/tour';
import * as trashTour from '../../data/trsh-tour.json'

export default class Game extends Scene 
{
  //organize it this way VV book of lenses
  mechanics:
  {
    space: any
    time: any
    objects: any
    actions: any
    rules: any
  }

  //TODO actually declare things here
  buffer : any

  //TODO actually declare things here
  constants : any

  state : 
  {
    started //should be app level
    scale

    playing
    step
    speed

    health
    progress
    timeLeft

    resources :
    {
      pussy
      money
      weed
      snacks
    }

    month
    day
    hour

    tour
    showIterator
    lastShow
    nextShow
    
    showsLeft
  }
  
  road: Scene
  tour: Scene
  marge: Scene
  phone: Scene
  rearview: Scene

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
      progress: 0, //0 - 100, .1 steps, interpreted into miles with tour state

      resources:
      {
        pussy: 0,
        money: 100,
        weed: 3,
        snacks: 5,
      },
      tour: new Tour(),
      showIterator: 1,
      lastShow: "",
      nextShow: "",
      timeLeft: 666,
      showsLeft: 69,
      
      month: 4,
      day: 16,
      hour: 8
    }

    let tour = trashTour.shows
    this.state.tour.shows = tour
    this.state.lastShow = tour[1].city
    this.state.nextShow = tour[2].city
    this.state.timeLeft = tour[2].timeTo
    this.state.showsLeft = tour.length - this.state.showIterator

    this.buffer = 
    {
      lastPlaying: false,
      lastSpeed: 0,
      lastStep: 0,
      lastTime: 666
    }
  }

  create(): void 
  {
    this.road = this.scene.launch(roadScene).scene
    this.marge = this.scene.launch(margeScene).scene
    this.phone = this.scene.launch(phoneScene).scene
    this.tour = this.scene.launch(tourScene).scene
    this.rearview = this.scene.launch(rearviewScene).scene

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

    let nextTime = (this.state.step % 11 == 0)
    if (nextTime) this.timeIncrement()

    this.buffer.lastStep = this.state.step
    return this.state.step
  }

  timeIncrement(): number[]
  {
    let hour = this.state.hour
    let day = this.state.day
    let month = this.state.month

    hour ++
    if (hour > 23) 
    {
      hour = 0
      day ++
      switch(month)
      {
        //31 days
        case 1: case 3: case 5: case 7: case 8: case 10:
          if (day >= 31)
          {
            month ++
            day = 0
          }
          day ++
        break;
        //30 days
        case 4: case 6: case 8: case 9: case 11:
          if (day >= 30)
          {
            month ++
            day = 0
          }
          day ++
        break;
        //28 days
        case 2:
          if (day >= 28)
          {
            month ++
            day = 0
          }
          day ++
        break;
        //end of year
        case 12:
          if (day >= 31)
          {
            month = 1
            day = 0
          }
          day ++
        break;
      }
    }

    this.state.month = month
    this.state.day = day
    this.state.hour = hour
    
    return [ month, day, hour ]
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