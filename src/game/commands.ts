import { BaseCommand } from './history';
import { scenes } from '../app';
import { gameState } from './state';
import { storyManager } from './story';

// High-level game action commands (not toy-level interactions)

// Story progression command
export class StoryChoiceCommand extends BaseCommand {
  private choiceId: string;
  private nodeId: string;
  
  constructor(nodeId: string, choiceId: string) {
    super('story-choice', { nodeId, choiceId }, 'story');
    this.nodeId = nodeId;
    this.choiceId = choiceId;
  }
  
  execute(): void {
    storyManager.makeChoice(this.choiceId);
  }
  
  undo(): void {
    // Story choices are generally not undoable in gameplay
    // This would require storing previous story state
    console.warn('Story choice undo not implemented');
  }
  
  redo(): void {
    this.execute();
  }
}

// Game mode change command
export class GameModeChangeCommand extends BaseCommand {
  private oldMode: string;
  private newMode: string;
  
  constructor(oldMode: string, newMode: string) {
    super('game-mode-change', { oldMode, newMode }, 'game');
    this.oldMode = oldMode;
    this.newMode = newMode;
  }
  
  execute(): void {
    gameState.updateState({ mode: this.newMode as any });
  }
  
  undo(): void {
    gameState.updateState({ mode: this.oldMode as any });
  }
  
  redo(): void {
    this.execute();
  }
}

// Significant game state change command
export class GameStateChangeCommand extends BaseCommand {
  private stateKey: string;
  private oldValue: any;
  private newValue: any;
  
  constructor(stateKey: string, oldValue: any, newValue: any) {
    super('game-state-change', { stateKey, oldValue, newValue }, 'game');
    this.stateKey = stateKey;
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
  
  execute(): void {
    // Apply the state change through the proper system
    const stateParts = this.stateKey.split('.');
    if (stateParts[0] === 'player') {
      gameState.updatePlayerState({ [stateParts[1]]: this.newValue });
    } else if (stateParts[0] === 'progression') {
      gameState.updateProgressionState({ [stateParts[1]]: this.newValue });
    } else {
      // Generic state update
      gameState.updateState({ [this.stateKey]: this.newValue });
    }
  }
  
  undo(): void {
    const stateParts = this.stateKey.split('.');
    if (stateParts[0] === 'player') {
      gameState.updatePlayerState({ [stateParts[1]]: this.oldValue });
    } else if (stateParts[0] === 'progression') {
      gameState.updateProgressionState({ [stateParts[1]]: this.oldValue });
    } else {
      gameState.updateState({ [this.stateKey]: this.oldValue });
    }
  }
  
  redo(): void {
    this.execute();
  }
}

// Menu navigation command
export class MenuNavigationCommand extends BaseCommand {
  private fromMenu: string;
  private toMenu: string;
  
  constructor(fromMenu: string, toMenu: string) {
    super('menu-navigation', { fromMenu, toMenu }, 'menu');
    this.fromMenu = fromMenu;
    this.toMenu = toMenu;
  }
  
  execute(): void {
    // Navigate to the new menu
    // This would be implemented by the menu system
    console.log(`Navigating from ${this.fromMenu} to ${this.toMenu}`);
  }
  
  undo(): void {
    // Navigate back to the previous menu
    console.log(`Navigating back from ${this.toMenu} to ${this.fromMenu}`);
  }
  
  redo(): void {
    this.execute();
  }
}

// Save game command
export class SaveGameCommand extends BaseCommand {
  private saveData: string;
  
  constructor(saveData: string) {
    super('save-game', { saveData }, 'game');
    this.saveData = saveData;
  }
  
  execute(): void {
    // Save the game state
    localStorage.setItem('bruisecorps-save', this.saveData);
    console.log('Game saved');
  }
  
  undo(): void {
    // Remove the save
    localStorage.removeItem('bruisecorps-save');
    console.log('Save removed');
  }
  
  redo(): void {
    this.execute();
  }
}

// Load game command
export class LoadGameCommand extends BaseCommand {
  private saveData: string;
  private previousGameState: string;
  
  constructor(saveData: string, previousGameState: string) {
    super('load-game', { saveData }, 'game');
    this.saveData = saveData;
    this.previousGameState = previousGameState;
  }
  
  execute(): void {
    // Load the game state
    try {
      const data = JSON.parse(this.saveData);
      gameState.load(this.saveData);
      console.log('Game loaded');
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  }
  
  undo(): void {
    // Restore previous game state
    if (this.previousGameState) {
      gameState.load(this.previousGameState);
      console.log('Game state restored');
    }
  }
  
  redo(): void {
    this.execute();
  }
}

// Story progress command (for significant story events)
export class StoryProgressCommand extends BaseCommand {
  private oldProgress: any;
  private newProgress: any;
  
  constructor(oldProgress: any, newProgress: any) {
    super('story-progress', { oldProgress, newProgress }, 'story');
    this.oldProgress = oldProgress;
    this.newProgress = newProgress;
  }
  
  execute(): void {
    // Apply story progress
    console.log('Story progress:', this.newProgress);
  }
  
  undo(): void {
    // Revert story progress
    console.log('Story undo to:', this.oldProgress);
  }
  
  redo(): void {
    this.execute();
  }
}

// Command factory for history loading
export function createCommandFromData(data: any): BaseCommand {
  switch (data.type) {
    case 'story-choice':
      return new StoryChoiceCommand(data.data.nodeId, data.data.choiceId);
    case 'game-mode-change':
      return new GameModeChangeCommand(data.data.oldMode, data.data.newMode);
    case 'game-state-change':
      return new GameStateChangeCommand(data.data.stateKey, data.data.oldValue, data.data.newValue);
    case 'menu-navigation':
      return new MenuNavigationCommand(data.data.fromMenu, data.data.toMenu);
    case 'save-game':
      return new SaveGameCommand(data.data.saveData);
    case 'load-game':
      return new LoadGameCommand(data.data.saveData, '');
    case 'story-progress':
      return new StoryProgressCommand(data.data.oldProgress, data.data.newProgress);
    default:
      throw new Error(`Unknown command type: ${data.type}`);
  }
}
