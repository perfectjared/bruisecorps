import { appState, scenes } from "../app"

export function placeSprite(sprite, minScale, maxScale, minX, maxX, minY, maxY): void
{
    let height: number = appState.height as number
    let width: number = appState.width as number

    let scale: number = scenes.game.state.scale
    scale = (scale > maxScale) ? maxScale : (scale < minScale) ? minScale : scale

    let scalePosition: number = (scale - minScale) / (maxScale - minScale)
    let newX: number = (((scalePosition - (minX * width)) / ((maxX * width) - (minX * width))))
    let newY: number = (((scalePosition + (minY * height)) / ((maxY * height) + (minY * height))))

    sprite.setScale(scale * window.devicePixelRatio)
    sprite.setPosition(newX, newY)
}

export function placeSpriteRelative(sprite, ): void
{
    
}