import { Scene } from 'phaser';
import { scenes, markSceneReady } from '../../app';
import { GameObjects } from 'phaser';
import { BandMember, Tamagotchi } from '../tamagotchi/tamagotchi';
import DynamicSprite from '../../data-types/dynamicsprite';

export default class Rearview extends Scene
{
    constants: object
    state: object

    rearviewSprite: DynamicSprite
    returnSprite: DynamicSprite

    bandMembers: Tamagotchi[]
    bandContainer: Phaser.GameObjects.Container

    constructor()
    {
        super({
            key: "RearviewScene"
        })
    }

    preload()
    {
        this.load.image('rearview', './assets/image/marge/rearview.png')

        this.bandContainer = new Phaser.GameObjects.Container(this)
    }

    create()
    {
        // Signal that this scene is ready
        markSceneReady('rearview')

        this.bandMembers =
        [
          new Tamagotchi(BandMember.Cora, this.bandContainer),
          new Tamagotchi(BandMember.John, this.bandContainer),
          new Tamagotchi(BandMember.Mike, this.bandContainer),
          new Tamagotchi(BandMember.Mitch, this.bandContainer),
          new Tamagotchi(BandMember.Stanli, this.bandContainer)
        ]
        this.bandMembers.forEach(
        (member: Tamagotchi) => {
            this.game.scene.add(member.key as string, member, true)
        })
    }

    update()
    {
    }
}