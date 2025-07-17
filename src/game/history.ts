import { EventEmitter } from 'events';

export interface GameCommand {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  scene?: string;
  
  // Command pattern methods
  execute(): void;
  undo(): void;
  redo(): void;
  
  // Serialization support
  serialize(): any;
  deserialize(data: any): void;
}

export abstract class BaseCommand implements GameCommand {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  scene?: string;
  
  constructor(type: string, data: any, scene?: string) {
    this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.timestamp = Date.now();
    this.data = data;
    this.scene = scene;
  }
  
  abstract execute(): void;
  abstract undo(): void;
  abstract redo(): void;
  
  serialize(): any {
    return {
      id: this.id,
      type: this.type,
      timestamp: this.timestamp,
      data: this.data,
      scene: this.scene
    };
  }
  
  deserialize(data: any): void {
    this.id = data.id;
    this.type = data.type;
    this.timestamp = data.timestamp;
    this.data = data.data;
    this.scene = data.scene;
  }
}

export class History extends EventEmitter {
  private commands: GameCommand[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 1000;
  
  constructor(maxSize: number = 1000) {
    super();
    this.maxHistorySize = maxSize;
  }
  
  // Execute and record a command
  executeCommand(command: GameCommand): void {
    // Remove any commands after current index (for redo functionality)
    if (this.currentIndex < this.commands.length - 1) {
      this.commands.splice(this.currentIndex + 1);
    }
    
    // Execute the command
    command.execute();
    
    // Add to history
    this.commands.push(command);
    this.currentIndex++;
    
    // Maintain max history size
    if (this.commands.length > this.maxHistorySize) {
      this.commands.shift();
      this.currentIndex--;
    }
    
    // Emit event
    this.emit('command-executed', command);
  }
  
  // Undo last command
  undo(): boolean {
    if (this.currentIndex >= 0) {
      const command = this.commands[this.currentIndex];
      command.undo();
      this.currentIndex--;
      this.emit('command-undone', command);
      return true;
    }
    return false;
  }
  
  // Redo next command
  redo(): boolean {
    if (this.currentIndex < this.commands.length - 1) {
      this.currentIndex++;
      const command = this.commands[this.currentIndex];
      command.redo();
      this.emit('command-redone', command);
      return true;
    }
    return false;
  }
  
  // Get all commands (for save/load)
  getCommands(): GameCommand[] {
    return [...this.commands];
  }
  
  // Get commands by type
  getCommandsByType(type: string): GameCommand[] {
    return this.commands.filter(cmd => cmd.type === type);
  }
  
  // Get commands by scene
  getCommandsByScene(scene: string): GameCommand[] {
    return this.commands.filter(cmd => cmd.scene === scene);
  }
  
  // Clear history
  clear(): void {
    this.commands = [];
    this.currentIndex = -1;
    this.emit('history-cleared');
  }
  
  // Save history to JSON
  saveToJSON(): string {
    const serializedCommands = this.commands.map(cmd => cmd.serialize());
    return JSON.stringify({
      commands: serializedCommands,
      currentIndex: this.currentIndex,
      timestamp: Date.now()
    });
  }
  
  // Load history from JSON
  loadFromJSON(jsonData: string, commandFactory: (data: any) => GameCommand): void {
    try {
      const data = JSON.parse(jsonData);
      this.commands = data.commands.map(cmdData => {
        const command = commandFactory(cmdData);
        command.deserialize(cmdData);
        return command;
      });
      this.currentIndex = data.currentIndex;
      this.emit('history-loaded');
    } catch (error) {
      console.error('Failed to load history:', error);
      this.emit('history-load-error', error);
    }
  }
  
  // Get current state info
  getInfo(): { commandCount: number, currentIndex: number, canUndo: boolean, canRedo: boolean } {
    return {
      commandCount: this.commands.length,
      currentIndex: this.currentIndex,
      canUndo: this.currentIndex >= 0,
      canRedo: this.currentIndex < this.commands.length - 1
    };
  }
}

// Export singleton instance
export const gameHistory = new History();
