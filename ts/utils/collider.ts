import { GlElement, GlElementAttributes } from '../gl/elementBase';
import { GlElementType } from '../gl/glRenderer';
import { GLCuboid as GlCuboid } from '../gl/cuboid';
import { Colors } from './colors';
import { Vector3, v3 } from './vector3';
import { Arrow } from './arrow';


export type ColliderAttributes = GlElementAttributes & {
    direction: Vector3,
    showMesh?: boolean,
    showArrows?: boolean,
};

export type ColliderType = 'static' | 'dynamic';

export class Collider extends GlElement {
    public type: GlElementType = 'collider';
    public colliderType: ColliderType = 'static';
    public direction: Vector3;
    public debugObject: GlElement;
    public showMesh: boolean;
    public showArrows: boolean;

    public constructor(attr: ColliderAttributes) {
        super(attr);
        this.direction = attr.direction;
        this.showMesh = attr.showMesh || false;
        this.showArrows = attr.showArrows || false;
    }

    public build(): void {
        if (this.showMesh) {

            this.debugObject = this.addChild(new GlCuboid({
                size: this.size,
                colors: [Colors.c],
            }));
            
            if (this.showArrows) {
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(1, 1, 1)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(1, 1, 0)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(0, 1, 1)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(1, 0, 1)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(1, 0, 0)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(0, 1, 0)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(0, 0, 1)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
                this.debugObject.addChild(new Arrow({
                    position: this.size.multiply(v3(0, 0, 0)),
                    rotation: Vector3.up.multiply(this.direction)
                }));
            }
        }
    }
}