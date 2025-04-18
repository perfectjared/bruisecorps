import { Scene } from 'phaser';
import { datGui, gameScene, margeScene, rearviewScene } from '../app';
import { GUI } from 'dat.gui';
import { Tamagotchi } from './game/tamagotchi';

export default class Debug extends Scene {
  control : GUI
  process: GUI
  system: GUI
  feedback: GUI
  debug: GUI
  
  margeState : any

  constructor() {
    super({
      key: 'DebugScene'
    });
  }

  preload(): void {
    
  }

  create(): void {
    const appFolder = datGui.addFolder('app')
    const gameFolder = datGui.addFolder('game')
    const playerFolder = datGui.addFolder('player')
    const margeFolder = datGui.addFolder('marge')
    const tourFolder = datGui.addFolder('tour')
    const bandFolder = datGui.addFolder('band')

    let gameState = gameScene.state
    let margeState = margeScene.state
    
    appFolder.add(gameState, 'started', false)
    appFolder.open()

    gameFolder.add(gameState, 'playing', false)
    gameFolder.add(gameState, 'step', 0, 256, 1)
    gameFolder.add(gameState, 'speed', 60, 240, 1)
    gameFolder.open()

    playerFolder.add(gameState, 'health', 0, 100, .1)
    playerFolder.add(gameState, 'progress', 0, 100, 1)
    playerFolder.add(gameState, 'timeLeft', 0, 100, .01)
    playerFolder.open()

    let timeFolder = playerFolder.addFolder('time')
    timeFolder.add(gameState, 'month', 1, 12, 1)
    timeFolder.add(gameState, 'day', 1, 31, 1)
    timeFolder.add(gameState, 'hour', 0, 23, 1)
    timeFolder.open()

    let resourcesFolder = playerFolder.addFolder('resources')
    resourcesFolder.add(gameState.resources, 'pussy', 0, 10, 1)
    resourcesFolder.add(gameState.resources, 'money', 0, 99999, 1)
    resourcesFolder.add(gameState.resources, 'weed', 0, 10, 1)
    resourcesFolder.add(gameState.resources, 'snacks', 0, 10, 1)
    resourcesFolder.open()
    
    margeFolder.add(margeState.shifter, 'gear' as keyof Object, 0, 4, 1)
    margeFolder.add(margeState.indicator, 'signal', false)
    margeFolder.open()

    let bandFolders : any[] = []
    bandFolders.push(bandFolder.addFolder('cora'))
    bandFolders.push(bandFolder.addFolder('john'))
    bandFolders.push(bandFolder.addFolder('mike'))
    bandFolders.push(bandFolder.addFolder('mitch'))
    bandFolders.push(bandFolder.addFolder('stanli'))
    //bandFolder.open()

    let iterator = 0
    let tamagotchis = rearviewScene.bandMembers
    bandFolders.forEach((folder: any) =>
    {
      folder.add(tamagotchis[iterator].state, 'hunger' as keyof Object, 0, 100, 1)
      folder.add(tamagotchis[iterator].state, 'bathroom' as keyof Object, 0, 100, 1)
      folder.add(tamagotchis[iterator].state, 'bored' as keyof Object, 0, 100, 1)
      //folder.open()
      iterator++
    })

    tourFolder.add(gameState, 'lastShow')
    tourFolder.add(gameState, 'nextShow')
    tourFolder.add(gameState.tour.shows[2], 'timeTo', 0, 100, .01)
    tourFolder.add(gameState, 'showsLeft')
    
    tourFolder.open()
  }

  update(): void {
    datGui.updateDisplay()
  }
}