// Scene-specific event handling and setup
export function setupMargeEventListeners(margeScene: any): void {
  // Vehicle control events from Marge scene
  margeScene.events.on('significant-position-change', (data: any) => {
    console.log(`Significant driving event: position ${data.position.toFixed(3)}`);
    // This could trigger story events or game state changes
  });
  
  margeScene.events.on('gear-changed', (data: any) => {
    console.log(`Gear changed to: ${data.newValue.toFixed(2)}`);
    // Only create commands for meaningful gear changes (like first time putting in gear)
    if (data.oldValue >= 1 && data.newValue < 1) {
      console.log('Player first engaged gear - significant game event');
      // This could trigger story progression
    }
  });
}

export function handleHealthChange(healthValue: number, sendToDecker: (type: string, data: any) => void): void {
  sendToDecker('healthChanged', { health: healthValue })
}
