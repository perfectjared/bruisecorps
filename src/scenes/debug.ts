import { Scene } from 'phaser';
import { datGui, gameScene, margeScene } from '../app';
import { GUI } from 'dat.gui';

export class Debug extends Scene {
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
    const controlFolder = datGui.addFolder('control')
    const processFolder = datGui.addFolder('process')
    const systemFolder = datGui.addFolder('system')
    const debugFolder = datGui.addFolder('debug')

    let gameState = gameScene.state
    let margeState = margeScene.state
    
    controlFolder.add(margeState.shifter, 'gear' as keyof Object, 0, 4, 1)
    controlFolder.add(margeState.indicator, 'signal', false)
    controlFolder.open()

    processFolder.add(gameState, 'started' as keyof Object, false)
    processFolder.add(gameState, 'playing' as keyof Object, false)
    processFolder.open()

    systemFolder.add(gameState, 'health' as keyof Object, 0, 100, 1)
    systemFolder.add(gameState, 'money' as keyof Object, 0, 100, .1)
    systemFolder.add(gameState, 'speed' as keyof Object, 0, 100, .1)
    systemFolder.add(gameState, 'gear' as keyof Object, 0, 4, 1)
    systemFolder.open()
  }

  update(): void {
    datGui.updateDisplay()
  }
}