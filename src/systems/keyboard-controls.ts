// Keyboard controls and input handling system
import { AppData } from '../config/app-config'

export function setupKeyboardControls(
  appData: AppData,
  switchToMargeCamera: () => void,
  switchToRearviewCamera: () => void
): void {
  document.addEventListener('keydown', (event) => {
    if (!appData.gameStarted) return
    
    if (!appData.audioStarted) appData.audioStarted = true
    
    switch (event.key) {
      case '1':
        switchToMargeCamera()
        break
      case '2':
        switchToRearviewCamera()
        break
    }
  })
}
