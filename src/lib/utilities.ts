import { appState, scenes } from "../app"

export function placeSprite(sprite, minX, maxX, minY, maxY): void
{
    sprite.setScale(sprite.scale * appState.scaleRatio)
}

export function placeSpriteRelative(sprite: Phaser.GameObjects.Sprite, x, y): void
{
    let newX = (x * window.innerWidth)
    let newY = (y * appState.height)
    console.log(appState.width + " " + newX)
    sprite.setScale(appState.scaleRatio)
    sprite.setPosition(newX, newY)
}