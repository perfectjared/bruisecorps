export class Tuple<T1, T2>
{
    constructor
    (
        public item1: T1, 
        public item2: T2
    ) 
    {}
}

export class DynamicSprite extends Phaser.GameObjects.Sprite
{
    private relativePosition

    constructor
    (
        scene: Phaser.Scene,
        config:
        {
            texture: string,
            relativePosition:
            {
                x: number,
                y: number
            }
        }
    )
    {
        super(scene, 0, 0, config.texture)
        this.setOrigin(0.5, 0.5)
        this.relativePosition = config.relativePosition
    }  
}