import { Scene } from 'phaser';
import { IFlags } from '../utilities';

export class Game extends Scene 
{
  constructor() 
  {
    super({
      key: 'GameScene'
    });
  }
  
  preload(): void //TODO move this to preload.ts
  {

  }

  create(): void 
  {

  }

  update(): void 
  {
    this.controller();
    this.model();
    this.view();
    this.debug();
  }

  controller(): void
  {

  }

  model(): void
  {

  }

  view(): void
  {
    
  }

  debug(): void
  {

  }
}