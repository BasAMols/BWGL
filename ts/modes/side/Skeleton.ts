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
                colors: [[0.05, 0.2, 0.3, 1], [0.2, 0.3, 0.4, 1], [0.2, 0.3, 0.4, 1], [0.2, 0.3, 0.4, 1], [0.2, 0.3, 0.4, 1], [0.2, 0.3, 0.4, 1]] as [Color, Color?, Color?, Color?, Color?, Color?],
                size: this.size,
            }));
        }
    }
}

export type SkeletonBonesSizes = 'head' | 'torso' | 'armUpper' | 'armElbow' | 'armLower' | 'hand' | 'legUpper' | 'legKnee' | 'legLower' | 'foot' | 'hips';
export type SkeletonBones = 'head' | 'torso' |
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

    constructor(attr: SkeletonAttributes = {}) {
        super(attr);
        this.sizes = attr.boneSizes || {
            'head': 6,
            'armUpper': 6,
            'armElbow': 0,
            'armLower': 3,
            'hand': 3,
            'legUpper': 5,
            'legKnee': 0,
            'legLower': 4,
            'foot': 2,
            'torso': 8,
            'hips': 5,
        };
    }

    public build(): void {
        super.build();

        this.torso = this.addChild(new Bone({ speed: 0.01, profile: v2(4, 4), length: this.sizes.torso, position: v3(0, this.sizes.legUpper + this.sizes.legKnee + this.sizes.legLower + this.sizes.foot+this.sizes.hips, 3), })) as Bone;
        this.hips = this.torso.addChild(new Bone({ speed: 0.01, profile: v2(4, 4), length: this.sizes.hips, position: v3(0, -this.sizes.hips, 0), })) as Bone;
        this.head = this.torso.addChild(new Bone({ speed: 0.005, profile: v2(5, 6), length: this.sizes.head, anchorPoint: v3(3, 0, 2.5), position: v3(0.5-1, this.sizes.torso + 1, -1), })) as Bone;

        this.lArmUpper = this.torso.addChild(new Bone({ profile: v2(2.4), baseRotation: v3(-0.1,0,0.4), length: this.sizes.armUpper, position: v3(-3.5 + 2.5-1, this.sizes.torso - this.sizes.armUpper, 1), })) as Bone;
        this.rArmUpper = this.torso.addChild(new Bone({ profile: v2(2.4), baseRotation: v3(-0.1,0,-0.4), length: this.sizes.armUpper, position: v3(4.5-1, this.sizes.torso - this.sizes.armUpper, 1), })) as Bone;
        this.lArmLower = this.lArmUpper.addChild(new Bone({ speed: 0.03, baseRotation: v3(0.2,0,-0.3), profile: v2(2), length: this.sizes.armLower, position: v3(0.2, -this.sizes.armLower, 0.2) })) as Bone;
        this.rArmLower = this.rArmUpper.addChild(new Bone({ speed: 0.03, baseRotation: v3(0.2,0,0.3), profile: v2(2), length: this.sizes.armLower, position: v3(0.2, -this.sizes.armLower, 0.2) })) as Bone;
        this.lHand = this.lArmLower.addChild(new Bone({ profile: v2(3), length: this.sizes.hand, position: v3(-0.5, -this.sizes.hand, -0.5) })) as Bone;
        this.rHand = this.rArmLower.addChild(new Bone({ profile: v2(3), length: this.sizes.hand, position: v3(-0.5, -this.sizes.hand, -0.5) })) as Bone;

        this.lLegUpper = this.hips.addChild(new Bone({ profile: v2(3), length: this.sizes.legUpper, position: v3(-1-1, -this.sizes.legUpper, 0), })) as Bone;
        this.rLegUpper = this.hips.addChild(new Bone({ profile: v2(3), length: this.sizes.legUpper, position: v3(4-1, -this.sizes.legUpper, 0), })) as Bone;
        this.lLegLower = this.lLegUpper.addChild(new Bone({ speed: 0.03, profile: v2(2), length: this.sizes.legLower, position: v3(0.5, -this.sizes.legLower, 0.5) })) as Bone;
        this.rLegLower = this.rLegUpper.addChild(new Bone({ speed: 0.03, profile: v2(2), length: this.sizes.legLower, position: v3(0.5, -this.sizes.legLower, 0.5) })) as Bone;
        this.lFoot = this.lLegLower.addChild(new Bone({ profile: v2(3, 6), length: this.sizes.foot, position: v3(-0.5, -this.sizes.foot, -0.5) })) as Bone;
        this.rFoot = this.rLegLower.addChild(new Bone({ profile: v2(3, 6), length: this.sizes.foot, position: v3(-0.5, -this.sizes.foot, -0.5) })) as Bone;


    }

    public setLimbRotation(key: string, time: number, rotation: Vector3 = v3(0)) {
        const bone = ((this as any)[key] as Bone);
        if (bone) {
            bone.speed = time;
            bone.setRotation(rotation);
        }
    }

    public setPose(p: string = '') {

        const animation: Record<string, Record<SkeletonBones, [number?, [number?, number?, number?]?]>> = {
            running1: {
                torso: [0.01, [-0.3, -0.3, 0]],
                head: [0.005, [0.2, 0.2, 0]],
                lArmUpper: [0.015, [-0.8, 0, 0.1]],
                lArmLower: [0.01, [0.3, 0, 0]],
                lHand: [0.015, []],
                rArmUpper: [0.015, [1.2, 0, -0.1]],
                rArmLower: [0.01, [1.2, 0, 1.2]],
                rHand: [0.015, []],
                lLegUpper: [0.015, [1.2, 0, 0]],
                lLegLower: [0.03, [-0.3, 0, 0]],
                lFoot: [0.015, [-0.2, 0, 0]],
                rLegUpper: [0.015, []],
                rLegLower: [0.03, [-2, 0, 0]],
                rFoot: [0.015, [-0.2, 0, 0]],
            },
            running2: {
                torso: [0.01, [-0.3, 0.3, 0]],
                head: [0.005, [0.2, -0.2, 0]],
                lArmUpper: [0.015, [1.2, 0, 0.1]],
                lArmLower: [0.01, [1.2, 0, -1.2]],
                lHand: [0.015, []],
                rArmUpper: [0.015, [-0.8, 0, -0.1]],
                rArmLower: [0.01, [0.3, 0, 0]],
                rHand: [0.015, []],
                lLegUpper: [0.03, []],
                lLegLower: [0.015, [-2, 0, 0]],
                lFoot: [0.015, [-0.2, 0, 0]],
                rLegUpper: [.03, [1.2, 0, 0]],
                rLegLower: [0.015, [-0.3, 0, 0]],
                rFoot: [0.015, [-0.2, 0, 0]],
            },
            T: {
                torso: [0.02, []],
                head: [0.02, []],
                lArmUpper: [0.02, [0, 0, Math.PI / 2]],
                lArmLower: [0.02, []],
                lHand: [0.02, []],
                rArmUpper: [0.02, [0, 0, -Math.PI / 2]],
                rArmLower: [0.02, []],
                rHand: [0.02, []],
                lLegUpper: [0.02, []],
                lLegLower: [0.02, []],
                lFoot: [0.02, []],
                rLegUpper: [0.02, []],
                rLegLower: [0.02, []],
                rFoot: [0.02, []],
            },
            idle: {
                torso: [0.02, []],
                head: [0.005, [0, 0.5]],
                lArmUpper: [0.03, []],
                lArmLower: [0.03, []],
                lHand: [0.03, []],
                rArmUpper: [0.03, []],
                rArmLower: [0.03, []],
                rHand: [0.03, []],
                lLegUpper: [0.04, []],
                lLegLower: [0.05, []],
                lFoot: [0.03, []],
                rLegUpper: [0.03, []],
                rLegLower: [0.03, []],
                rFoot: [0.03, []],
            },
            idle2: {
                torso: [0.02, []],
                head: [0.005, [0, -0.5]],
                lArmUpper: [0.03, []],
                lArmLower: [0.03, []],
                lHand: [0.03, []],
                rArmUpper: [0.03, []],
                rArmLower: [0.03, []],
                rHand: [0.03, []],
                lLegUpper: [0.04, []],
                lLegLower: [0.05, []],
                lFoot: [0.03, []],
                rLegUpper: [0.03, []],
                rLegLower: [0.03, []],
                rFoot: [0.03, []],
            },
            // idle: {
            //     torso: [0.02, []],
            //     head: [0.005, [0, 0.5]],
            //     lArmUpper: [0.03, [0.8, 0.2, -0.4]],
            //     lArmLower: [0.03, [0, 0.2, -0.8]],
            //     lHand: [0.03, []],
            //     rArmUpper: [0.03, [.4, -0.2, 0.4]],
            //     rArmLower: [0.03, [0, 0, 0.7]],
            //     rHand: [0.03, []],
            //     lLegUpper: [0.04, []],
            //     lLegLower: [0.05, []],
            //     lFoot: [0.03, []],
            //     rLegUpper: [0.03, []],
            //     rLegLower: [0.03, []],
            //     rFoot: [0.03, []],
            // },
            // idle2: {
            //     torso: [0.02, []],
            //     head: [0.005, [0, -0.5]],
            //     lArmUpper: [0.03, [0.8, 0.2, -0.4]],
            //     lArmLower: [0.03, [0, 0.2, -0.8]],
            //     lHand: [0.03, []],
            //     rArmUpper: [0.03, [.4, -0.2, 0.4]],
            //     rArmLower: [0.03, [0, 0, 0.7]],
            //     rHand: [0.03, []],
            //     lLegUpper: [0.04, []],
            //     lLegLower: [0.05, []],
            //     lFoot: [0.03, []],
            //     rLegUpper: [0.03, []],
            //     rLegLower: [0.03, []],
            //     rFoot: [0.03, []],
            // },
            jump: {
                torso: [0.03, [-0.1, -0.1, 0.15]],
                head: [0.03, [0.3, 0, 0]],
                lArmUpper: [0.03, [-0.2, 0, 0.1]],
                lArmLower: [0.03, [0, 0, 0.2]],
                lHand: [0.03, []],
                rArmUpper: [0.03, [-0.1, 0, -0.3]],
                rArmLower: [0.03, [0, 0, 0.2]],
                rHand: [0.03, []],
                lLegUpper: [0.06, [2, 0, 0]],
                lLegLower: [0.08, [-2.4, 0, 0]],
                lFoot: [0.03, []],
                rLegUpper: [0.03, [-0.2, 0, 0]],
                rLegLower: [0.03, [-0.3, 0, 0]],
                rFoot: [0.03, [-0.6, 0, 0]],
            }
        };

        const a = animation[p];
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
