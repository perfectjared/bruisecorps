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
    const controlFolder = datGui.addFolder('controls')
    const gameFolder = datGui.addFolder('game')
    const margeFolder = datGui.addFolder('marge')
    const bandFolder = datGui.addFolder('band')

    let gameState = gameScene.state
    let margeState = margeScene.state
    
    controlFolder.add(margeState.shifter, 'gear' as keyof Object, 0, 4, 1)
    controlFolder.add(margeState.indicator, 'signal', false)
    controlFolder.open()

    gameFolder.add(gameState, 'started' as keyof Object, false)
    gameFolder.add(gameState, 'playing' as keyof Object, false)
    gameFolder.add(gameState, 'step' as keyof Object, 0, 256, 1)
    gameFolder.add(gameState, 'speed' as keyof Object, 60, 240, 1)
    gameFolder.open()

    //TODO: these need to come from margeState
    margeFolder.add(gameState, 'health' as keyof Object, 0, 100, 1)
    margeFolder.add(gameState, 'money' as keyof Object, 0, 100, .1)
    margeFolder.add(gameState, 'gear' as keyof Object, 0, 4, 1)
    margeFolder.open()
  }

  update(): void {
    datGui.updateDisplay()
  }
}