// Camera management system for switching between game views
import { AppData } from '../config/app-config'

interface Cameras {
  marge: Phaser.Cameras.Scene2D.Camera | null
  rearview: Phaser.Cameras.Scene2D.Camera | null
}

interface ScenesReady {
  marge: boolean
  rearview: boolean
}

const cameras: Cameras = {
  marge: null,
  rearview: null
}

const scenesReady: ScenesReady = {
  marge: false,
  rearview: false
}

// Store appData reference
let appDataRef: AppData | null = null

function setAppData(appData: AppData): void {
  appDataRef = appData
}

export function markSceneReady(sceneName: keyof ScenesReady, setupEventListeners?: () => void): void {
  if (scenesReady[sceneName]) return

  scenesReady[sceneName] = true

  // Set up event listeners when specific scenes are ready
  if (sceneName === 'marge' && setupEventListeners) {
    setupEventListeners()
  }

  if (Object.values(scenesReady).every(ready => ready)) {
    initializeCameras(appDataRef)
  }
}

export function initializeCameras(appData?: AppData): void {
  if (!appData?.game) return

  Object.keys(cameras).forEach(key => {
    const cameraKey = key as keyof Cameras
    if (!cameras[cameraKey]) {
      let sceneName = ''
      switch (key) {
        case 'marge':
          sceneName = 'MargeScene'
          break
        case 'rearview':
          sceneName = 'RearviewScene'
          break
      }

      if (sceneName) {
        const scene = appData.game.scene.getScene(sceneName)
        if (scene) {
          const camera = scene.cameras.main
          camera.setViewport(0, 0, appData.width, appData.height)
          cameras[cameraKey] = camera
        }
      }
    } else {
      const camera = cameras[cameraKey]
      if (camera) {
        camera.setViewport(0, 0, appData.width, appData.height)
      }
    }  })

  if (cameras.marge && cameras.rearview) {
    cameras.marge.setVisible(true)
    cameras.marge.setBackgroundColor(0x004400) // Dark green for marge by default
    cameras.rearview.setVisible(false)
  }
}

export function resizeCameras(appData: AppData): void {
  Object.keys(cameras).forEach(key => {
    const camera = cameras[key as keyof Cameras]
    if (camera) {
      camera.setViewport(0, 0, appData.width, appData.height)
    }
  })
}

export function switchToMargeCamera(sendToDecker?: (type: string, data: any) => void): void {
  console.log('🎥 Switching to Marge camera', { marge: cameras.marge, rearview: cameras.rearview })
  if (cameras.marge && cameras.rearview) {
    cameras.marge.setVisible(true)
    cameras.rearview.setVisible(false)
    // Add background color to make it more obvious
    cameras.marge.setBackgroundColor(0x004400) // Dark green
    console.log('✅ Marge camera visible, rearview hidden')
    // Also switch Decker to marge card
    if (sendToDecker) {
      sendToDecker('switchCard', { card: 'marge' })
    }
  } else {
    console.log('❌ Cameras not initialized properly')
  }
}

export function switchToRearviewCamera(sendToDecker?: (type: string, data: any) => void): void {
  console.log('🎥 Switching to Rearview camera', { marge: cameras.marge, rearview: cameras.rearview })
  if (cameras.marge && cameras.rearview) {
    cameras.marge.setVisible(false)
    cameras.rearview.setVisible(true)
    // Add background color to make it more obvious
    cameras.rearview.setBackgroundColor(0x440000) // Dark red
    console.log('✅ Rearview camera visible, marge hidden')
    // Also switch Decker to rearview card
    if (sendToDecker) {
      sendToDecker('switchCard', { card: 'rearview' })
    }
  } else {
    console.log('❌ Cameras not initialized properly')
  }
}

export function handleCardChange(cardName: string): void {
  // Switch camera view based on card
  if (cardName === 'marge') {
    if (cameras.marge && cameras.rearview) {
      cameras.marge.setVisible(true)
      cameras.rearview.setVisible(false)
    }
  } else if (cardName === 'rearview') {
    if (cameras.marge && cameras.rearview) {
      cameras.marge.setVisible(false)
      cameras.rearview.setVisible(true)
    }
  }
}

export { cameras, setAppData }
