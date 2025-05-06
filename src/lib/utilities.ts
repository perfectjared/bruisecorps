import { appState, scenes } from "../app"

export function placeSprite(sprite, minScale, maxScale, minX, maxX, minY, maxY): void
{
    let height: number = appState.height as number
    let width: number = appState.width as number

    let scale: number = scenes.game.state.scale
    scale = (scale > maxScale) ? maxScale : (scale < minScale) ? minScale : scale

    let scalePosition: number = (scale - minScale) / (maxScale - minScale)
    
    if (minX == 0) minX = 0.000000001
    if (minY == 0) minX = 0.000000001
    
    let newX: number = (((scalePosition - (minX * width)) / ((maxX * width) - (minX * width))))
    let newY: number = (((scalePosition + (minY * height)) / ((maxY * height) + (minY * height))))

    sprite.setScale(scale * appState.scaleRatio)
    sprite.setPosition(newX, newY)
}

export function placeSpriteRelative(sprite, x, y, cutoff): void
{
    let newX = x * appState.width
    let newY = y * appState.height

}