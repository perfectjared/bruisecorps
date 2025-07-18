// Focus and window state management system
import { AppData } from '../config/app-config'

let focusTimeout: ReturnType<typeof setTimeout> | null = null

export function setFocus(appData: AppData, focused: boolean, immediate = false): void {
  if (focusTimeout) clearTimeout(focusTimeout)
  
  if (focused) {
    appData.hasFocus = true
  } else if (immediate) {
    appData.hasFocus = false
    appData.pointerActive.active = false
    appData.pointerActive.targetSprite = null
  } else {
    focusTimeout = setTimeout(() => {
      if (!document.hasFocus()) {
        appData.hasFocus = false
        appData.pointerActive.active = false
        appData.pointerActive.targetSprite = null
      }
    }, 100)
  }
}

export function setupWindowEventListeners(appData: AppData, resizeCameras: () => void): void {
  window.addEventListener('focus', () => {
    if (appData.gameStarted) setFocus(appData, true)
  })
  
  window.addEventListener('blur', () => {
    if (appData.gameStarted) setFocus(appData, false)
  })
  
  document.addEventListener('visibilitychange', () => {
    if (appData.gameStarted) setFocus(appData, !document.hidden, true)
  })
  
  window.addEventListener('resize', () => {
    appData.width = window.innerWidth
    appData.height = window.innerHeight
    appData.viewport.width = appData.width
    appData.viewport.height = appData.height
    appData.scaleRatio = window.devicePixelRatio / 3
    resizeCameras()
  })
  
  // Set initial focus state
  appData.hasFocus = !document.hidden && document.hasFocus()
}
