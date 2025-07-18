// Pointer and touch tracking system for game interactions
import { AppData } from '../config/app-config'

export function setupPointerTracking(
  appData: AppData,
  sendPointerToHydra: (x: number, y: number, pressed: boolean) => void
): void {
  function initializeAudio() {
    if (appData.gameStarted && !appData.audioStarted) {
      appData.audioStarted = true
    }
  }

  function getSpriteUnderPointer(x: number, y: number): Phaser.GameObjects.Sprite | null {
    if (!appData.game) return null
    
    const activeScenes = appData.game.scene.getScenes(true)
    
    for (const scene of activeScenes) {
      if (!scene.cameras.main) continue
      
      const camera = scene.cameras.main
      const worldX = camera.scrollX + (x - camera.x) / camera.zoom
      const worldY = camera.scrollY + (y - camera.y) / camera.zoom
      
      let foundSprite: Phaser.GameObjects.Sprite | null = null
      
      scene.children.list.forEach((child) => {
        if (child instanceof Phaser.GameObjects.Sprite && child.visible && child.active) {
          const bounds = child.getBounds()
          if (bounds.contains(worldX, worldY)) {
            foundSprite = child
          }
        }
      })
      
      if (foundSprite) return foundSprite
    }
    
    return null
  }

  // Mouse and pointer events
  document.addEventListener('pointerdown', (event) => {
    initializeAudio()
    appData.pointerActive.active = true
    appData.lastPointerTime = Date.now()
  })
  
  document.addEventListener('pointerup', (event) => {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
    sendPointerToHydra(event.clientX, event.clientY, false)
  })
  
  document.addEventListener('pointermove', (event) => {
    appData.lastPointerTime = Date.now()
    sendPointerToHydra(event.clientX, event.clientY, appData.pointerActive.active)
  })
  
  // Touch events
  document.addEventListener('touchstart', (event) => {
    initializeAudio()
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      const sprite = getSpriteUnderPointer(touch.clientX, touch.clientY)
      appData.pointerActive.active = true
      appData.pointerActive.targetSprite = sprite
      appData.lastPointerTime = Date.now()
      sendPointerToHydra(touch.clientX, touch.clientY, true)
    }
  })
  
  document.addEventListener('touchend', (event) => {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
    if (event.changedTouches.length > 0) {
      const touch = event.changedTouches[0]
      sendPointerToHydra(touch.clientX, touch.clientY, false)
    }
  })
  
  document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      appData.lastPointerTime = Date.now()
      sendPointerToHydra(touch.clientX, touch.clientY, appData.pointerActive.active)
    }
  })
  
  document.addEventListener('mouseleave', () => {
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  })
}

export function isPointerActive(appData: AppData): boolean {
  return appData.pointerActive.active
}

export function getPointerTarget(appData: AppData): Phaser.GameObjects.Sprite | null {
  return appData.pointerActive.targetSprite
}

export function isPointerOnSprite(
  appData: AppData,
  spriteOrTexture?: Phaser.GameObjects.Sprite | string
): boolean {
  if (!appData.pointerActive.active || !appData.pointerActive.targetSprite) {
    return false
  }
  
  if (!spriteOrTexture) {
    return true
  }
  
  if (typeof spriteOrTexture === 'string') {
    return appData.pointerActive.targetSprite.texture.key === spriteOrTexture
  }
  
  return appData.pointerActive.targetSprite === spriteOrTexture
}
