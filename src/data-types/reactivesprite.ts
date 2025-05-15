import { scenes } from "../app";

export interface RelativeTransform
{
    origin?: 
    {
        x: number,
        y: number
    }
    x?: number;             // Position (0-1 percentage of screen)
    y?: number;             // Position (0-1 percentage of screen)
    width?: number;         // Width (0-1 percentage of screen)
    height?: number;        // Height (0-1 percentage of screen)
    minScale?: number;      // Minimum scale (applies to both axes)
    maxScale?: number;      // Maximum scale (applies to both axes)
}

export default class ReactiveSprite extends Phaser.GameObjects.Sprite
{
    constructor(scene, texture, relativeTransform: RelativeTransform)
    {
        super(scene, 0, 0, texture)
        scene.add.existing(this)
        let gameScene = scenes.game

        // Store original dimensions
        const origWidth = this.displayWidth;
        const origHeight = this.displayHeight;
        
        const placeRelative = () => {
            const { width: screenWidth, height: screenHeight } = gameScene.scale;
    
            // Position
            if (relativeTransform.x !== undefined) this.x = screenWidth * relativeTransform.x;
            if (relativeTransform.y !== undefined) this.y = screenHeight * relativeTransform.y;
    
            // Calculate desired scale
            let scaleX = 1;
            let scaleY = 1;
    
            if (relativeTransform.width !== undefined) {
                scaleX = (screenWidth * relativeTransform.width) / origWidth;
            }
    
            if (relativeTransform.height !== undefined) {
                scaleY = (screenHeight * relativeTransform.height) / origHeight;
            }
    
            // Maintain aspect if only one dimension specified
            if (relativeTransform.width !== undefined && relativeTransform.height === undefined) {
                scaleY = scaleX;
            } else if (relativeTransform.height !== undefined && relativeTransform.width === undefined) {
                scaleX = scaleY;
            }
    
            // Apply constraints
            if (relativeTransform.minScale !== undefined) {
                scaleX = Math.max(scaleX, relativeTransform.minScale);
                scaleY = Math.max(scaleY, relativeTransform.minScale);
            }
    
            if (relativeTransform.maxScale !== undefined) {
                scaleX = Math.min(scaleX, relativeTransform.maxScale);
                scaleY = Math.min(scaleY, relativeTransform.maxScale);
            }
    
            this.setScale(scaleX, scaleY);
        };

        // Initial update
        placeRelative();
        scenes.game.scale.on('resize', placeRelative)
    }   
}