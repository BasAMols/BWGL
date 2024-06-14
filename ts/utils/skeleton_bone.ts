import { GLCuboid } from '../gl/cuboid';
import { Vector3, v3 } from './vector3';
import { GlElementAttributes } from '../gl/elementBase';
import { TickerReturnData } from './ticker';
import { GLGroup } from '../gl/group';
import { Color } from './colors';
import { Vector2, v2 } from './vector2';


export type BoneAttributes = GlElementAttributes & {
    profile?: Vector2;
    length?: number;
    mesh?: boolean;
    speed?: number;
    baseRotation?: Vector3;
};

export class Bone extends GLGroup {
    private length: number;
    private profile: Vector2;
    private mesh: boolean;
    public speed: number;
    private baseRotation: Vector3;
    private basePosition: Vector3;

    private target: Vector3;
    constructor(attr: BoneAttributes = {}) {
        super(attr);
        this.mesh = attr.mesh === undefined ? false : attr.mesh;
        this.length = attr.length === undefined ? 10 : attr.length;
        this.profile = attr.profile || v2(0);
        this.speed = attr.speed === undefined ? 0.02 : attr.speed;
        this.baseRotation = attr.baseRotation || v3(0);
        this.basePosition = this.position || v3(0);
        this.size = v3(this.profile.x, this.length, this.profile.y);

        if (!attr.anchorPoint) {
            this.anchorPoint = v3(
                this.profile.x / 2,
                this.length,
                this.profile.y / 2
            );
        }
        this.rotation = this.baseRotation;
    }
    public setRotation(r: Vector3, dynamically: boolean = false) {
        this.target = this.baseRotation.add(r.clone());
        if (!dynamically){
            this.rotation = this.target.clone();
        }
    }
    public setPosition(r: Vector3, dynamically: boolean = false) {
        this.position = this.basePosition.add(r.clone());
    }
    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        if (!this.target) return;

        const dif = this.rotation.subtract(this.target);

        if (dif.magnitude() === 0) return;

        const movement = v3(
            this.target.x > this.rotation.x ? Math.abs(dif.x) : -Math.abs(dif.x),
            this.target.y > this.rotation.y ? Math.abs(dif.y) : -Math.abs(dif.y),
            this.target.z > this.rotation.z ? Math.abs(dif.z) : -Math.abs(dif.z)
        ).clamp(
            v3(-this.speed, -this.speed, -this.speed).scale(obj.interval / 6),
            v3(this.speed, this.speed, this.speed).scale(obj.interval / 6)
        );

        this.rotation = this.rotation.add(movement);
    }
    public build(): void {
        super.build();
        if (this.mesh) {
            this.addChild(new GLCuboid({
                colors: [[0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1], [0.8, 0.8, 0.8, 1]] as [Color, Color?, Color?, Color?, Color?, Color?],
                size: this.size,
            }));
        }
    }
}