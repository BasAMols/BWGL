import { GLobj } from '../../gl/objects/obj';
import { v3 } from '../../gl/math/vector3';
import { HumanSkeleton } from '../../gl/animation/skeleton_human';

export class npcSkeleton extends HumanSkeleton{
    constructor() {
        super({
            'head': 6,
            'armUpper': 5,
            'armLower': 9,
            'hand': 0,
            'legUpper': 9,
            'legLower': 5,
            'foot': 1,
            'torso': 5.5,
            'hips': 3,
            'hipsWidth': 6,
            'shoulderWidth': 8,
        });
    }

    public build(): void {
        super.build();

        this.bones['head'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-10-Head.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(2, -9.5, 2) }));
        this.bones['torso'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-8-TorsoUpper.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2, -3, 1) }));
        this.bones['hips'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-9-TorsoLower.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 0, 1) }));
        this.bones['lLegUpper'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-0-lLegUpper.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 9, 1) }));
        this.bones['rLegUpper'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-1-rLegUpper.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(-2, 9, 1) }));
        this.bones['lLegLower'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-2-lLegLower.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(3, 14.4, 1.5) }));
        this.bones['rLegLower'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-3-rLegLower.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, 0), position: v3(-2, 14.4, 1.5) }));
        this.bones['lArmUpper'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-4-lArmUpper.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(8.5, 7, 1) }));
        this.bones['rArmUpper'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-5-rArmUpper.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(-7.5, 7, 1) }));
        this.bones['lArmLower'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-6-lArmLower.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(8.5, 16, 1) }));
        this.bones['rArmLower'].addChild(new GLobj({ colorIntensity: 0.7, url: 'worker/worker-7-rArmLower.obj', size: v3(6, 6, 6), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(-7.5, 16, 1) }));

        this.animator.add('idle', 15000, {
            torso: [],
            hips: [],
            head: [[0.4, [0, 0.5]], [0.5, [0, -0.5]], [0.9, [0, -0.5]], [1, [0, 0.5]]],
            lArmUpper: [],
            lArmLower: [],
            lHand: [],
            rArmUpper: [],
            rArmLower: [],
            rHand: [],
            lLegUpper: [],
            lLegLower: [],
            lFoot: [],
            rLegUpper: [],
            rLegLower: [],
            rFoot: [],
        }, { loop: true, dynamic: true, ease: 'easeInOutSine' });

        this.animator.play('idle');
    }
}