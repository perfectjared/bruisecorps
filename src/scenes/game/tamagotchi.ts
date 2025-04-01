import { Scene } from 'phaser'
import { GameObjects } from 'phaser'

export enum BandMember
{
    Cora,
    John,
    Mike,
    Mitch,
    Stanli
}

export class Tamagotchi extends Scene 
{
    constants: any
    state: any

    bandMember: BandMember
    key: string
    container: GameObjects.Container

    feedButton: GameObjects.Text
    giveButton: GameObjects.Text

    stepButton: GameObjects.Text
    
    bathroomText: GameObjects.Text
    boredText: GameObjects.Text
    hungerText: GameObjects.Text
    
    bathroomValueText: GameObjects.Text
    boredValueText: GameObjects.Text
    hungerValueText: GameObjects.Text
    

    bathroomStep: Function

    constructor(bandMember: BandMember, container: GameObjects.Container)
    {
        super
        ({
            key: 'Tamagotchi' + bandMember
        })
        
        this.bandMember = bandMember
        this.container = container
        this.key = 'Tamagotchi' + bandMember

        this.constants = 
        {
            feedValues: //validation: 5 arrays of 8 numbers
            [
                [5, 10, 20, 20, 20, 33, 33, 50],
                [5, 10, 20, 20, 20, 33, 33, 50],
                [5, 10, 20, 20, 20, 33, 33, 50],
                [5, 10, 20, 20, 20, 33, 33, 50],
                [5, 10, 20, 20, 20, 33, 33, 50]
            ],
            giveValues: //validation: 5 arrays of 5 numbers
            [
                [60, 60, 60, 60, 60],
                [60, 60, 60, 60, 60],
                [60, 60, 60, 60, 60],
                [60, 60, 60, 60, 60],
                [60, 60, 60, 60, 60]
            ],
            bathroomCurve: //validation: 5 arrays of 10 numbers
            [
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 5, 10],
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 5, 10],
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 5, 10],
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 5, 10],
                [0, 0, 0, 0, 1, 1, 1, 1, 2, 5, 10]
            ],
            boredCurve: //validation: 5 arrays of 10 numbers
            [
                [0, 0, 0, 0, 1, 2, 2, 3, 3, 5, 9],
                [0, 0, 0, 0, 1, 2, 2, 3, 3, 5, 9],
                [0, 0, 0, 0, 1, 2, 2, 3, 3, 5, 9],
                [0, 0, 0, 0, 1, 2, 2, 3, 3, 5, 9],
                [0, 0, 0, 0, 1, 2, 2, 3, 3, 5, 9]
            ],
            hungerCurve: //validation: 5 arrays of 10 numbers
            [
                [0, 1, 1, 1, 2, 2, 2, 3, 3, 5, 6],
                [0, 1, 1, 1, 2, 2, 2, 3, 3, 5, 6],
                [0, 1, 1, 1, 2, 2, 2, 3, 3, 5, 6],
                [0, 1, 1, 1, 2, 2, 2, 3, 3, 5, 6],
                [0, 1, 1, 1, 2, 2, 2, 3, 3, 5, 6]
            ],
            name: //validation: the band members' names duh
            [
                "Cora",
                "John",
                "Mike",
                "Mitch",
                "Stanli"
            ],
            position: //validation: 5 objects w/ x: and y:
            [
                {x: 225, y: 10},
                {x: 340, y: 25},
                {x: 465, y: 15},
                {x: 580, y: 5},
                {x: 695, y: 20},
            ]
        }

        this.state = 
        {
            stepAt: 0,
            bathroom: 0,
            bathroomCurveAt: 0,
            bored: 0,
            boredCurveAt: 0,
            hunger: 0,
            hungerCurveAt: 0
        }
    }

    preload()
    {
    }

    create()
    {
        this.addDebugTexts()
    }
    
    update()
    {
        this.control()
        this.process()
        this.system()
        this.feedback()
        this.debug()
    }

    control()
    {

    }

    process()
    {

    }

    system()
    {

    }

    feedback()
    {

    }

    debug()
    {
        //this.graphics.lineStyle(1, 0xFF00FF)
        //this.graphics.arc(this.state.position[this.bandMember].x, this.state.position[this.bandMember].y, 10, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360))
    }

    addDebugTexts()
    {
        let x = this.container.x + this.constants.position[this.bandMember].x
        let y = this.container.y + this.constants.position[this.bandMember].y

        this.feedButton = this.add.text(x + 5, y + 66, '(feed)', { color: '#f6300a'})
        this.feedButton.setInteractive()
        this.feedButton.on('pointerup', 
            () => {
                this.feed()
            }
        )
        this.giveButton = this.add.text(x + 66, y + 66, '(give)', { color: '#f6300a'})
        this.giveButton.setInteractive()
        this.giveButton.on('pointerup',
            () => {
                this.give()
            }
        )

        this.hungerText = this.add.text(x + 12, y + 10, 'hngr:', { color: '#f6a60a'})
        this.boredText = this.add.text(x + 12, y + 28, 'bord:', { color: '#f6a60a'})
        this.bathroomText = this.add.text(x + 12, y + 44, 'poop:', { color: '#f6a60a'})
        
        this.hungerValueText = this.add.text(x + 83, y + 10, '00 %', { color: '#000000'})
        this.boredValueText = this.add.text(x + 83, y + 28, '00 %', { color: '#000000'})
        this.bathroomValueText = this.add.text(x + 83, y + 44, '00 %', { color: '#000000'})

        this.stepButton = this.add.text(x + 5, y + 86, '(step 0)', { color: '#000000'})
        this.stepButton.setInteractive()
        this.stepButton.on('pointerup', 
            () => {
                this.step()
            }
        )
    }

    step(stepAmount: number = 1)
    {
        this.state.stepAt += stepAmount
        this.updateBathroom(stepAmount)
        this.updateBored(stepAmount)
        this.updateHunger(stepAmount)
        this.updatestepButton()
    }

    updatestepButton()
    {
        this.stepButton.text = '(step ' + this.state.stepAt + ')'
    }

    updateTextLocations()
    {
        let x = this.container.x + this.constants.position[this.bandMember].x
        let y = this.container.y + this.constants.position[this.bandMember].y

        this.hungerText.setPosition(x + 12,  y + 10)
        this.boredText.setPosition(x + 12,  y + 28)
        this.bathroomText.setPosition(x + 12,  y + 44)
        this.hungerValueText.setPosition(x + 83,  y + 10)
        this.boredValueText.setPosition(x + 83,  y + 28)
        this.bathroomValueText.setPosition(x + 83,  y + 44)
        this.stepButton.setPosition(x + 5, y + 86)
    }

    updateBathroomValueText()
    {
        this.bathroomValueText.text = 
        (this.state.bathroom >= 10) ?
            (this.state.bathroom > 99) ? "!!" : this.state.bathroom as string : 
        "0" + this.state.bathroom as string
        this.bathroomValueText.text += " %"
    }
    updateBathroom(amount)
    {
        let addToBathroom = this.constants.bathroomCurve[this.bandMember][Math.round(this.state.bathroomCurveAt)]
        this.state.bathroom += addToBathroom
        this.updateBathroomValueText()

        this.state.bathroomCurveAt = (this.state.bathroomCurveAt == 10) ? 10 : this.state.bathroomCurveAt + amount
    }

    updateBored(amount)
    {
        let addToBored = this.constants.boredCurve[this.bandMember][Math.round(this.state.boredCurveAt)]
        this.state.bored += addToBored
        this.updateBoredValueText()

        this.state.boredCurveAt = (this.state.boredCurveAt == 10) ? 10 : this.state.boredCurveAt + amount
    }

    updateBoredValueText()
    {
        this.boredValueText.text = 
        (this.state.bored >= 10) ?
            (this.state.bored > 99) ? "!!" : this.state.bored as string : 
        "0" + this.state.bored as string
        this.boredValueText.text += " %"
    }

    updateHungerValueText()
    {
        this.hungerValueText.text = 
        (this.state.hunger >= 10) ?
            (this.state.hunger > 99) ? "!!" : this.state.hunger as string : 
        "0" + this.state.hunger as string
        this.hungerValueText.text += " %"
    }
    
    updateHunger(amount)
    {
        let addToHunger = this.constants.hungerCurve[this.bandMember][Math.round(this.state.hungerCurveAt)]
        this.state.hunger += addToHunger
        this.updateHungerValueText()

        this.state.hungerCurveAt = (this.state.hungerCurveAt == 10) ? 10 : this.state.hungerCurveAt + amount
    }

    feed()
    {
        let diceRoll = Math.round(Math.random() * 7)
        let diceResult = this.constants.feedValues[this.bandMember][diceRoll]
        this.state.hunger = (this.state.hunger - diceResult < 0) ? 0 : this.state.hunger - diceResult
        this.state.hungerCurveAt = 0
        this.updateHungerValueText()
    }

    give()
    {
        let diceRoll = Math.round(Math.random() * 4)
        let diceResult = this.constants.giveValues[this.bandMember][diceRoll]
        console.log('give ' + diceResult)
        this.state.bored = (this.state.bored - diceResult < 0) ? 0 : this.state.bored - diceResult
        this.state.boredCurveAt = 0
        this.updateBoredValueText()
    }
}