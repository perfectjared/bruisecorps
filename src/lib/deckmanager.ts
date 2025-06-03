export class DeckManager 
{
    private iframe: HTMLIFrameElement
    private game: Phaser.Game

    constructor(game: Phaser.Game)
    {
        this.game = game
        this.iframe = this.createIFrame()
        this.setupEventListeners()
    }

    private createIFrame(): HTMLIFrameElement
    {
        const iframe = document.createElement('iframe')
        iframe.srcdoc = this.getDeckHTML()
        document.getElementById('deck-container')!.appendChild(iframe)
        return iframe
    }

    private getDeckHTML(): string
    {
        
        return ""
    }

    private setupEventListeners(): void
    {

    }
}