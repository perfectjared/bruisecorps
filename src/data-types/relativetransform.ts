import { scenes } from "../app";

export default interface RelativeTransform
{
    sprite?: Phaser.GameObjects.Sprite
    update?: Phaser.Events.EventEmitter
    origin?: 
    {
        x: number,
        y: number
    }
    originalDimensions?:
    {
        x: number,
        y: number
    }
    x?: number;             // Position (0-1 percentage of screen)
    y?: number;             // Position (0-1 percentage of screen)
    width?: number;         // Width (0-1 percentage of screen)
    height?: number;        // Height (0-1 percentage of screen)
    scale?: {
        x: number,
        y: number
    }
    minScale?: number;      // Minimum scale (applies to both axes)
    maxScale?: number;      // Maximum scale (applies to both axes)
}

export function InitializeRelativeTransform(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite, relativeTransform: RelativeTransform = {})
{
    relativeTransform.sprite = sprite
    relativeTransform.update = scene.events.on('update', this.PlaceRelativeTransform(relativeTransform), this)
    PlaceRelativeTransform(relativeTransform);
    scene.scale.on('resize', this.PlaceRelativeTransform(relativeTransform), this)
}

export function PlaceRelativeTransform(relativeTransform: RelativeTransform)
{
    const { width: screenWidth, height: screenHeight } = scenes.game.scale;

    //origin
    if (relativeTransform.origin) this.setOrigin(relativeTransform.origin.x, relativeTransform.origin.y)

    // Position
    if (relativeTransform.x !== undefined) this.x = screenWidth * relativeTransform.x;
    if (relativeTransform.y !== undefined) this.y = screenHeight * relativeTransform.y;

    // Calculate desired scale
    {
        let scaleX = 1;
        let scaleY = 1;

        if (relativeTransform.width !== undefined) {
            scaleX = (screenWidth * relativeTransform.width) / (this.originalDimensions.x || 1);
            if (relativeTransform.scale) relativeTransform.scale.x = scaleX
        }

        if (relativeTransform.height !== undefined) {
            scaleY = (screenHeight * relativeTransform.height) / (this.originalDimensions.y || 1);
            if (relativeTransform.scale) relativeTransform.scale.y = scaleY
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
        
        relativeTransform.sprite?.setSize(scaleX, scaleY)
    }
}