import { v2 } from '../../../classes/math/vector2';
import { Bone } from '../../../classes/animation/skeleton_bone';
import { Skeleton } from '../../../classes/animation/skeleton';
import { v3 } from '../../../classes/math/vector3';

export class BlobSkeleton extends Skeleton {
    constructor() {
        super({
            bones: [
                ['torso', new Bone({ mesh: false, anchorPoint: v3(2.5,4,2), baseRotation: v3(0, 0, 0), profile: v2(5, 4), length: 6, position: v3(0.5, 0, 1), }), ''],
                ['head', new Bone({ mesh: false, profile: v2(4, 4), length: 4, anchorPoint: v3(2, 0, 2), position: v3(0.5, 5, 1), }), 'torso'],
                ['lArm', new Bone({ mesh: false, profile: v2(1.5, 2), length: 5, position: v3(-1.5, 3, 0.7), }), 'torso'],
                ['rArm', new Bone({ mesh: false, profile: v2(1.5, 2), length: 5, position: v3(5, 3, 0.7), }), 'torso'],
            ]
        });
    }
}
