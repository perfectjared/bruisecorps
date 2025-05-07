import { appState, scenes } from "../app"

export function placeSprite(sprite, minX, maxX, minY, maxY): void
{
    let height: number = appState.height as number
    let width: number = appState.width as number

    sprite.setScale(sprite.scale * appState.scaleRatio)
    //sprite.setPosition(newX, newY)
}

export function placeSpriteRelative(sprite: Phaser.GameObjects.Sprite, x, y, width = 0, height = 0): void
{
    let newX = (x * appState.width)
    let newY = (y * appState.height)
    // let scaleX = 1
    // let scaleY = 1
    // if (width != 0)
    // {
    //     let w = sprite.width
    //     let r = appState.width * width
    //     let m = r / w
    //     scaleX *= m
    // }
    // if (height != 0)
    // {
    //     let h = sprite.height
    //     let r = appState.height * height
    //     let m = r / h
    //     scaleY *= m
    // }
    // sprite.setScale(scaleX * appState.scaleRatio, scaleY * appState.scaleRatio)
    sprite.setPosition(newX, newY)
}