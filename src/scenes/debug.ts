import { Scene } from 'phaser';
import { macroGUI, mesoGUI, microGUI, scenes } from '../app';
import { Tamagotchi } from './game/marge/rearview/tamagotchi';

export default class Debug extends Scene 
{
  margeState : any

  constructor() {
    super({
      key: 'DebugScene'
    });
  }

  preload(): void {
    
  }

  create(): void {
    let gameState = scenes.game.state
    let margeState = scenes.marge.state

    {
      const appFolder = macroGUI.addFolder('app')
      const gameFolder = macroGUI.addFolder('game')
      const playerFolder = macroGUI.addFolder('player')

      appFolder.add(gameState, 'started', false)
      appFolder.open()

      gameFolder.add(gameState, 'playing', false)
      gameFolder.add(gameState, 'step', 0, 256, 1)
      gameFolder.add(gameState, 'speed', 60, 240, 1)
      gameFolder.open()

      playerFolder.add(gameState, 'health', 0, 100, .1)
      playerFolder.add(gameState, 'progress', 0, 100, 1)
      playerFolder.add(gameState, 'monthlyListeners', 0, 1000000000, 1)
      playerFolder.open()

      let timeFolder = gameFolder.addFolder('time')
      timeFolder.add(gameState, 'hour', 0, 23, 1)
      timeFolder.add(gameState, 'date', 0, 1231, 1)
      timeFolder.open()
    }

    {
      const margeFolder = mesoGUI.addFolder('marge')
      margeFolder.add(margeState.shifter, 'gear' as keyof Object, 0, 4, 1)
      margeFolder.add(margeState.indicator, 'signal', false)
      margeFolder.open()

      let resourcesFolder = mesoGUI.addFolder('resources')
      resourcesFolder.add(gameState.resources, 'pussy', 0, 10, 1)
      resourcesFolder.add(gameState.resources, 'money', 0, 99999, 1)
      resourcesFolder.add(gameState.resources, 'weed', 0, 10, 1)
      resourcesFolder.add(gameState.resources, 'hotdogs', 0, 10, 1)
      resourcesFolder.open()

      const tourFolder = mesoGUI.addFolder('tour')
      tourFolder.add(gameState, 'lastShow')
      tourFolder.add(gameState, 'nextShow')
      tourFolder.add(gameState, 'nextDate', 0, 1231, 1)
      tourFolder.add(gameState.tour.shows[2], 'timeTo', 0, 100, .01)
      tourFolder.add(gameState, 'showsLeft')
      tourFolder.open()
    }

    {
      const bandFolder = microGUI.addFolder('band')
      let bandFolders : any[] = []
      let coraFolder = bandFolder.addFolder('cora')
      bandFolders.push(coraFolder)
      coraFolder.open()
      // bandFolders.push(bandFolder.addFolder('john'))
      // bandFolders.push(bandFolder.addFolder('mike'))
      // bandFolders.push(bandFolder.addFolder('mitch'))
      // bandFolders.push(bandFolder.addFolder('stanli'))
      bandFolder.open()
  
      let iterator = 0
      let tamagotchis = scenes.rearview.bandMembers
      bandFolders.forEach((folder: any) =>
      {
        folder.add(tamagotchis[iterator].state, 'hunger' as keyof Object, 0, 100, 1)
        folder.add(tamagotchis[iterator].state, 'bathroom' as keyof Object, 0, 100, 1)
        folder.add(tamagotchis[iterator].state, 'bored' as keyof Object, 0, 100, 1)
        iterator++
      })
      bandFolders[0].open()
    }
  }

  update(): void {
    macroGUI.updateDisplay()
  }
}