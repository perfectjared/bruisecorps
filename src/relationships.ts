import { gameScene, margeScene, roadScene } from './app'
import { Scene } from 'phaser'
import { Tuple } from './data-types'

export interface Relationship
{
    from: any
    to: any
    functions: any
}