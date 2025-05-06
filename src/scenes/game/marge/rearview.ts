import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { BandMember, Tamagotchi } from './rearview/tamagotchi';
import { routing } from '../../../app';
import { appState } from '../../../app';
import { placeSprite } from '../../../lib/utilities';

export default class Rearview extends Scene
{
    renderSettings: any

    constants: object
    state: object

    bandMembers: Tamagotchi[]

    bandContainer: GameObjects.Container
    rearviewSprite: GameObjects.Sprite


    constructor()
    {
        super({
            key: "RearviewScene"
        })
    }

    preload()
    {
        this.renderSettings =
        {
          width: this.sys.game.config.width,
          height: this.sys.game.config.height
        }
        this.load.image('rearview', './assets/image/marge/rearview.png')
    }

    create()
    {
        this.rearviewSprite = this.add.sprite(0, 0, 'rearview')
        this.bandContainer = new GameObjects.Container(this, this.rearviewSprite.x, this.rearviewSprite.y).setSize(this.rearviewSprite.width, this.rearviewSprite.height)
        this.bandMembers = 
        [
          new Tamagotchi(BandMember.Cora, this.bandContainer),
          new Tamagotchi(BandMember.John, this.bandContainer),
          new Tamagotchi(BandMember.Mike, this.bandContainer),
          new Tamagotchi(BandMember.Mitch, this.bandContainer),
          new Tamagotchi(BandMember.Stanli, this.bandContainer), 
        ]
        this.bandMembers.forEach(
        (member: Tamagotchi) => {
            this.game.scene.add(member.key as string, member, true)
        })
    }

    update()
    {
        this.placeRearview()
    }

      //TODO trigger on window resize
    placeRearview()
    {
        this.rearviewSprite.setOrigin(0.5, 0)
        let minScale = 0.1
        let maxScale = 1
        let minX = 0
        let maxX = appState.width / 2
        let minY = 0
        let maxY = 0
        placeSprite(this.rearviewSprite, minScale, maxScale, minX, maxX, minY, maxY)
    }
}