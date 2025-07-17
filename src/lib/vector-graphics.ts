// Anime.js Vector Graphics Integration - Outrun Road View
declare const anime: any;
import { scenes } from '../app';

export class VectorGraphics {
    svg: SVGSVGElement;
    container: HTMLElement;
    elements: Map<string, SVGElement>;
    animations: Map<string, any>;
    beatData: { step: number; volume: number; };
    beatInterval: NodeJS.Timeout | null;
    
    constructor() {
        this.svg = document.getElementById('anime-svg') as unknown as SVGSVGElement;
        this.container = document.getElementById('anime-container') as HTMLElement;
        this.elements = new Map();
        this.animations = new Map();
        this.beatData = { step: 0, volume: 0.5 };
        this.beatInterval = null;
        
        this.init();
    }
    
    init() {
        this.createOutrunRoad();
        this.startBeatAnimation();
    }
    
    createOutrunRoad() {
        // Horizon line
        this.createElement('horizon', 'line', { x1: 0, y1: 350, x2: 1920, y2: 350 }, '#ff0080', 2);
        
        // Road perspective lines
        this.createElement('road-left', 'path', { d: 'M 0 1080 L 760 350' }, '#00ff88', 3);
        this.createElement('road-right', 'path', { d: 'M 1920 1080 L 1160 350' }, '#00ff88', 3);
        
        // Center road divider
        this.createElement('center-line', 'path', { d: 'M 960 1080 L 960 350' }, '#ffff00', 4);
        
        // Road stripes (dashed center line effect)
        for (let i = 0; i < 8; i++) {
            const y1 = 1080 - (i * 90);
            const y2 = y1 - 40;
            this.createElement(`stripe-${i}`, 'line', { x1: 960, y1, x2: 960, y2 }, '#ffff00', 6);
        }
        
        // Side road markers
        for (let i = 0; i < 6; i++) {
            const y = 400 + (i * 120);
            const leftX = 760 - (i * 80);
            const rightX = 1160 + (i * 80);
            this.createElement(`marker-l${i}`, 'line', { x1: leftX, y1: y, x2: leftX - 20, y2: y }, '#ff4444', 3);
            this.createElement(`marker-r${i}`, 'line', { x1: rightX, y1: y, x2: rightX + 20, y2: y }, '#ff4444', 3);
        }
    }
    
    createElement(id: string, type: string, attrs: any, stroke: string, strokeWidth: number) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', type);
        element.setAttribute('id', id);
        element.setAttribute('stroke', stroke);
        element.setAttribute('stroke-width', strokeWidth.toString());
        element.setAttribute('fill', 'none');
        element.setAttribute('vector-effect', 'non-scaling-stroke');
        
        Object.entries(attrs).forEach(([key, value]) => {
            element.setAttribute(key, value.toString());
        });
        
        this.svg.appendChild(element);
        this.elements.set(id, element);
        return element;
    }
    
    startBeatAnimation() {
        const animateElements = () => {
            const intensity = this.beatData.volume * 3;
            
            // Animate road elements with beat-reactive effects
            this.elements.forEach((element, id) => {
                if (this.animations.has(id)) {
                    const existingAnimation = this.animations.get(id);
                    if (existingAnimation) {
                        existingAnimation.pause();
                        existingAnimation.remove?.();
                    }
                    this.animations.delete(id);
                }
                
                let animation;
                if (id.includes('stripe')) {
                    // Road stripes pulse and move
                    animation = anime({
                        targets: element,
                        strokeWidth: [{ value: 6 + intensity }, { value: 6 }],
                        opacity: [{ value: 1 }, { value: 0.3 }, { value: 1 }],
                        duration: 300,
                        easing: 'easeOutQuad'
                    });
                } else {
                    // Other elements subtle pulse with fixed values
                    const baseWidth = parseFloat(element.getAttribute('stroke-width') || '2');
                    animation = anime({
                        targets: element,
                        strokeWidth: [{ value: baseWidth + intensity }, { value: baseWidth }],
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
                
                this.animations.set(id, animation);
            });
        };
        
        // Beat detection - clear any existing interval first
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
        }
        
        this.beatInterval = setInterval(() => {
            if (scenes.synth?.state) {
                this.beatData.step = scenes.synth.state.step || 0;
                this.beatData.volume = 0.5;
                
                if (this.beatData.step % 4 === 0) {
                    animateElements();
                }
            }
        }, 50);
    }
    
    updateBeatData(data: { step?: number; volume?: number }) {
        this.beatData = { ...this.beatData, ...data };
    }

    // Update road position based on wheel steering input
    updateRoadPosition(position: number) {
        // Convert position (0-1) to road offset
        // Position 0.5 = center, 0 = left, 1 = right
        const centerOffset = (position - 0.5) * 200; // Scale factor for road movement
        
        // Apply position offset to road elements
        this.elements.forEach((element, id) => {
            if (id.includes('road-left') || id.includes('road-right')) {
                // Main road perspective lines
                const currentPath = element.getAttribute('d');
                if (id === 'road-left') {
                    const newPath = `M ${-centerOffset} 1080 L ${760 - centerOffset} 350`;
                    element.setAttribute('d', newPath);
                } else if (id === 'road-right') {
                    const newPath = `M ${1920 - centerOffset} 1080 L ${1160 - centerOffset} 350`;
                    element.setAttribute('d', newPath);
                }
            } else if (id.includes('center-line')) {
                // Center road divider
                const newPath = `M ${960 - centerOffset} 1080 L ${960 - centerOffset} 350`;
                element.setAttribute('d', newPath);
            } else if (id.includes('stripe-')) {
                // Road stripes
                const currentX1 = parseFloat(element.getAttribute('x1') || '960');
                const currentX2 = parseFloat(element.getAttribute('x2') || '960');
                element.setAttribute('x1', (960 - centerOffset).toString());
                element.setAttribute('x2', (960 - centerOffset).toString());
            } else if (id.includes('marker-l')) {
                // Left side markers
                const markerIndex = parseInt(id.split('marker-l')[1]);
                const baseX = 760 - (markerIndex * 80);
                element.setAttribute('x1', (baseX - centerOffset).toString());
                element.setAttribute('x2', (baseX - 20 - centerOffset).toString());
            } else if (id.includes('marker-r')) {
                // Right side markers
                const markerIndex = parseInt(id.split('marker-r')[1]);
                const baseX = 1160 + (markerIndex * 80);
                element.setAttribute('x1', (baseX - centerOffset).toString());
                element.setAttribute('x2', (baseX + 20 - centerOffset).toString());
            }
        });
    }
    
    setVisibility(visible: boolean) {
        this.container.style.display = visible ? 'block' : 'none';
    }
    
    setOpacity(opacity: number) {
        this.container.style.opacity = opacity.toString();
    }
    
    destroy() {
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
        
        // Stop all animations
        this.animations.forEach(animation => {
            if (animation) {
                animation.pause();
                animation.remove?.();
            }
        });
        this.animations.clear();
        
        // Clear elements from DOM
        this.elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.elements.clear();
    }
}

// Global instance
export let vectorGraphics: VectorGraphics | null = null;

export function initVectorGraphics() {
    if (!vectorGraphics) {
        vectorGraphics = new VectorGraphics();
    } else {
        // If already exists, make sure it's properly cleaned up and restarted
        vectorGraphics.destroy();
        vectorGraphics = new VectorGraphics();
    }
    return vectorGraphics;
}

export function getVectorGraphics() {
    return vectorGraphics;
}
