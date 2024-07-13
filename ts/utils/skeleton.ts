import { GlElementAttributes } from '../gl/elementBase';
import { GLGroup } from '../gl/group';
import { Bone } from './skeleton_bone';
import { Animator } from './animation';
import { TickerReturnData } from './ticker';

export type HumanSkeletonLimbsSizes = 'hipsWidth' | 'shoulderWidth' | 'head' | 'torso' | 'armUpper' | 'armLower' | 'hand' | 'legUpper' | 'legLower' | 'foot' | 'hips';
export type HumanSkeletonLimbs =
    'head' | 'torso' | 'hips' |
    'lArmUpper' | 'lArmLower' | 'lHand' |
    'lLegUpper' | 'lLegLower' | 'lFoot' |
    'rArmUpper' | 'rArmLower' | 'rHand' |
    'rLegUpper' | 'rLegLower' | 'rFoot';

export type SkeletonAttributes = GlElementAttributes & {
    bones?: [string, Bone, string?][];
};

export abstract class Skeleton extends GLGroup {

    public bones: Record<string, Bone> = {};
    public parentage: Record<string, string> = {};
    public animator: Animator;

    constructor(attr: SkeletonAttributes = {}) {
        super(attr);
        attr.bones.forEach((o) => {
            this.addBone(o);
        });
    }
    addBone(o: [string, Bone, string?]) {

        this.bones[o[0]] = o[1];
        if (o[2]) {
            this.parentage[o[0]] = o[2];
        }
        if (this.readyState) {
            if (this.parentage[o[0]]) {
                this.bones[this.parentage[o[0]]].addChild(o[1]);
            } else {
                this.addChild(o[1]);
            }
            this.animator.bones = this.bones;
        }
    }

    public build(): void {
        super.build();
        Object.entries(this.bones).forEach(([key, b]) => {
            if (this.parentage[key]) {
                this.bones[this.parentage[key]].addChild(b);
            } else {
                this.addChild(b);
            }
        });
        this.animator = new Animator({ bones: this.bones });
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.animator.tick(obj.intervalS10);
    }
}
