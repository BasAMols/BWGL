import { CanvasElement, CanvasElementAttributes, CanvasElementType } from '../elements/canvas/canvasElement';
import { ElementRelativity } from './elementPosition';

export type ColliderAttributes = CanvasElementAttributes & {
    cornerTolerance?: number;
    colliderType?: ColliderType,
    condition?: () => void;
    callback?: () => void;
}

export type ColliderType = 'static' | 'dynamic';

export class Collider extends CanvasElement {
    public type: CanvasElementType = 'collider';
    public relativity: ElementRelativity = 'anchor';
    public colliderType: ColliderType = 'static';
    public cornerTolerance: number;
    public callback: () => void;
    public condition: () => void;

    public constructor(attr: ColliderAttributes = {}) {
        super(attr);
        this.cornerTolerance = attr.cornerTolerance || 0;
        this.colliderType = attr.colliderType || 'static';
        this.condition = attr.condition;
        this.callback = attr.callback;
    }

    public build(): void {
        // this.addChild( new CanvasSquare({size: this.size, color: 'rgba(255,0,0,0.5)', rounded: 0}), true);
    }
}