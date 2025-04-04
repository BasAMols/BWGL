import { v2 } from '../../../classes/math/vector2';
import { Bone } from '../../../classes/animation/skeleton_bone';
import { Skeleton } from '../../../classes/animation/skeleton';
import { v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { Color, Colors } from '../../../classes/util/colors';

export class BlobSkeleton extends Skeleton {
    constructor(sizes = {
        torso: v3(4,6,2),
        head: v3(2,3,2.5),
        arm: v3(1,3,1.2),
        forearm: v3(0.7,2.5,0.7),
        hand: v3(1,0.8,0.2),
        fingers: v3(1,0.7,0.2),
        leg: v3(1.8,3.5,2),
        foreleg: v3(1.5,4,1.5),
        foot: v3(1.5,0.5,2.5),
    }) {
        super({
            bones: [
                ['torso', new Bone({ anchorPoint: sizes.torso.scale(0.5), baseRotation: v3(0, 0, 0), profile: sizes.torso.xz, length: sizes.torso.y, position: v3(0, 8, 0), }), ''],

                ['head', new Bone({ profile: sizes.head.xz, length: sizes.head.y, anchorPoint: v3(1, 0, 1), position: v3(1, 6, 0), }), 'torso'],
                
                ['lEyebrow', new Bone({ profile: v2(0.8, 0.2), length: 0.2, position: v3(0.1, 1.9, 2.5), }), 'head'],
                ['rEyebrow', new Bone({ profile: v2(0.8, 0.2), length: 0.2, position: v3(2 - 0.1 - 0.8, 1.9, 2.5), }), 'head'],
                ['lEye', new Bone({ profile: v2(0.3, 0.1), length: 0.3, position: v3(0.4, 1.5, 2.5), }), 'head'],
                ['rEye', new Bone({ profile: v2(0.3, 0.1), length: 0.3, position: v3(2 - 0.4 - 0.3, 1.5, 2.5), }), 'head'],
                ['hair', new Bone({ profile: v2(2.2, 2.7), length: 0.5, position: v3(-0.1, 3, -0.1), }), 'head'],

                ['lArm', new Bone({ profile: sizes.arm.xz, length: sizes.arm.y, position: v3(-1, 2.5, .3), }), 'torso'],
                ['rArm', new Bone({ profile: sizes.arm.xz, length: sizes.arm.y, position: v3(4, 2.5, .3), }), 'torso'],
                ['lForearm', new Bone({ profile: sizes.forearm.xz, length: sizes.forearm.y, position: v3(0, -2.5, .3), }), 'lArm'],
                ['rForearm', new Bone({ profile: sizes.forearm.xz, length: sizes.forearm.y, position: v3(.3, -2.5, .3), }), 'rArm'],
                ['lHand', new Bone({ profile: sizes.hand.xz, length: sizes.hand.y, position: v3(-.15, -0.8, .25), baseRotation: v3(0, Math.PI/2, 0), }), 'lForearm'],
                ['rHand', new Bone({ profile: sizes.hand.xz, length: sizes.hand.y, position: v3(-.15, -0.8, .25), baseRotation: v3(0, -Math.PI/2, 0), }), 'rForearm'],
                ['lFingers', new Bone({ profile: sizes.fingers.xz, length: sizes.fingers.y, position: v3(0, -0.7, 0), }), 'lHand'],
                ['rFingers', new Bone({ profile: sizes.fingers.xz, length: sizes.fingers.y, position: v3(0, -0.7, 0), }), 'rHand'],

                ['lLeg', new Bone({ profile: sizes.leg.xz, length: sizes.leg.y, position: v3(0, -3.5, 0), }), 'torso'],
                ['rLeg', new Bone({ profile: sizes.leg.xz, length: sizes.leg.y, position: v3(2.2, -3.5, 0), }), 'torso'],
                ['lForeleg', new Bone({ profile: sizes.foreleg.xz, length: sizes.foreleg.y, position: v3(0.15, -4, 0.25), }), 'lLeg'],
                ['rForeleg', new Bone({ profile: sizes.foreleg.xz, length: sizes.foreleg.y, position: v3(0.15, -4, 0.25), }), 'rLeg'],
                ['lFoot', new Bone({ profile: sizes.foot.xz, length: sizes.foot.y, position: v3(0, -0.5, 0), }), 'lForeleg'],
                ['rFoot', new Bone({ profile: sizes.foot.xz, length: sizes.foot.y, position: v3(0, -0.5, 0), }), 'rForeleg'],
            ]
        });

        const skin: Color = [0.67, 0.54, 0.51, 1];
        const hair: Color = [0.24, 0.15, 0.13, 1];
        const pants: Color = [0.16, 0.16, 0.16, 1];
        const shoes: Color = [0.02, 0.02, 0.03, 1];
        const shirt: Color = [0.37, 0.43, 0.72, 1];
        const sleeve: Color = [0.18, 0.22, 0.47, 1];
        const eyeColor: Color = [0.18, 0.22, 0.47, 1];

        this.bones['torso'].addChild(new GLCuboid({ size: this.bones['torso'].size, colors: [shirt] }));

        this.bones['head'].addChild(new GLCuboid({ size: this.bones['head'].size, colors: [skin, skin, hair, skin, skin, skin] }));
        this.bones['lEye'].addChild(new GLCuboid({ size: v3(0.3, 0.28, 0.05), position: v3(0, 0.01, 0.05), colors: [eyeColor] }));
        this.bones['rEye'].addChild(new GLCuboid({ size: v3(0.3, 0.28, 0.05), position: v3(0, 0.01, 0.05), colors: [eyeColor] }));
        this.bones['lEyebrow'].addChild(new GLCuboid({ size: this.bones['lEyebrow'].size, colors: [hair] }));
        this.bones['rEyebrow'].addChild(new GLCuboid({ size: this.bones['rEyebrow'].size, colors: [hair] }));
        this.bones['head'].addChild(new GLCuboid({ size: v3(0.8, 0.3, 0.05), colors: [Colors.w], position: v3(0.1, 1.5, 2.5) }));
        this.bones['head'].addChild(new GLCuboid({ size: v3(0.8, 0.3, 0.05), colors: [Colors.w], position: v3(2 - 0.1 - 0.8, 1.5, 2.5) }));
        this.bones['hair'].addChild(new GLCuboid({ size: this.bones['hair'].size, colors: [hair] }));

        this.bones['lArm'].addChild(new GLCuboid({ size: this.bones['lArm'].size, colors: [sleeve] }));
        this.bones['rArm'].addChild(new GLCuboid({ size: this.bones['rArm'].size, colors: [sleeve] }));
        this.bones['lForearm'].addChild(new GLCuboid({ size: this.bones['lForearm'].size, colors: [sleeve] }));
        this.bones['rForearm'].addChild(new GLCuboid({ size: this.bones['rForearm'].size, colors: [sleeve] }));
        this.bones['lHand'].addChild(new GLCuboid({ size: this.bones['lHand'].size, colors: [skin] }));
        this.bones['rHand'].addChild(new GLCuboid({ size: this.bones['rHand'].size, colors: [skin] }));
        this.bones['lFingers'].addChild(new GLCuboid({ size: this.bones['lFingers'].size, colors: [skin] }));
        this.bones['rFingers'].addChild(new GLCuboid({ size: this.bones['rFingers'].size, colors: [skin] }));

        this.bones['lLeg'].addChild(new GLCuboid({ size: this.bones['lLeg'].size, colors: [pants] }));
        this.bones['rLeg'].addChild(new GLCuboid({ size: this.bones['rLeg'].size, colors: [pants] }));
        this.bones['lForeleg'].addChild(new GLCuboid({ size: this.bones['lForeleg'].size, colors: [pants] }));
        this.bones['rForeleg'].addChild(new GLCuboid({ size: this.bones['rForeleg'].size, colors: [pants] }));
        this.bones['lFoot'].addChild(new GLCuboid({ size: this.bones['lFoot'].size, colors: [shoes] }));
        this.bones['rFoot'].addChild(new GLCuboid({ size: this.bones['rFoot'].size, colors: [shoes] }));



    }
}
