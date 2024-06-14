import { GlElementAttributes } from '../gl/elementBase';
import { v2 } from './vector2';
import { Bone } from './skeleton_bone';
import { Skeleton } from './skeleton';
import { v3 } from './vector3';

export type HumanAttributes = GlElementAttributes & {
    'head': number,
    'armUpper': number,
    'armLower': number,
    'hand': number,
    'legUpper': number,
    'legLower': number,
    'foot': number,
    'torso': number,
    'hips': number,
    'hipsWidth': number,
    'shoulderWidth': number,
};

export class HumanSkeleton extends Skeleton {
    sizes: HumanAttributes;
    constructor(attr: HumanAttributes) {
        super({
            bones: [
                ['hips', new Bone({ profile: v2(attr.hipsWidth, 1), length: attr.hips, position: v3(0, attr.legUpper + attr.legLower + attr.foot, 2), }), ''],
                ['torso', new Bone({ anchorPoint: v3(attr.shoulderWidth / 2, 0, 0), baseRotation: v3(0, 0, 0), profile: v2(attr.shoulderWidth, 1), length: attr.torso, position: v3(-(attr.shoulderWidth - attr.hipsWidth) / 2, attr.hips, 0), }), 'hips'],
                ['head', new Bone({ profile: v2(4, 3), length: attr.head, anchorPoint: v3(2, 0, 1), position: v3((attr.shoulderWidth - 4) / 2, attr.torso + 1, -1), }), 'torso'],
                ['lArmUpper', new Bone({ profile: v2(1), baseRotation: v3(-0.1, 0, 0.4), length: attr.armUpper, position: v3(0, attr.torso - attr.armUpper, 0), }), 'torso'],
                ['rArmUpper', new Bone({ profile: v2(1), baseRotation: v3(-0.1, 0, -0.4), length: attr.armUpper, position: v3(attr.shoulderWidth - 1, attr.torso - attr.armUpper, 0), }), 'torso'],
                ['lArmLower', new Bone({ baseRotation: v3(0.2, 0, -0.3), profile: v2(1), length: attr.armLower, position: v3(0, -attr.armLower, 0), }), 'lArmUpper'],
                ['rArmLower', new Bone({ baseRotation: v3(0.2, 0, 0.3), profile: v2(1), length: attr.armLower, position: v3(0, -attr.armLower, 0), }), 'rArmUpper'],
                ['lHand', new Bone({ profile: v2(1), length: attr.hand, position: v3(0, -attr.hand, 0) }), 'lArmLower'],
                ['rHand', new Bone({ profile: v2(1), length: attr.hand, position: v3(0, -attr.hand, 0) }), 'rArmLower'],
                ['lLegUpper', new Bone({ profile: v2(1), length: attr.legUpper, position: v3(0, -attr.legUpper, 0), }), 'hips'],
                ['rLegUpper', new Bone({ profile: v2(1), length: attr.legUpper, position: v3(attr.hipsWidth - 1, -attr.legUpper, 0), }), 'hips'],
                ['lLegLower', new Bone({ profile: v2(1), length: attr.legLower, position: v3(0, -attr.legLower, 0) }), 'lLegUpper'],
                ['rLegLower', new Bone({ profile: v2(1), length: attr.legLower, position: v3(0, -attr.legLower, 0) }), 'rLegUpper'],
                ['lFoot', new Bone({ profile: v2(1, 3), length: attr.foot, position: v3(-0, -attr.foot, -0) }), 'lLegLower'],
                ['rFoot', new Bone({ profile: v2(1, 3), length: attr.foot, position: v3(-0, -attr.foot, -0) }), 'rLegLower'],
            ]
        });

        this.sizes = attr;
    }
}
