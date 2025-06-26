import { Scene } from 'phaser';
import { scenes } from '../../app';
import { GameObjects } from 'phaser';
import { BandMember, Tamagotchi } from '../tamagotchi/tamagotchi';
import DynamicSprite from '../../data-types/dynamicsprite';
import CameraManager from '../cameramanager';

export default class Rearview extends Scene
{
    constants: object
    state: object

    rearviewSprite: DynamicSprite
    returnSprite: DynamicSprite

    bandMembers: Tamagotchi[]
    bandContainer: Phaser.GameObjects.Container

    cameraManager: CameraManager
    cameraTarget: DynamicSprite

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

        this.cameraTarget = new DynamicSprite(this,
            {
                x: '150%',
                y: '50%',
                width: '1%',
                heigth: '1%'
            }
        )

        this.rearviewSprite = new DynamicSprite(this,
            {
                x: '50%',
                y: '10%',
                width: '85%',
                height: '27%'
            }
        )
        this.rearviewSprite.sprite.setInteractive()
        this.rearviewSprite.sprite.on('pointerdown', () =>
        {

        })
        this.rearviewSprite.sprite.on('pointerup', () =>
        {
            this.cameraManager.setFollow(this.cameraTarget.sprite, 'game')
        })

        this.returnSprite = new DynamicSprite(this,
            {
                x: '120%',
                y: '10%',
                width: '20%',
                height: '20%'
            }
        )
        this.returnSprite.sprite.setInteractive()
        this.returnSprite.sprite.on('pointerup', () =>
        {
            this.cameraManager.setFollow(scenes.marge.constants.cameraTarget.sprite, 'game')
        })
    }

    create()
    {
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
        this.cameraManager = scenes.game.buffer.cameraManager
        this.cameraManager.add('rearview', this.cameras.main,
            {
                parallax: 0.5
            }
        )
    }

    update()
    {
    }
}