import { EventEmitter } from 'events';
import { gameState } from './state';
import { gameHistory } from './history';
import { storyManager } from './story';

export interface DeckerWidget {
  id: string;
  type: 'button' | 'slider' | 'field' | 'canvas' | 'grid' | 'contraption';
  name: string;
  properties: any;
  events: string[];
  state: any;
}

export interface DeckerCard {
  id: string;
  name: string;
  widgets: DeckerWidget[];
  scripts: any[];
  transitions: any[];
}

export interface DeckerEvent {
  type: string;
  widget: string;
  data: any;
  timestamp: number;
}

export interface DeckerAPI {
  // Widget management
  createWidget(type: string, properties: any): DeckerWidget;
  updateWidget(widgetId: string, properties: any): void;
  deleteWidget(widgetId: string): void;
  getWidget(widgetId: string): DeckerWidget | null;
  
  // Card management
  createCard(name: string): DeckerCard;
  switchToCard(cardId: string): void;
  getCurrentCard(): DeckerCard | null;
  
  // Event handling
  sendEvent(event: DeckerEvent): void;
  addEventListener(widgetId: string, eventType: string, callback: (data: any) => void): void;
  removeEventListener(widgetId: string, eventType: string): void;
  
  // Script execution
  executeScript(script: string, context?: any): any;
  
  // State synchronization
  syncGameState(): void;
  syncStoryState(): void;
}

export class DeckerBridge extends EventEmitter implements DeckerAPI {
  private iframe: HTMLIFrameElement | null = null;
  private widgets: Map<string, DeckerWidget> = new Map();
  private cards: Map<string, DeckerCard> = new Map();
  private eventListeners: Map<string, Map<string, Function[]>> = new Map();
  private currentCard: DeckerCard | null = null;
  private isConnected: boolean = false;
  private messageQueue: any[] = [];
  
  constructor() {
    super();
    this.initializeBridge();
  }
  
  private initializeBridge(): void {
    // Set up message handling for iframe communication
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      this.handleDeckerMessage(event.data);
    });
    
    // Initialize default cards and widgets
    this.setupDefaultInterface();
  }
  
  private setupDefaultInterface(): void {
    // Create main menu card
    const mainMenuCard = this.createCard('main-menu');
    
    // Create game controls card
    const gameControlsCard = this.createCard('game-controls');
    
    // Create story interface card
    const storyCard = this.createCard('story-interface');
    
    // Set up default widgets
    this.setupMainMenuWidgets(mainMenuCard);
    this.setupGameControlsWidgets(gameControlsCard);
    this.setupStoryWidgets(storyCard);
    
    // Start with main menu
    this.currentCard = mainMenuCard;
  }
  
  private setupMainMenuWidgets(card: DeckerCard): void {
    // Start game button
    const startButton = this.createWidget('button', {
      text: 'Start Game',
      pos: [200, 150],
      size: [100, 40],
      script: 'start-game'
    });
    
    // Load game button
    const loadButton = this.createWidget('button', {
      text: 'Load Game',
      pos: [200, 200],
      size: [100, 40],
      script: 'load-game'
    });
    
    // Settings button
    const settingsButton = this.createWidget('button', {
      text: 'Settings',
      pos: [200, 250],
      size: [100, 40],
      script: 'open-settings'
    });
    
    card.widgets.push(startButton, loadButton, settingsButton);
    
    // Set up event handlers
    this.addEventListener(startButton.id, 'click', () => {
      this.handleStartGame();
    });
    
    this.addEventListener(loadButton.id, 'click', () => {
      this.handleLoadGame();
    });
    
    this.addEventListener(settingsButton.id, 'click', () => {
      this.handleOpenSettings();
    });
  }
  
  private setupGameControlsWidgets(card: DeckerCard): void {
    // Health slider
    const healthSlider = this.createWidget('slider', {
      interval: [0, 100],
      value: 100,
      pos: [50, 50],
      size: [200, 30],
      format: 'Health: %d%%'
    });
    
    // Speed indicator
    const speedField = this.createWidget('field', {
      text: 'Speed: 0 mph',
      pos: [50, 100],
      size: [200, 30],
      locked: true
    });
    
    // Gear display
    const gearField = this.createWidget('field', {
      text: 'Gear: N',
      pos: [50, 150],
      size: [100, 30],
      locked: true
    });
    
    card.widgets.push(healthSlider, speedField, gearField);
    
    // Set up real-time updates
    this.setupGameStateUpdates(card);
  }
  
  private setupStoryWidgets(card: DeckerCard): void {
    // Story text display
    const storyText = this.createWidget('field', {
      text: 'Story will appear here...',
      pos: [50, 50],
      size: [400, 200],
      locked: true,
      style: 'scrolling'
    });
    
    // Choice buttons (dynamically created)
    const choicesContainer = this.createWidget('canvas', {
      pos: [50, 270],
      size: [400, 150]
    });
    
    // Objectives display
    const objectivesText = this.createWidget('field', {
      text: 'Objectives:\n- Learn the controls',
      pos: [470, 50],
      size: [200, 300],
      locked: true,
      style: 'scrolling'
    });
    
    card.widgets.push(storyText, choicesContainer, objectivesText);
    
    // Set up story state updates
    this.setupStoryUpdates(card);
  }
  
  private setupGameStateUpdates(card: DeckerCard): void {
    // Subscribe to game state updates
    gameState.on('player-state-updated', (playerState) => {
      this.updateGameDisplay(card, playerState);
    });
    
    gameState.on('vehicle-state-updated', (vehicleState) => {
      this.updateVehicleDisplay(card, vehicleState);
    });
  }
  
  private setupStoryUpdates(card: DeckerCard): void {
    // Subscribe to story updates
    storyManager.on('story-node-entered', (node) => {
      this.updateStoryDisplay(card, node);
    });
    
    storyManager.on('objective-updated', (objective) => {
      this.updateObjectivesDisplay(card);
    });
  }
  
  private updateGameDisplay(card: DeckerCard, playerState: any): void {
    // Update health slider
    const healthSlider = card.widgets.find(w => w.properties.format?.includes('Health'));
    if (healthSlider) {
      this.updateWidget(healthSlider.id, { value: playerState.health });
    }
    
    // Update speed display
    const speedField = card.widgets.find(w => w.properties.text?.includes('Speed'));
    if (speedField) {
      this.updateWidget(speedField.id, { 
        text: `Speed: ${Math.round(playerState.speed * 100)} mph` 
      });
    }
  }
  
  private updateVehicleDisplay(card: DeckerCard, vehicleState: any): void {
    // Update gear display
    const gearField = card.widgets.find(w => w.properties.text?.includes('Gear'));
    if (gearField) {
      const gearNames = ['R', 'N', '1', '2', '3', '4', '5'];
      const gearIndex = Math.round(vehicleState.shifterPosition * (gearNames.length - 1));
      this.updateWidget(gearField.id, { 
        text: `Gear: ${gearNames[gearIndex] || 'N'}` 
      });
    }
  }
  
  private updateStoryDisplay(card: DeckerCard, node: any): void {
    // Update story text
    const storyText = card.widgets.find(w => w.properties.style === 'scrolling');
    if (storyText) {
      this.updateWidget(storyText.id, { 
        text: `${node.title}\n\n${node.content}` 
      });
    }
    
    // Update choices if it's a decision node
    if (node.type === 'decision' && node.choices) {
      this.updateChoiceButtons(card, node.choices);
    }
  }
  
  private updateObjectivesDisplay(card: DeckerCard): void {
    const objectivesText = card.widgets.find(w => w.properties.text?.includes('Objectives'));
    if (objectivesText) {
      const activeObjectives = storyManager.getActiveObjectives();
      const objectivesStr = 'Objectives:\n' + 
        activeObjectives.map(obj => `- ${obj.title}`).join('\n');
      
      this.updateWidget(objectivesText.id, { text: objectivesStr });
    }
  }
  
  private updateChoiceButtons(card: DeckerCard, choices: any[]): void {
    // This would dynamically create/update choice buttons
    // For now, just emit an event
    this.emit('story-choices-updated', choices);
  }
  
  private handleDeckerMessage(data: any): void {
    switch (data.type) {
      case 'widget-event':
        this.handleWidgetEvent(data);
        break;
      case 'script-result':
        this.handleScriptResult(data);
        break;
      case 'iframe-ready':
        this.handleIframeReady();
        break;
      case 'widget-updated':
        this.handleWidgetUpdated(data);
        break;
      default:
        //console.log('Unknown Decker message:', data);
    }
  }
  
  private handleWidgetEvent(data: any): void {
    const event: DeckerEvent = {
      type: data.eventType,
      widget: data.widgetId,
      data: data.eventData,
      timestamp: Date.now()
    };
    
    this.sendEvent(event);
  }
  
  private handleScriptResult(data: any): void {
    this.emit('script-executed', data);
  }
  
  private handleIframeReady(): void {
    this.isConnected = true;
    
    // Process queued messages
    this.messageQueue.forEach(message => {
      this.sendToIframe(message);
    });
    this.messageQueue = [];
    
    this.emit('decker-connected');
  }
  
  private handleWidgetUpdated(data: any): void {
    const widget = this.widgets.get(data.widgetId);
    if (widget) {
      widget.properties = { ...widget.properties, ...data.properties };
      this.emit('widget-updated', widget);
    }
  }
  
  private sendToIframe(message: any): void {
    if (this.isConnected && this.iframe) {
      this.iframe.contentWindow?.postMessage(message, window.location.origin);
    } else {
      this.messageQueue.push(message);
    }
  }
  
  // Event handlers
  private handleStartGame(): void {
    gameState.startGame();
    storyManager.startStory();
    this.switchToCard('game-controls');
  }
  
  private handleLoadGame(): void {
    // Implement load game logic
    this.emit('load-game-requested');
  }
  
  private handleOpenSettings(): void {
    // Implement settings logic
    this.emit('settings-requested');
  }
  
  // API Implementation
  createWidget(type: string, properties: any): DeckerWidget {
    const widget: DeckerWidget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      name: properties.name || `${type}_widget`,
      properties: properties,
      events: [],
      state: {}
    };
    
    this.widgets.set(widget.id, widget);
    
    // Send to iframe
    this.sendToIframe({
      type: 'create-widget',
      widget: widget
    });
    
    return widget;
  }
  
  updateWidget(widgetId: string, properties: any): void {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.properties = { ...widget.properties, ...properties };
      
      this.sendToIframe({
        type: 'update-widget',
        widgetId: widgetId,
        properties: properties
      });
    }
  }
  
  deleteWidget(widgetId: string): void {
    this.widgets.delete(widgetId);
    
    this.sendToIframe({
      type: 'delete-widget',
      widgetId: widgetId
    });
  }
  
  getWidget(widgetId: string): DeckerWidget | null {
    return this.widgets.get(widgetId) || null;
  }
  
  createCard(name: string): DeckerCard {
    const card: DeckerCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      widgets: [],
      scripts: [],
      transitions: []
    };
    
    this.cards.set(card.id, card);
    return card;
  }
  
  switchToCard(cardId: string): void {
    const card = this.cards.get(cardId);
    if (card) {
      this.currentCard = card;
      
      this.sendToIframe({
        type: 'switch-card',
        cardId: cardId
      });
      
      this.emit('card-switched', card);
    }
  }
  
  getCurrentCard(): DeckerCard | null {
    return this.currentCard;
  }
  
  sendEvent(event: DeckerEvent): void {
    // Trigger local event listeners
    const widgetListeners = this.eventListeners.get(event.widget);
    if (widgetListeners) {
      const typeListeners = widgetListeners.get(event.type);
      if (typeListeners) {
        typeListeners.forEach(callback => callback(event.data));
      }
    }
    
    // Send to iframe
    this.sendToIframe({
      type: 'widget-event',
      event: event
    });
    
    this.emit('decker-event', event);
  }
  
  addEventListener(widgetId: string, eventType: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(widgetId)) {
      this.eventListeners.set(widgetId, new Map());
    }
    
    const widgetListeners = this.eventListeners.get(widgetId)!;
    if (!widgetListeners.has(eventType)) {
      widgetListeners.set(eventType, []);
    }
    
    widgetListeners.get(eventType)!.push(callback);
  }
  
  removeEventListener(widgetId: string, eventType: string): void {
    const widgetListeners = this.eventListeners.get(widgetId);
    if (widgetListeners) {
      widgetListeners.delete(eventType);
    }
  }
  
  executeScript(script: string, context?: any): any {
    this.sendToIframe({
      type: 'execute-script',
      script: script,
      context: context
    });
  }
  
  syncGameState(): void {
    this.sendToIframe({
      type: 'sync-game-state',
      gameState: gameState.getState()
    });
  }
  
  syncStoryState(): void {
    this.sendToIframe({
      type: 'sync-story-state',
      storyState: {
        currentNode: storyManager.getCurrentNode(),
        objectives: storyManager.getObjectives(),
        visitedNodes: storyManager.getVisitedNodes()
      }
    });
  }
  
  // Connect to iframe
  connectToIframe(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;
    
    // Wait for iframe to load
    iframe.onload = () => {
      this.sendToIframe({ type: 'initialize-bridge' });
    };
  }
  
  // Disconnect from iframe
  disconnect(): void {
    this.iframe = null;
    this.isConnected = false;
    this.messageQueue = [];
  }
  
  // Get API status
  getStatus(): any {
    return {
      connected: this.isConnected,
      widgetCount: this.widgets.size,
      cardCount: this.cards.size,
      currentCard: this.currentCard?.name,
      messageQueueSize: this.messageQueue.length
    };
  }
}

// Export singleton instance
export const deckerBridge = new DeckerBridge();
