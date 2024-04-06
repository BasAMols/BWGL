import { CanvasSquare } from '../elements/canvas/canvasSquare';
import { CanvasWrapper, CanvasWrapperAttributes } from '../elements/canvas/canvasWrapper';
import { Collider } from './collider';
import { ElementRelativity } from './elementPosition';
import { Vector2 } from "./vector2";
import { Vector3 } from './vector3';

export type levelAttributes =  CanvasWrapperAttributes & {
    depth?: number;
}
export abstract class Level extends CanvasWrapper{
    abstract start: Vector2;
    abstract background: CanvasSquare;
    public relativity: ElementRelativity = 'anchor';
    public ready = false;
    public colliders: Collider[] = [];
    public depth: number;
    public get center(): Vector3 {
        return Vector3.from2(this.mode.size.scale(0.5).subtract(this.position), this.depth);
    }

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.level = this;
        this.mode = this.mode;
        this.size = this.size;

        this.depth = attr.depth || 1;
    }

}
