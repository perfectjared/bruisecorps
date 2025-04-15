import { Scene } from 'phaser';
import { datGui, gameScene, margeScene } from '../app';
import { GUI } from 'dat.gui';

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
    const margeFolder = datGui.addFolder('marge')
    const bandFolder = datGui.addFolder('band')

    let gameState = gameScene.state
    let margeState = margeScene.state
    
    
    appFolder.add(gameState, 'started' as keyof Object, false)
    appFolder.open()

    gameFolder.add(gameState, 'playing' as keyof Object, false)
    gameFolder.add(gameState, 'step' as keyof Object, 0, 256, 1)
    gameFolder.add(gameState, 'speed' as keyof Object, 60, 240, 1)
    gameFolder.open()

    margeFolder.add(gameState, 'health' as keyof Object, 0, 100, .1)
    //margeFolder.add(gameState, 'money' as keyof Object, 0, 100, .1)
    margeFolder.add(margeState.shifter, 'gear' as keyof Object, 0, 4, 1)
    //margeFolder.add(margeState.indicator, 'signal', false)
    margeFolder.open()
  }

  update(): void {
    datGui.updateDisplay()
  }
}