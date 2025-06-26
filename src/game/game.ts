import { appData, scenes } from '../app'
import { Scene, Physics } from 'phaser';
import DynamicSprite from '../data-types/dynamicsprite';
import CameraManager from './cameramanager'

import * as trashTour from '../data/trsh-tour.json'
export default class Game extends Scene 
{
  constants : any
  state : 
  {
    playing
    speed

    health
    progress
    monthlyListeners

    resources :
    {
      pussy
      money
      weed
      hotdogs
      pissjugs
    }

    month
    day
    hour
    date

    tour //should be on tour
    showIterator //
    lastShow //
    nextShow //
    nextDate //
    showsLeft //
  }
  buffer : 
  {
    dynamicSprites: DynamicSprite[],
    lastPlaying: boolean,
    lastSpeed: number,
    lastStep: number,
    lastTime: number,
    input:
    {
      touchingObject: Phaser.GameObjects.GameObject | null
    }
    cameraManager: CameraManager
  }

  world: Physics.Matter.World
  
  tour: any
  marge: Scene
  phone: Scene

  constructor() 
  {
    super({
      key: 'GameScene'
    });
  }
  
  preload(): void
  {
    this.constants = //todo MOVE TO JSON
    {
      speedMin: 60,
      speedMax: 240,
      healthNumbers: { min: 0, max: 100, start: 86, step : 1 },
      needsNumbers: { min: 0, max: 100, start: 0, step : 1 }, //tamagotchis needs
      bleedValues: [0, .1, .4, 1.6, 3.1],
      speedNumbers: { min: 60, max: 240, start: 60, step: 1 },
      stepNumbers: { min: 0, max: 256, start: 0, 
        step: function() 
        { 
          this.min +=1
        }
      },
      progressNumbers: { min: 0, max: 100, start: 0, step: .01 },
      progressValues: [0, 1, 2, 4, 8],
      cameraTarget: new DynamicSprite(this,
        {
          x: '50%',
          y: '50%',
          width: '1%',
          height: '1%'
        }
      )
    }

    this.state = //todo STARTING VALUES IN JSON
    {
      playing: false,

      speed: this.constants.speedNumbers.start,

      health: this.constants.healthNumbers.start,
      progress: 0, //0 - 100, .1 steps, interpreted into miles with tour state
      monthlyListeners: 2000,

      resources:
      {
        pussy: 0,
        money: 100,
        weed: 3,
        hotdogs: 5,
        pissjugs: 0,
      },

      tour: {},
      showIterator: 1,
      lastShow: "",
      nextShow: "",
      nextDate: 666,
      showsLeft: 69,
      
      month: 4,
      day: 16,
      hour: 8,
      date: 416
    }


    let tour = trashTour.shows //array
    this.state.tour.shows = tour
    this.state.lastShow = tour[1].city
    this.state.nextShow = tour[2].city
    this.state.nextDate = tour[2].date
    this.state.showsLeft = tour.length - this.state.showIterator

    this.buffer =
    {
      dynamicSprites: [],
      lastPlaying: false,
      lastSpeed: 0,
      lastStep: 0,
      lastTime: 666,
      input: 
      {
        touchingObject: null
      },
      cameraManager: new CameraManager(this)
    }

    //this.scene.launch(scenes.road).scene
    this.scene.launch(scenes.rearview).scene
    this.scene.launch(scenes.marge).scene
    this.scene.launch(scenes.debug).scene
  }

  create(): void 
  {
    this.buffer.cameraManager.add('game', this.cameras.main,
      {
        main: true
      }
    ).setFollow(this.constants.cameraTarget.sprite)
  }

  startGame(): void
  {
    console.log("game: game playing")
    this.state.playing = true
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
    let nextStep = (this.buffer.lastStep != scenes.synth.state.step)
    if (nextStep) this.step()
  }

  step(): number
  {
    //this.healthBleed()
    //this.progressIncrement()

    let nextTime = (scenes.synth.state.step % 11 == 0)
    if (nextTime) this.timeIncrement()

    this.buffer.lastStep = scenes.synth.state.step
    return scenes.synth.state.step
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
    this.state.date = (month * 100) + (day)
    
    return [ month, day, hour ]
  }

  healthBleed(): number
  {
    let bleedAmount = this.constants.bleedValues[Math.round(Math.random() * scenes.marge.state.shifter.gear)]
    this.state.health -= bleedAmount
    console.log('bleed ' + bleedAmount + ', health ' + this.state.health)
    return this.state.health
  }

  progressIncrement(): number
  {
    let progressAmount = this.constants.progressValues[scenes.marge.state.shifter.gear]
    this.state.progress += progressAmount
    console.log('progress ' + progressAmount)
    return this.state.progress
  }

  process(): void
  {
    if (!appData.audioStarted) 
    {
      this.state.playing = false
      return
    }
    //if (!this.state.playing) return TODO: put back

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

  }

  feedback(): void
  {
    this.buffer.cameraManager.update()
  }

  debug(): void
  {
    
  }
}