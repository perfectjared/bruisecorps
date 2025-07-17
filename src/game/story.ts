import { EventEmitter } from 'events';
import { gameState } from './state';
import { gameHistory } from './history';
import { StoryProgressCommand } from './commands';

export interface StoryNode {
  id: string;
  type: 'scene' | 'decision' | 'event' | 'condition';
  title: string;
  description: string;
  content: string;
  
  // Conditions for this node to be active
  conditions?: {
    requiredLevel?: number;
    requiredObjectives?: string[];
    requiredState?: any;
    customCondition?: () => boolean;
  };
  
  // Actions to take when this node is activated
  actions?: {
    setObjective?: string;
    completeObjective?: string;
    unlockFeature?: string;
    updateState?: any;
    customAction?: () => void;
  };
  
  // Navigation options
  nextNodes?: string[];
  choices?: {
    id: string;
    text: string;
    nextNode: string;
    conditions?: any;
  }[];
  
  // Timing and triggers
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  triggers?: {
    onEnter?: () => void;
    onExit?: () => void;
    onChoice?: (choiceId: string) => void;
  };
  
  // Metadata
  metadata?: {
    category?: string;
    tags?: string[];
    difficulty?: number;
    estimatedDuration?: number;
  };
}

export interface StoryObjective {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'hidden';
  status: 'active' | 'completed' | 'failed' | 'locked';
  progress?: number;
  maxProgress?: number;
  
  // Completion conditions
  conditions?: {
    requiredActions?: string[];
    requiredState?: any;
    customCondition?: () => boolean;
  };
  
  // Rewards
  rewards?: {
    experience?: number;
    unlockFeatures?: string[];
    unlockStoryNodes?: string[];
  };
}

export class StoryManager extends EventEmitter {
  private storyNodes: Map<string, StoryNode> = new Map();
  private currentNode: StoryNode | null = null;
  private objectives: Map<string, StoryObjective> = new Map();
  private visitedNodes: Set<string> = new Set();
  private nodeHistory: string[] = [];
  private storyFlags: Map<string, any> = new Map();
  
  constructor() {
    super();
    this.initializeStoryNodes();
    this.initializeObjectives();
  }
  
  private initializeStoryNodes(): void {
    // Define the main story nodes
    const nodes: StoryNode[] = [
      {
        id: 'game-start',
        type: 'scene',
        title: 'Game Start',
        description: 'The beginning of the journey',
        content: 'Welcome to BruiseCorps. Your adventure begins...',
        nextNodes: ['marge-intro'],
        autoAdvance: true,
        autoAdvanceDelay: 2000,
        actions: {
          setObjective: 'learn-controls'
        }
      },
      {
        id: 'marge-intro',
        type: 'scene',
        title: 'Meet Marge',
        description: 'Introduction to the driving experience',
        content: 'You find yourself behind the wheel. Time to learn the controls.',
        nextNodes: ['first-drive'],
        actions: {
          updateState: { progression: { currentScene: 'marge' } }
        }
      },
      {
        id: 'first-drive',
        type: 'event',
        title: 'First Drive',
        description: 'Take your first drive',
        content: 'Put the car in gear and start driving.',
        conditions: {
          customCondition: () => {
            const vehicleState = gameState.getVehicleState();
            return vehicleState.shifterPosition < 1; // Not in default gear
          }
        },
        nextNodes: ['driving-tutorial'],
        actions: {
          completeObjective: 'learn-controls',
          setObjective: 'drive-distance'
        }
      },
      {
        id: 'driving-tutorial',
        type: 'scene',
        title: 'Driving Tutorial',
        description: 'Learn to navigate the road',
        content: 'Use the steering wheel to navigate. Watch your position on the road.',
        nextNodes: ['story-choice-1'],
        conditions: {
          customCondition: () => {
            const playerState = gameState.getPlayerState();
            return Math.abs(playerState.position - 0.5) < 0.1; // Near center
          }
        }
      },
      {
        id: 'story-choice-1',
        type: 'decision',
        title: 'The First Choice',
        description: 'Your first major decision',
        content: 'You come to a fork in the road. Which way do you go?',
        choices: [
          {
            id: 'go-left',
            text: 'Take the left path',
            nextNode: 'left-path'
          },
          {
            id: 'go-right',
            text: 'Take the right path',
            nextNode: 'right-path'
          },
          {
            id: 'go-straight',
            text: 'Continue straight',
            nextNode: 'straight-path'
          }
        ]
      },
      {
        id: 'left-path',
        type: 'scene',
        title: 'The Left Path',
        description: 'You chose the left path',
        content: 'The left path leads through a dark forest...',
        nextNodes: ['continue-story'],
        actions: {
          customAction: () => this.setStoryFlag('chosen-path', 'left')
        }
      },
      {
        id: 'right-path',
        type: 'scene',
        title: 'The Right Path',
        description: 'You chose the right path',
        content: 'The right path leads to a bright meadow...',
        nextNodes: ['continue-story'],
        actions: {
          customAction: () => this.setStoryFlag('chosen-path', 'right')
        }
      },
      {
        id: 'straight-path',
        type: 'scene',
        title: 'The Straight Path',
        description: 'You chose to continue straight',
        content: 'The straight path leads to a mysterious town...',
        nextNodes: ['continue-story'],
        actions: {
          customAction: () => this.setStoryFlag('chosen-path', 'straight')
        }
      },
      {
        id: 'continue-story',
        type: 'scene',
        title: 'The Journey Continues',
        description: 'Your story continues...',
        content: 'Your choice has led you to new adventures...',
        nextNodes: [],
        actions: {
          completeObjective: 'drive-distance',
          setObjective: 'explore-world'
        }
      }
    ];
    
    // Add nodes to the map
    nodes.forEach(node => {
      this.storyNodes.set(node.id, node);
    });
  }
  
  private initializeObjectives(): void {
    const objectives: StoryObjective[] = [
      {
        id: 'learn-controls',
        title: 'Learn the Controls',
        description: 'Familiarize yourself with the vehicle controls',
        type: 'main',
        status: 'locked',
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'drive-distance',
        title: 'Drive a Distance',
        description: 'Drive for a certain distance without crashing',
        type: 'main',
        status: 'locked',
        progress: 0,
        maxProgress: 100
      },
      {
        id: 'explore-world',
        title: 'Explore the World',
        description: 'Discover hidden locations and secrets',
        type: 'side',
        status: 'locked',
        progress: 0,
        maxProgress: 10
      }
    ];
    
    objectives.forEach(objective => {
      this.objectives.set(objective.id, objective);
    });
  }
  
  // Story navigation methods
  startStory(): void {
    this.goToNode('game-start');
  }
  
  goToNode(nodeId: string): void {
    const node = this.storyNodes.get(nodeId);
    if (!node) {
      console.error(`Story node not found: ${nodeId}`);
      return;
    }
    
    // Check conditions
    if (!this.checkNodeConditions(node)) {
      console.warn(`Conditions not met for node: ${nodeId}`);
      return;
    }
    
    // Record history
    const oldNode = this.currentNode;
    if (oldNode) {
      // Execute exit triggers
      oldNode.triggers?.onExit?.();
      
      // Record command
      const command = new StoryProgressCommand(
        { nodeId: oldNode.id, timestamp: Date.now() },
        { nodeId: nodeId, timestamp: Date.now() }
      );
      gameHistory.executeCommand(command);
    }
    
    // Set new current node
    this.currentNode = node;
    this.visitedNodes.add(nodeId);
    this.nodeHistory.push(nodeId);
    
    // Execute enter triggers
    node.triggers?.onEnter?.();
    
    // Execute actions
    this.executeNodeActions(node);
    
    // Emit event
    this.emit('story-node-entered', node);
    
    // Handle auto-advance
    if (node.autoAdvance) {
      setTimeout(() => {
        this.autoAdvanceNode(node);
      }, node.autoAdvanceDelay || 1000);
    }
  }
  
  private checkNodeConditions(node: StoryNode): boolean {
    if (!node.conditions) return true;
    
    const conditions = node.conditions;
    const gameStateData = gameState.getState();
    
    // Check required level
    if (conditions.requiredLevel !== undefined) {
      if (gameStateData.progression.currentLevel < conditions.requiredLevel) {
        return false;
      }
    }
    
    // Check required objectives
    if (conditions.requiredObjectives) {
      for (const objId of conditions.requiredObjectives) {
        const objective = this.objectives.get(objId);
        if (!objective || objective.status !== 'completed') {
          return false;
        }
      }
    }
    
    // Check custom condition
    if (conditions.customCondition) {
      return conditions.customCondition();
    }
    
    return true;
  }
  
  private executeNodeActions(node: StoryNode): void {
    if (!node.actions) return;
    
    const actions = node.actions;
    
    // Set objective
    if (actions.setObjective) {
      this.setObjectiveStatus(actions.setObjective, 'active');
    }
    
    // Complete objective
    if (actions.completeObjective) {
      this.completeObjective(actions.completeObjective);
    }
    
    // Unlock feature
    if (actions.unlockFeature) {
      this.unlockFeature(actions.unlockFeature);
    }
    
    // Update state
    if (actions.updateState) {
      gameState.updateState(actions.updateState);
    }
    
    // Custom action
    if (actions.customAction) {
      actions.customAction();
    }
  }
  
  private autoAdvanceNode(node: StoryNode): void {
    if (node.nextNodes && node.nextNodes.length > 0) {
      this.goToNode(node.nextNodes[0]);
    }
  }
  
  // Choice handling
  makeChoice(choiceId: string): void {
    if (!this.currentNode || this.currentNode.type !== 'decision') {
      console.error('No current decision node');
      return;
    }
    
    const choice = this.currentNode.choices?.find(c => c.id === choiceId);
    if (!choice) {
      console.error(`Choice not found: ${choiceId}`);
      return;
    }
    
    // Execute choice trigger
    this.currentNode.triggers?.onChoice?.(choiceId);
    
    // Go to next node
    this.goToNode(choice.nextNode);
    
    // Emit event
    this.emit('story-choice-made', choice);
  }
  
  // Objective management
  private setObjectiveStatus(objectiveId: string, status: StoryObjective['status']): void {
    const objective = this.objectives.get(objectiveId);
    if (objective) {
      objective.status = status;
      this.emit('objective-updated', objective);
    }
  }
  
  private completeObjective(objectiveId: string): void {
    const objective = this.objectives.get(objectiveId);
    if (objective) {
      objective.status = 'completed';
      objective.progress = objective.maxProgress || 1;
      
      // Apply rewards
      if (objective.rewards) {
        this.applyObjectiveRewards(objective.rewards);
      }
      
      this.emit('objective-completed', objective);
    }
  }
  
  private applyObjectiveRewards(rewards: StoryObjective['rewards']): void {
    if (rewards.unlockFeatures) {
      rewards.unlockFeatures.forEach(feature => this.unlockFeature(feature));
    }
    
    if (rewards.unlockStoryNodes) {
      rewards.unlockStoryNodes.forEach(nodeId => {
        // Logic to unlock story nodes
        this.emit('story-node-unlocked', nodeId);
      });
    }
  }
  
  private unlockFeature(featureId: string): void {
    const currentState = gameState.getProgressionState();
    const updatedFeatures = [...currentState.unlockedFeatures, featureId];
    
    gameState.updateProgressionState({
      unlockedFeatures: updatedFeatures
    });
    
    this.emit('feature-unlocked', featureId);
  }
  
  // Story flag management
  setStoryFlag(key: string, value: any): void {
    this.storyFlags.set(key, value);
    this.emit('story-flag-set', key, value);
  }
  
  getStoryFlag(key: string): any {
    return this.storyFlags.get(key);
  }
  
  // Getters
  getCurrentNode(): StoryNode | null {
    return this.currentNode;
  }
  
  getObjectives(): StoryObjective[] {
    return Array.from(this.objectives.values());
  }
  
  getActiveObjectives(): StoryObjective[] {
    return this.getObjectives().filter(obj => obj.status === 'active');
  }
  
  getCompletedObjectives(): StoryObjective[] {
    return this.getObjectives().filter(obj => obj.status === 'completed');
  }
  
  getVisitedNodes(): string[] {
    return Array.from(this.visitedNodes);
  }
  
  getNodeHistory(): string[] {
    return [...this.nodeHistory];
  }
  
  // Save/Load
  saveStoryState(): string {
    return JSON.stringify({
      currentNodeId: this.currentNode?.id,
      visitedNodes: Array.from(this.visitedNodes),
      nodeHistory: this.nodeHistory,
      objectives: Array.from(this.objectives.entries()),
      storyFlags: Array.from(this.storyFlags.entries()),
      timestamp: Date.now()
    });
  }
  
  loadStoryState(savedState: string): void {
    try {
      const data = JSON.parse(savedState);
      
      if (data.currentNodeId) {
        this.currentNode = this.storyNodes.get(data.currentNodeId) || null;
      }
      
      this.visitedNodes = new Set(data.visitedNodes || []);
      this.nodeHistory = data.nodeHistory || [];
      
      if (data.objectives) {
        this.objectives = new Map(data.objectives);
      }
      
      if (data.storyFlags) {
        this.storyFlags = new Map(data.storyFlags);
      }
      
      this.emit('story-state-loaded');
    } catch (error) {
      console.error('Failed to load story state:', error);
    }
  }
}

// Export singleton instance
export const storyManager = new StoryManager();
