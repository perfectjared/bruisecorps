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
    
    appFolder.add(gameState, 'started' as keyof Object, false)
    appFolder.open()

    gameFolder.add(gameState, 'playing' as keyof Object, false)
    gameFolder.add(gameState, 'step' as keyof Object, 0, 256, 1)
    gameFolder.add(gameState, 'speed' as keyof Object, 60, 240, 1)
    gameFolder.open()

    playerFolder.add(gameState, 'health' as keyof Object, 0, 100, .1)
    //playerFolder.add(gameState, 'money' as keyof Object, 0, integer max or whatever, 1)
    playerFolder.add(gameState, 'progress' as keyof Object, 0, 100, 1)
    playerFolder.open()
    
    margeFolder.add(margeState.shifter, 'gear' as keyof Object, 0, 4, 1)
    margeFolder.add(margeState.indicator, 'signal', false)
    margeFolder.open()

    let bandFolders : any[] = []
    bandFolders.push(bandFolder.addFolder('cora'))
    bandFolders.push(bandFolder.addFolder('john'))
    bandFolders.push(bandFolder.addFolder('mike'))
    bandFolders.push(bandFolder.addFolder('mitch'))
    bandFolders.push(bandFolder.addFolder('stanli'))

    let iterator = 0
    let tamagotchis = rearviewScene.bandMembers
    bandFolders.forEach((folder: any) =>
    {
      folder.add(tamagotchis[iterator].state, 'hunger' as keyof Object, 0, 100, 1)
      folder.add(tamagotchis[iterator].state, 'bathroom' as keyof Object, 0, 100, 1)
      folder.add(tamagotchis[iterator].state, 'bored' as keyof Object, 0, 100, 1)
      iterator++
    })
  }

  update(): void {
    datGui.updateDisplay()
  }
}