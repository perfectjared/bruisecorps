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
    //sprite.setScale(appState.scaleRatio)
    sprite.setPosition(newX, newY)
}

export function scaleSpriteRelative(sprite: Phaser.GameObjects.Sprite, width = null, height = null, maintainAspect = true, useOriginalSize = true): void
{
    let img = sprite.texture.getDataSourceImage()
    let refWidth = img.width
    let refHeight = img.height

    let scaleX = 1
    let scaleY = 1

    if (width != null)
    {
        let targetWidth = window.innerWidth * width
        scaleX = targetWidth / sprite.displayWidth
    }

    if (height != null)
    {
        let targetHeight = window.innerHeight * height
        scaleY = targetHeight / sprite.displayHeight
    }

    if (maintainAspect)
    {
        if (width !== null && height === null) {
            scaleY = scaleX;
        } else if (height !== null && width === null) {
            scaleX = scaleY;
        }
    }

    sprite.setScale(scaleX, scaleY)
}