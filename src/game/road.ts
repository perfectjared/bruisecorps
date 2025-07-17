import { EventEmitter } from 'events';
import { gameState } from './state';
import { getVectorGraphics } from '../lib/vector-graphics';
// Remove command imports - road system emits events, doesn't create commands

export interface RoadConfig {
  width: number;
  segmentLength: number;
  rumbleLength: number;
  trackLength: number;
  lanes: number;
  bounds: {
    left: number;
    right: number;
  };
  physics: {
    friction: number;
    maxSpeed: number;
    acceleration: number;
    deceleration: number;
  };
  visual: {
    animationSpeed: number;
    rumbleIntensity: number;
    roadColor: string;
    laneColor: string;
  };
}

export interface RoadSegment {
  index: number;
  curve: number;
  pitch: number;
  y: number;
  z: number;
  width: number;
  sprites: any[];
  cars: any[];
  color: any;
}

export interface RoadState {
  position: number;        // Current position on road (0-1)
  velocity: number;        // Current velocity
  acceleration: number;    // Current acceleration
  roadOffset: number;      // Visual offset for animation
  segmentIndex: number;    // Current segment
  lapProgress: number;     // Progress around track
  
  // Visual state
  rumbleOffset: number;
  animationPhase: number;
  
  // Physics state
  friction: number;
  grip: number;
  
  // Environmental factors
  weatherModifier: number;
  visibilityModifier: number;
}

export class RoadSystem extends EventEmitter {
  private config: RoadConfig;
  private state: RoadState;
  private segments: RoadSegment[] = [];
  private isActive: boolean = false;
  
  constructor(config?: Partial<RoadConfig>) {
    super();
    
    this.config = {
      width: 2000,
      segmentLength: 200,
      rumbleLength: 3,
      trackLength: 0,
      lanes: 2,
      bounds: {
        left: 0,
        right: 1
      },
      physics: {
        friction: 0.95,
        maxSpeed: 1.0,
        acceleration: 0.02,
        deceleration: 0.98
      },
      visual: {
        animationSpeed: 0.01,
        rumbleIntensity: 0.5,
        roadColor: '#666666',
        laneColor: '#ffffff'
      },
      ...config
    };
    
    this.state = {
      position: 0.5,
      velocity: 0,
      acceleration: 0,
      roadOffset: 0,
      segmentIndex: 0,
      lapProgress: 0,
      rumbleOffset: 0,
      animationPhase: 0,
      friction: this.config.physics.friction,
      grip: 1.0,
      weatherModifier: 1.0,
      visibilityModifier: 1.0
    };
    
    this.initializeRoad();
  }
  
  private initializeRoad(): void {
    // Create road segments
    const segmentCount = Math.floor(this.config.trackLength / this.config.segmentLength) || 100;
    
    for (let i = 0; i < segmentCount; i++) {
      const segment: RoadSegment = {
        index: i,
        curve: this.generateCurve(i),
        pitch: this.generatePitch(i),
        y: 0,
        z: i * this.config.segmentLength,
        width: this.config.width,
        sprites: [],
        cars: [],
        color: this.generateSegmentColor(i)
      };
      
      this.segments.push(segment);
    }
    
    this.config.trackLength = segmentCount * this.config.segmentLength;
    
    this.emit('road-initialized', this.segments.length);
  }
  
  private generateCurve(segmentIndex: number): number {
    // Generate curves based on segment index
    // This creates a more interesting road layout
    const factor = segmentIndex / 100;
    return Math.sin(factor * Math.PI * 2) * 0.02;
  }
  
  private generatePitch(segmentIndex: number): number {
    // Generate hills and valleys
    const factor = segmentIndex / 150;
    return Math.sin(factor * Math.PI * 1.5) * 0.01;
  }
  
  private generateSegmentColor(segmentIndex: number): any {
    // Alternate road colors for visual variety
    const isRumble = (segmentIndex % this.config.rumbleLength) === 0;
    return {
      road: isRumble ? '#555555' : this.config.visual.roadColor,
      grass: '#228833',
      rumble: isRumble ? '#ffffff' : this.config.visual.roadColor,
      lane: this.config.visual.laneColor
    };
  }
  
  // Public API methods
  activate(): void {
    if (!this.isActive) {
      this.isActive = true;
      this.emit('road-activated');
    }
  }
  
  deactivate(): void {
    if (this.isActive) {
      this.isActive = false;
      this.emit('road-deactivated');
    }
  }
  
  updatePosition(newPosition: number): void {
    if (!this.isActive) return;
    
    const oldPosition = this.state.position;
    const clampedPosition = Math.max(this.config.bounds.left, 
                                    Math.min(this.config.bounds.right, newPosition));
    
    if (clampedPosition !== oldPosition) {
      this.state.position = clampedPosition;
      
      // Update game state (no command recording here)
      gameState.updatePlayerState({ position: clampedPosition });
      gameState.updateEnvironmentState({ roadPosition: clampedPosition });
      
      // Update visual representation
      this.updateVisualPosition();
      
      // Emit events for higher-level systems to potentially create commands
      this.emit('position-changed', clampedPosition, oldPosition);
      
      // Emit specific events for different types of position changes
      const positionDiff = Math.abs(clampedPosition - oldPosition);
      if (positionDiff > 0.2) {
        this.emit('major-position-change', {
          position: clampedPosition,
          oldPosition: oldPosition,
          change: positionDiff
        });
      }
    }
  }
  
  updateVelocity(steering: number, acceleration: number, brake: number): void {
    if (!this.isActive) return;
    
    // Apply steering influence on velocity
    this.state.velocity += steering * this.config.physics.acceleration;
    
    // Apply acceleration/braking
    this.state.velocity += acceleration * this.config.physics.acceleration;
    this.state.velocity *= brake > 0 ? this.config.physics.deceleration : 1.0;
    
    // Apply friction
    this.state.velocity *= this.state.friction;
    
    // Apply environmental modifiers
    this.state.velocity *= this.state.weatherModifier;
    
    // Clamp velocity
    this.state.velocity = Math.max(-this.config.physics.maxSpeed, 
                                  Math.min(this.config.physics.maxSpeed, this.state.velocity));
    
    // Update position based on velocity (no command recording)
    if (Math.abs(this.state.velocity) > 0.001) {
      this.updatePosition(this.state.position + this.state.velocity);
    }
    
    // Update game state
    gameState.updatePlayerState({ speed: Math.abs(this.state.velocity) });
    
    this.emit('velocity-updated', this.state.velocity);
  }
  
  private updateVisualPosition(): void {
    // Update the anime.js/vector graphics road position
    const vectorGraphics = getVectorGraphics();
    if (vectorGraphics) {
      vectorGraphics.updateRoadPosition(this.state.position);
    }
    
    // Update road offset for animation
    this.state.roadOffset = (this.state.position - 0.5) * 200; // Scale for visual effect
    
    this.emit('visual-position-updated', this.state.roadOffset);
  }
  
  update(deltaTime: number): void {
    if (!this.isActive) return;
    
    // Update animation phase
    this.state.animationPhase += deltaTime * this.config.visual.animationSpeed;
    if (this.state.animationPhase > Math.PI * 2) {
      this.state.animationPhase -= Math.PI * 2;
    }
    
    // Update rumble offset
    this.state.rumbleOffset = Math.sin(this.state.animationPhase) * 
                              this.config.visual.rumbleIntensity;
    
    // Update segment index based on progress
    this.state.segmentIndex = Math.floor(this.state.lapProgress * this.segments.length);
    
    // Apply environmental effects
    this.updateEnvironmentalEffects();
    
    this.emit('road-updated', this.state);
  }
  
  private updateEnvironmentalEffects(): void {
    // Update weather effects
    const envState = gameState.getEnvironmentState();
    
    switch (envState.weatherCondition) {
      case 'rain':
        this.state.friction = this.config.physics.friction * 0.8;
        this.state.grip = 0.7;
        break;
      case 'snow':
        this.state.friction = this.config.physics.friction * 0.6;
        this.state.grip = 0.5;
        break;
      case 'fog':
        this.state.visibilityModifier = 0.5;
        break;
      default:
        this.state.friction = this.config.physics.friction;
        this.state.grip = 1.0;
        this.state.visibilityModifier = 1.0;
    }
    
    // Update visibility based on time of day
    switch (envState.timeOfDay) {
      case 'night':
        this.state.visibilityModifier *= 0.7;
        break;
      case 'dawn':
      case 'dusk':
        this.state.visibilityModifier *= 0.9;
        break;
    }
  }
  
  // Collision detection
  checkBounds(): boolean {
    return this.state.position >= this.config.bounds.left && 
           this.state.position <= this.config.bounds.right;
  }
  
  getCollisionInfo(): any {
    const isOffRoad = !this.checkBounds();
    const currentSegment = this.segments[this.state.segmentIndex];
    
    return {
      isOffRoad,
      currentSegment,
      distanceFromCenter: Math.abs(this.state.position - 0.5),
      roadWidth: this.config.width,
      segmentCurve: currentSegment?.curve || 0
    };
  }
  
  // Getters
  getState(): Readonly<RoadState> {
    return this.state;
  }
  
  getConfig(): Readonly<RoadConfig> {
    return this.config;
  }
  
  getSegments(): Readonly<RoadSegment[]> {
    return this.segments;
  }
  
  getCurrentSegment(): RoadSegment | null {
    return this.segments[this.state.segmentIndex] || null;
  }
  
  getPosition(): number {
    return this.state.position;
  }
  
  getVelocity(): number {
    return this.state.velocity;
  }
  
  // Configuration updates
  updateConfig(newConfig: Partial<RoadConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config-updated', this.config);
  }
  
  // Reset road state
  reset(): void {
    this.state = {
      position: 0.5,
      velocity: 0,
      acceleration: 0,
      roadOffset: 0,
      segmentIndex: 0,
      lapProgress: 0,
      rumbleOffset: 0,
      animationPhase: 0,
      friction: this.config.physics.friction,
      grip: 1.0,
      weatherModifier: 1.0,
      visibilityModifier: 1.0
    };
    
    this.emit('road-reset');
  }
  
  // Save/Load
  saveState(): string {
    return JSON.stringify({
      state: this.state,
      config: this.config,
      isActive: this.isActive,
      timestamp: Date.now()
    });
  }
  
  loadState(savedState: string): void {
    try {
      const data = JSON.parse(savedState);
      this.state = { ...this.state, ...data.state };
      this.config = { ...this.config, ...data.config };
      this.isActive = data.isActive;
      this.emit('state-loaded');
    } catch (error) {
      console.error('Failed to load road state:', error);
    }
  }
}

// Export singleton instance
export const roadSystem = new RoadSystem();
