import { Vector3, v3 } from './vector3';
import { GlElementAttributes } from '../gl/elementBase';
import { GLGroup } from '../gl/group';
import { v2 } from './vector2';
import { Bone } from './skeleton_bone';

export type HumanSkeletonLimbsSizes = 'hipsWidth' | 'shoulderWidth' | 'head' | 'torso' | 'armUpper' | 'armLower' | 'hand' | 'legUpper' | 'legLower' | 'foot' | 'hips';
export type HumanSkeletonLimbs =
    'head' | 'torso' | 'hips' |
    'lArmUpper' | 'lArmLower' | 'lHand' |
    'lLegUpper' | 'lLegLower' | 'lFoot' |
    'rArmUpper' | 'rArmLower' | 'rHand' |
    'rLegUpper' | 'rLegLower' | 'rFoot';

export type SkeletonAttributes = GlElementAttributes & {
    boneSizes?: Record<HumanSkeletonLimbsSizes, number>;
};

export class HumanSkeleton extends GLGroup {
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

    sizes: Record<HumanSkeletonLimbsSizes, number>;
    hips: Bone;
    animation: Record<string, Record<HumanSkeletonLimbs, [number?, [number?, number?, number?]?]>> = {};

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
        this.torso = this.hips.addChild(new Bone({ speed: 0.01, anchorPoint: v3(this.sizes.shoulderWidth / 2, 0, 0), baseRotation: v3(0, 0, 0), profile: v2(this.sizes.shoulderWidth, 1), length: this.sizes.torso, position: v3(-(this.sizes.shoulderWidth - this.sizes.hipsWidth) / 2, this.sizes.hips, 0), })) as Bone;
        this.head = this.torso.addChild(new Bone({ speed: 0.005, profile: v2(4, 3), length: this.sizes.head, anchorPoint: v3(2, 0, 1), position: v3((this.sizes.shoulderWidth - 4) / 2, this.sizes.torso + 1, -1), })) as Bone;

        this.lArmUpper = this.torso.addChild(new Bone({ profile: v2(1), baseRotation: v3(-0.1, 0, 0.4), length: this.sizes.armUpper, position: v3(0, this.sizes.torso - this.sizes.armUpper, 0), })) as Bone;
        this.rArmUpper = this.torso.addChild(new Bone({ profile: v2(1), baseRotation: v3(-0.1, 0, -0.4), length: this.sizes.armUpper, position: v3(this.sizes.shoulderWidth - 1, this.sizes.torso - this.sizes.armUpper, 0), })) as Bone;
        this.lArmLower = this.lArmUpper.addChild(new Bone({ speed: 0.03, baseRotation: v3(0.2, 0, -0.3), profile: v2(1), length: this.sizes.armLower, position: v3(0, -this.sizes.armLower, 0), })) as Bone;
        this.rArmLower = this.rArmUpper.addChild(new Bone({ speed: 0.03, baseRotation: v3(0.2, 0, 0.3), profile: v2(1), length: this.sizes.armLower, position: v3(0, -this.sizes.armLower, 0), })) as Bone;
        this.lHand = this.lArmLower.addChild(new Bone({ profile: v2(1), length: this.sizes.hand, position: v3(0, -this.sizes.hand, 0) })) as Bone;
        this.rHand = this.rArmLower.addChild(new Bone({ profile: v2(1), length: this.sizes.hand, position: v3(0, -this.sizes.hand, 0) })) as Bone;

        this.lLegUpper = this.hips.addChild(new Bone({ profile: v2(1), length: this.sizes.legUpper, position: v3(0, -this.sizes.legUpper, 0), })) as Bone;
        this.rLegUpper = this.hips.addChild(new Bone({ profile: v2(1), length: this.sizes.legUpper, position: v3(this.sizes.hipsWidth - 1, -this.sizes.legUpper, 0), })) as Bone;
        this.lLegLower = this.lLegUpper.addChild(new Bone({ speed: 0.03, profile: v2(1), length: this.sizes.legLower, position: v3(0, -this.sizes.legLower, 0) })) as Bone;
        this.rLegLower = this.rLegUpper.addChild(new Bone({ speed: 0.03, profile: v2(1), length: this.sizes.legLower, position: v3(0, -this.sizes.legLower, 0) })) as Bone;
        this.lFoot = this.lLegLower.addChild(new Bone({ profile: v2(1, 3), length: this.sizes.foot, position: v3(-0, -this.sizes.foot, -0) })) as Bone;
        this.rFoot = this.rLegLower.addChild(new Bone({ profile: v2(1, 3), length: this.sizes.foot, position: v3(-0, -this.sizes.foot, -0) })) as Bone;


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
}
