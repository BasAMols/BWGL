import { GlElement, GlElementAttributes } from '../gl/elementBase';
import { Color } from './colors';
import { GlElementType } from '../gl/glRenderer';
import { Vector2 } from "./vector2";
import { Vector3 } from './vector3';
import { Collider } from './collider';
import { GLCuboid } from '../gl/cuboid';
import { TickerReturnData } from './ticker';

export type levelAttributes = GlElementAttributes & {
    size3?: Vector3;
};
export abstract class Level extends GlElement {
    abstract start: Vector2;
    abstract background: Color;
    public type: GlElementType = 'group';
    public levelColliders: Collider[] = [];
    private colliderMeshes: GLCuboid[] = [];

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

    addCollider(c: Collider) {
        this.levelColliders.push(c);
        
        // const mesh = new GLCuboid({
        //     size: c.size,
        //     colors: [Colors.r],
        //     opacity: 0.3,
        // });
        // this.colliderMeshes.push(mesh);
        // this.addChild(mesh);
    }

    public get camera(): typeof this._camera {
        return this._camera;
    }
    public set camera(value: typeof this._camera) {
        this._camera = value;
    }

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.size = this.size;
    }

    public build(): void {
        this.game.active.level = this;
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        this.colliderMeshes.forEach((c,i)=>{
            // console.log(c.size.vec);
            c.position = this.levelColliders[i].worldPosition;
            c.size = this.levelColliders[i].size.clone();
            // c.rotation = this.levelColliders[i].worldRotation.clone();
        });

    }

}
