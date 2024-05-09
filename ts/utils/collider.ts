import { GlElement, GlElementAttributes } from '../gl/elementBase';
import { GlElementType } from '../gl/glRenderer';
import { GlMesh } from '../gl/mesh';
import { Colors } from './colors';
import { Vector3, v3 } from './vector3';


export type ColliderAttributes = GlElementAttributes & {
    direction: Vector3,
};

export type ColliderType = 'static' | 'dynamic';

export class Collider extends GlElement {
    public type: GlElementType = 'collider';
    public colliderType: ColliderType = 'static';
    public direction: Vector3;
    public debugObject: GlElement;

    public constructor(attr: ColliderAttributes) {
        super(attr);
        this.direction = attr.direction;
    }

    public build(): void {
        this.debugObject = this.addChild(new GlMesh({ size: this.size, position: this.position, colors: [Colors.w] }));
        this.debugObject.addChild(new GlMesh({ 
            position: this.direction.multiply(this.size).scale(0.5),
            size: this.direction.multiply(v3(10,10,10)).scale(0.5), 
            colors: [Colors.r], 
            rotation: this.direction.scale(Math.PI) 
        }));
    }
}