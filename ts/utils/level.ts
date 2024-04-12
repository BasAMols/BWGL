import { CanvasSquare } from '../elements/canvas/canvasSquare';
import { GlElement, GlElementAttributes } from '../elements/gl/glElement';
import { Collider } from './collider';
import { ElementRelativity } from './elementPosition';
import { GlElementType } from './gl';
import { Vector2 } from "./vector2";
import { Vector3 } from './vector3';

export type levelAttributes = GlElementAttributes & {
    size3?: Vector3;
};
export abstract class Level extends GlElement {
    abstract start: Vector2;
    abstract background: CanvasSquare;
    public type: GlElementType = 'group';
    public relativity: ElementRelativity = 'anchor';
    public colliders: Collider[] = [];
    // public get center(): Vector3 {
    //     return Vector3.from2(this.mode.size.scale(0.5).subtract(this.position), this.depth);
    // }

    private _camera: {
        target: Vector3;
        rotation: Vector3;
        offset: Vector3;
        fov: number;
    } = {
            target: Vector3.f(0),
            rotation: Vector3.f(0),
            offset: Vector3.f(0),
            fov: 60,
        };

    public get camera():typeof this._camera {
        return this._camera;
    }
    public set camera(value:typeof this._camera) {
        this._camera = value;
    }

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.level = this;
        this.mode = this.mode;
        this.size = this.size;
    }
}
