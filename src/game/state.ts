import { EventEmitter } from 'events';

export interface GameState {
  // Game flow state
  mode: 'start' | 'playing' | 'paused' | 'ended';
  started: boolean;
  paused: boolean;
  
  // Player state
  player: {
    position: number;  // Road position (0-1)
    gear: number;      // Current gear
    speed: number;     // Current speed
    health: number;    // Player health
    score: number;     // Player score
  };
  
  // Vehicle state
  vehicle: {
    wheelRotation: number;
    ignitionState: number;
    signalState: number;
    shifterPosition: number;
  };
  
  // Environment state
  environment: {
    roadPosition: number;
    weatherCondition: string;
    timeOfDay: string;
    visibility: number;
  };
  
  // Game progression
  progression: {
    currentLevel: number;
    currentScene: string;
    totalSteps: number;
    completedObjectives: string[];
    unlockedFeatures: string[];
  };

  session:
  {
    startTime: number; // Timestamp when the session started
    playTime: number;  // Total play time in milliseconds
    lastSaveTime: number;  // Timestamp of last save
  }
}

export class GameStateManager extends EventEmitter {
  private state: GameState;
  private previousState: GameState;
  
  constructor() {
    super();
    this.state = this.createInitialState();
    this.previousState = { ...this.state };
  }
  
  private createInitialState(): GameState {
    return {
      mode: 'start',
      started: false,
      paused: false,
      
      player: {
        position: 0.5,
        gear: 0,
        speed: 0,
        health: 100,
        score: 0
      },
      
      vehicle: {
        wheelRotation: 0,
        ignitionState: 0,
        signalState: 0,
        shifterPosition: 1  // Default gear position
      },
      
      environment: {
        roadPosition: 0.5,
        weatherCondition: 'clear',
        timeOfDay: 'day',
        visibility: 1.0
      },
      
      progression: {
        currentLevel: 1,
        currentScene: 'marge',
        totalSteps: 0,
        completedObjectives: [],
        unlockedFeatures: []
      },

      session:
      {
        lastSaveTime: Date.now(),
        startTime: Date.now(),
        playTime: 0
      }
    };
  }
  
  // Get current state (read-only)
  getState(): Readonly<GameState> {
    return this.state;
  }
  
  // Get specific state section
  getPlayerState(): Readonly<GameState['player']> {
    return this.state.player;
  }
  
  getVehicleState(): Readonly<GameState['vehicle']> {
    return this.state.vehicle;
  }
  
  getEnvironmentState(): Readonly<GameState['environment']> {
    return this.state.environment;
  }
  
  getProgressionState(): Readonly<GameState['progression']> {
    return this.state.progression;
  }
  
  // Update state with validation and events
  updateState(updates: Partial<GameState>): void {
    this.previousState = JSON.parse(JSON.stringify(this.state));
    
    // Deep merge updates
    this.state = this.deepMerge(this.state, updates);
    
    // Update session time
    this.state.session.playTime = Date.now() - this.state.session.startTime;
    
    // Emit events
    this.emit('state-updated', this.state, this.previousState);
  }
  
  // Update specific state sections
  updatePlayerState(updates: Partial<GameState['player']>): void {
    this.updateState({ player: { ...this.state.player, ...updates } });
    this.emit('player-state-updated', this.state.player);
  }
  
  updateVehicleState(updates: Partial<GameState['vehicle']>): void {
    this.updateState({ vehicle: { ...this.state.vehicle, ...updates } });
    this.emit('vehicle-state-updated', this.state.vehicle);
  }
  
  updateEnvironmentState(updates: Partial<GameState['environment']>): void {
    this.updateState({ environment: { ...this.state.environment, ...updates } });
    this.emit('environment-state-updated', this.state.environment);
  }
  
  updateProgressionState(updates: Partial<GameState['progression']>): void {
    this.updateState({ progression: { ...this.state.progression, ...updates } });
    this.emit('progression-state-updated', this.state.progression);
  }
  
  // Game flow methods
  startGame(): void {
    this.updateState({ 
      mode: 'playing',
      started: true,
      paused: false
    });
    this.emit('game-started');
  }
  
  pauseGame(): void {
    this.updateState({ 
      mode: 'paused',
      paused: true
    });
    this.emit('game-paused');
  }
  
  resumeGame(): void {
    this.updateState({ 
      mode: 'playing',
      paused: false
    });
    this.emit('game-resumed');
  }
  
  endGame(): void {
    this.updateState({ 
      mode: 'ended'
    });
    this.emit('game-ended');
  }
  
  // Utility methods
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  // Reset to initial state
  reset(): void {
    this.state = this.createInitialState();
    this.emit('state-reset');
  }
  
  // Save/Load functionality
  save(): string {
    this.state.session.lastSaveTime = Date.now();
    return JSON.stringify(this.state);
  }
  
  load(savedState: string): void {
    try {
      const loadedState = JSON.parse(savedState);
      this.state = { ...this.createInitialState(), ...loadedState };
      this.emit('state-loaded');
    } catch (error) {
      console.error('Failed to load game state:', error);
      this.emit('state-load-error', error);
    }
  }
}

// Export singleton instance
export const gameState = new GameStateManager();
