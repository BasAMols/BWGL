import { GLCuboid } from '../../gl/cuboid';
import { Vector3, v3 } from '../../utils/vector3';
import { GlElementAttributes } from '../../gl/elementBase';
import { TickerReturnData } from '../../utils/ticker';
import { GLGroup } from '../../gl/group';
import { Color } from '../../utils/colors';
import { Vector2, v2 } from '../../utils/vector2';
import { Player } from './player';


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
    private target: Vector3;
    constructor(attr: BoneAttributes = {}) {
        super(attr);
        this.mesh = attr.mesh === undefined ? false : attr.mesh;
        this.length = attr.length === undefined ? 10 : attr.length;
        this.profile = attr.profile || v2(0);
        this.speed = attr.speed === undefined ? 0.015 : attr.speed;
        this.baseRotation = attr.baseRotation || v3(0);
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
    public setRotation(r: Vector3) {
        this.target = this.baseRotation.add(r.clone());
    }
    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        if (!this.target) return;

        const dif = this.rotation.subtract(this.target);

        if (this.length === 13) {
            // console.log(this.rotation.array);
        }

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

export type SkeletonBonesSizes = 'hipsWidth'|'shoulderWidth'|'head' | 'torso' | 'armUpper' |'armLower' | 'hand' | 'legUpper'| 'legLower' | 'foot' | 'hips';
export type SkeletonBones = 'head' | 'torso' | 'hips' |
    'lArmUpper' | 'lArmLower' | 'lHand' |
    'lLegUpper' | 'lLegLower' | 'lFoot' |
    'rArmUpper' | 'rArmLower' | 'rHand' |
    'rLegUpper' | 'rLegLower' | 'rFoot';

export type SkeletonAttributes = GlElementAttributes & {
    boneSizes?: Record<SkeletonBonesSizes, number>;
};

export class Skeleton extends GLGroup {
    public parent: Player;
    head: Bone;
    torso: Bone;

    lArmUpper: Bone;
    lArmElbow: Bone;
    lArmLower: Bone;
    lHand: Bone;

    lLegUpper: Bone;
    lLegKnee: Bone;
    lLegLower: Bone;
    lFoot: Bone;

    rArmUpper: Bone;
    rArmElbow: Bone;
    rArmLower: Bone;
    rHand: Bone;

    rLegUpper: Bone;
    rLegKnee: Bone;
    rLegLower: Bone;
    rFoot: Bone;

    sizes: Record<SkeletonBonesSizes, number>;

    runTime: number = 0;
    idleTime: number = 0;
    hips: Bone;
    animation: Record<string, Record<SkeletonBones, [number?, [number?, number?, number?]?]>> = {};

    constructor(attr: SkeletonAttributes = {}) {
        super(attr);
        this.sizes = attr.boneSizes || {
            'head': 6,
            'armUpper': 6,
            'armLower': 3,
            'hand': 3,
            'legUpper': 5,
            'legLower': 4,
            'foot': 2,
            'torso': 8,
            'hips': 5,
            'hipsWidth': 4,
            'shoulderWidth': 4,
        };
    }

    public build(): void {
        super.build();

        this.hips = this.addChild(new Bone({ speed: 0.01, profile: v2(this.sizes.hipsWidth, 1), length: this.sizes.hips, position: v3(0, this.sizes.legUpper + this.sizes.legLower + this.sizes.foot, 2), })) as Bone;
        this.torso = this.hips.addChild(new Bone({ speed: 0.01, anchorPoint: v3(this.sizes.shoulderWidth/2, 0, 0), baseRotation: v3(0,0,0), profile: v2(this.sizes.shoulderWidth, 1), length: this.sizes.torso, position: v3(-(this.sizes.shoulderWidth-this.sizes.hipsWidth)/2, this.sizes.hips, 0), })) as Bone;
        this.head = this.torso.addChild(new Bone({ speed: 0.005, profile: v2(4, 3), length: this.sizes.head, anchorPoint: v3(2, 0, 1), position: v3((this.sizes.shoulderWidth-4)/2, this.sizes.torso + 1, -1), })) as Bone;

        this.lArmUpper = this.torso.addChild(new Bone({ profile: v2(1), baseRotation: v3(-0.1,0,0.4), length: this.sizes.armUpper, position: v3(0, this.sizes.torso - this.sizes.armUpper, 0),  })) as Bone;
        this.rArmUpper = this.torso.addChild(new Bone({ profile: v2(1), baseRotation: v3(-0.1,0,-0.4), length: this.sizes.armUpper, position: v3(this.sizes.shoulderWidth-1, this.sizes.torso - this.sizes.armUpper, 0), })) as Bone;
        this.lArmLower = this.lArmUpper.addChild(new Bone({ speed: 0.03, baseRotation: v3(0.2,0,-0.3), profile: v2(1), length: this.sizes.armLower, position: v3(0, -this.sizes.armLower, 0), })) as Bone;
        this.rArmLower = this.rArmUpper.addChild(new Bone({ speed: 0.03, baseRotation: v3(0.2,0,0.3), profile: v2(1), length: this.sizes.armLower, position: v3(0, -this.sizes.armLower, 0), })) as Bone;
        this.lHand = this.lArmLower.addChild(new Bone({ profile: v2(1), length: this.sizes.hand, position: v3(0, -this.sizes.hand, 0) })) as Bone;
        this.rHand = this.rArmLower.addChild(new Bone({ profile: v2(1), length: this.sizes.hand, position: v3(0, -this.sizes.hand, 0) })) as Bone;

        this.lLegUpper = this.hips.addChild(new Bone({ profile: v2(1), length: this.sizes.legUpper, position: v3(0, -this.sizes.legUpper, 0), })) as Bone;
        this.rLegUpper = this.hips.addChild(new Bone({ profile: v2(1), length: this.sizes.legUpper, position: v3(this.sizes.hipsWidth-1, -this.sizes.legUpper, 0), })) as Bone;
        this.lLegLower = this.lLegUpper.addChild(new Bone({ speed: 0.03, profile: v2(1), length: this.sizes.legLower, position: v3(0, -this.sizes.legLower, 0) })) as Bone;
        this.rLegLower = this.rLegUpper.addChild(new Bone({ speed: 0.03, profile: v2(1), length: this.sizes.legLower, position: v3(0, -this.sizes.legLower, 0) })) as Bone;
        this.lFoot = this.lLegLower.addChild(new Bone({ profile: v2(1, 3), length: this.sizes.foot, position: v3(-0, -this.sizes.foot, -0) })) as Bone;
        this.rFoot = this.rLegLower.addChild(new Bone({ profile: v2(1,3), length: this.sizes.foot, position: v3(-0, -this.sizes.foot, -0) })) as Bone;


    }

    public setLimbRotation(key: string, time: number, rotation: Vector3 = v3(0)) {
        const bone = ((this as any)[key] as Bone);
        if (bone) {
            bone.speed = time;
            bone.setRotation(rotation);
        }
    }

    public setPose(p: string = '') {

        const a = this.animation[p];
        if (a) {
            Object.entries(a).forEach(([key, [time, val]]) => {
                this.setLimbRotation(key, time, v3(val));
            });
        }

    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        // console.log(this.parent.stat.fallAnimation);

        this.runTime = (this.runTime + obj.interval) % 1400;
        this.idleTime = (this.idleTime + obj.interval) % 12000;
        // this.setPose(this.runTime < 800 ? 'running1' : 'running2');
        if (!this.parent.stat.ground) {
            this.setPose('jump');
        } else {
            if (this.parent.stat.running) {
                this.setPose(this.runTime < 700 ? 'running1' : 'running2');
            } else {
                this.setPose(this.idleTime < 6000 ? 'idle' : 'idle2');
            }
        }
    }
}
