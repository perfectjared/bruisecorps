// Hydra visual effects integration system
import { AppData } from '../config/app-config'

export function setupHydraEffects(appData: AppData): void {
  appData.hydraFrame = document.getElementById('hydra-container') as HTMLIFrameElement;
  
  window.addEventListener('message', (event) => {
    if (event.source === appData.hydraFrame?.contentWindow && event.data.type === 'hydra-ready') {
      // Hydra is ready
      console.log('Hydra effects system ready')
    }
  });
}

export function sendToHydra(appData: AppData, data: any): void {
  if (appData.hydraFrame?.contentWindow) {
    appData.hydraFrame.contentWindow.postMessage(data, '*');
  }
}

export function sendSynthDataToHydra(
  appData: AppData, 
  data: { bpm?: number, step?: number, volume?: number, frequency?: number }
): void {
  sendToHydra(appData, { type: 'hydra-synth-data', data });
}

export function sendPointerToHydra(appData: AppData, x: number, y: number, pressed: boolean): void {
  sendToHydra(appData, { 
    type: 'hydra-pointer', 
    x: x / window.innerWidth,
    y: y / window.innerHeight,
    pressed 
  });
}

export function sendGameDataToHydra(
  appData: AppData, 
  data: { scene?: string, level?: number, speed?: number, intensity?: number, position?: number }
): void {
  sendToHydra(appData, { type: 'hydra-game-data', data });
}
