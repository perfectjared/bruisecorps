// Configuration and interfaces for the application
import { Game } from 'phaser'

export interface AppData {
  game: Game,
  gameConfig: Phaser.Types.Core.GameConfig,
  width: number,
  height: number,
  scaleRatio: number,
  audioStarted: boolean,
  hasFocus: boolean,
  gameStarted: boolean,
  playing: boolean,
  lastPointerTime: number,
  pointerActive: {
    active: boolean,
    targetSprite: Phaser.GameObjects.Sprite | null
  },
  viewport: Phaser.Geom.Rectangle,
  deckerFrame: HTMLIFrameElement | null,
  hydraFrame: HTMLIFrameElement | null
}

// Global app data instance
let globalAppData: AppData | null = null

export const setGlobalAppData = (appData: AppData): void => {
  globalAppData = appData
}

export const getAppData = (): AppData => {
  if (!globalAppData) {
    throw new Error('App data not initialized. Call setGlobalAppData first.')
  }
  return globalAppData
}

export const createInitialAppData = (): AppData => ({
  game: null,
  gameConfig: null,
  width: 0,
  height: 0,
  scaleRatio: window.devicePixelRatio / 3,
  audioStarted: false,
  hasFocus: false,
  gameStarted: false,
  playing: false,
  lastPointerTime: 0,
  pointerActive: {
    active: false,
    targetSprite: null
  },
  viewport: new Phaser.Geom.Rectangle(0, 0, window.innerWidth, window.innerHeight),
  deckerFrame: null,
  hydraFrame: null
})

export interface CameraSystem {
  marge: Phaser.Cameras.Scene2D.Camera | null,
  rearview: Phaser.Cameras.Scene2D.Camera | null
}

export interface SceneReadyState {
  marge: boolean,
  rearview: boolean
}
