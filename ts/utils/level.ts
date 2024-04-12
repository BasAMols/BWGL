import { CanvasSquare } from '../elements/canvas/canvasSquare';
import { CanvasWrapper, CanvasWrapperAttributes } from '../elements/canvas/canvasWrapper';
import { Collider } from './collider';
import { ElementRelativity } from './elementPosition';
import { Vector2 } from "./vector2";
import { Vector3, v3 } from './vector3';

export type levelAttributes =  CanvasWrapperAttributes & {
    size3?: Vector3;
}
export abstract class Level extends CanvasWrapper{
    abstract start: Vector2;
    abstract background: CanvasSquare;
    public relativity: ElementRelativity = 'anchor';
    public colliders: Collider[] = [];
    public get center(): Vector3 {
        return Vector3.from2(this.mode.size.scale(0.5).subtract(this.position), this.depth);
    }

    public get width() { return super.width; }
    public set width(n: number) { super.width = n; }

    public get height() { return super.height; }
    public set height(n: number) { super.height = n; }

    private _depth: number = 1;
    public get depth() { return this._depth; }
    public set depth(n: number) { this._depth = n; }

    public get size3() { return v3(this.width,this.height,this.depth); }
    public set size3({x, y, z}: Vector3) {
        this.width = x;
        this.height = y;
        this.depth = z;
    }

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.level = this;
        this.mode = this.mode;
        this.size = this.size;
        this.size3 = attr.size3;
    }

}
