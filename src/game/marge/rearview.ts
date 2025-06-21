import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import { BandMember, Tamagotchi } from '../tamagotchi';
import ReactiveSprite from '../../../data-types/dynamicsprite';
import DynamicSprite from '../../../data-types/dynamicsprite';

export default class Rearview extends Scene
{
    renderSettings: any

    constants: object
    state: object

    bandMembers: Tamagotchi[]

    bandContainer: GameObjects.Container
    rearviewSprite: ReactiveSprite


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
        this.rearviewSprite = new DynamicSprite(this, 'rearview', 
            {
                origin:
                {
                    x: 0.5,
                    y: 0.25
                },
                x: 0.5,
                y: 0.05,
                width: 1,
                maxScale: 1.5,
                minScale: 0.3
            }
        )

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

    }
}