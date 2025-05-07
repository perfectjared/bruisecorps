import { appState, scenes } from "../app"

export function placeReactiveSprite
(
sprite: Phaser.GameObjects.Sprite, 
options:
{
    x?: number;             // Position (0-1 percentage of screen)
    y?: number;             // Position (0-1 percentage of screen)
    width?: number;         // Width (0-1 percentage of screen)
    height?: number;        // Height (0-1 percentage of screen)
    minScale?: number;      // Minimum scale (applies to both axes)
    maxScale?: number;      // Maximum scale (applies to both axes)
}
): void
{
    let scene = scenes.game
       // Store original dimensions
       const origWidth = sprite.displayWidth;
       const origHeight = sprite.displayHeight;
   
       const update = () => {
           const { width: screenWidth, height: screenHeight } = scene.scale;
   
           // Position
           if (options.x !== undefined) sprite.x = screenWidth * options.x;
           if (options.y !== undefined) sprite.y = screenHeight * options.y;
   
           // Calculate desired scale
           let scaleX = 1;
           let scaleY = 1;
   
           if (options.width !== undefined) {
               scaleX = (screenWidth * options.width) / origWidth;
           }
   
           if (options.height !== undefined) {
               scaleY = (screenHeight * options.height) / origHeight;
           }
   
           // Maintain aspect if only one dimension specified
           if (options.width !== undefined && options.height === undefined) {
               scaleY = scaleX;
           } else if (options.height !== undefined && options.width === undefined) {
               scaleX = scaleY;
           }
   
           // Apply constraints
           if (options.minScale !== undefined) {
               scaleX = Math.max(scaleX, options.minScale);
               scaleY = Math.max(scaleY, options.minScale);
           }
   
           if (options.maxScale !== undefined) {
               scaleX = Math.min(scaleX, options.maxScale);
               scaleY = Math.min(scaleY, options.maxScale);
           }
   
           sprite.setScale(scaleX, scaleY);
       };
   
       // Initial update
       update();

       scenes.game.scale.on('resize', update)
}