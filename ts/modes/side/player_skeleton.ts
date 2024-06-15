import { GLobj } from '../../gl/obj';
import { v3 } from '../../utils/vector3';
import { HumanSkeleton } from '../../utils/skeleton_human';
import { Player } from './player_actor';
import { TickerReturnData } from '../../utils/ticker';

export class PlayerSkel extends HumanSkeleton {

    public parent: Player;

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


        this.animator.add('running', 1000, {
            torso: [[0, [-0.3, -0.3, 0]], [1, [-0.3, 0.3, 0]]], 
            hips: [[0,[0,0,0,0,2,0]], [.5,[0,0,0,0,0,0]],[1,[0,0,0,0,2,0]]],
            head: [[0, [0.2, 0.2, 0]], [1, [0.2, -0.2, 0]]],
            lArmUpper: [[0, [-0.8, 0, 0.1]], [1, [1.2, 0, 0.1]]],
            lArmLower: [[0, [0.3, 0, 0]], [1, [1.2, 0, -1.2]]], 
            lHand: [],
            rArmUpper: [[0, [1.2, 0, -0.1]], [1, [-0.8, 0, -0.1]]],
            rArmLower: [[0, [1.2, 0, 1.2]], [1, [0.3, 0, 0]]], 
            rHand: [],
            lLegUpper: [[0, [1.2, 0, 0]], [1, [-.6, 0, 0]]],
            lLegLower: [[0, [-0.3, 0, 0]], [1, [-2, 0, 0]]],
            lFoot: [[0, [-0.2, 0, 0]]],
            rLegUpper: [[0,[-.6, 0, 0]], [1, [1.2, 0, 0]]],
            rLegLower: [[0, [-2, 0, 0]], [1, [-0.3, 0, 0]]],
            rFoot: [[0, [-0.2, 0, 0]]],
        }, { loop: true, ease: 'easeInOutSine', bounce: true });

        this.animator.add('jumping', 500, {
            torso: [[0], [1]],
            hips: [[0], [1, [-0.1, -0.1, -0.15]]],
            head: [[0], [1, [0.3, 0, 0]]],
            lArmUpper: [[0], [1, [-0.2, 0, 0.1]]],
            lArmLower: [[0], [1, [0, 0, 0.2]]],
            lHand: [[0], [1]],
            rArmUpper: [[0], [1, [3, 0, 0.3]]],
            rArmLower: [[0], [1, [0, 0, 0.2]]],
            rHand: [[0], [1]],
            lLegUpper: [[0], [1, [2, 0, 0]]],
            lLegLower: [[0], [1, [-2.4, 0, 0]]],
            lFoot: [[0], [1]],
            rLegUpper: [[0], [1, [-0.2, 0, 0]]],
            rLegLower: [[0], [1, [-0.3, 0, 0]]],
            rFoot: [[0], [1, [-0.6, 0, 0]]],
        }, { once: true, ease: 'easeInOutSine' });

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

        this.animator.add('aim', 1000, {
            torso: [],
            hips: [[0], [1, [0, Math.PI / 2, 0]]],
            head: [[0], [1, [0, -1.1, 0]]],
            lArmUpper: [[0], [1, [Math.PI / 2, 0, Math.PI / 2 - 0.1]]],
            lArmLower: [[0], [1, [0, 0, -0.2]]],
            lHand: [],
            rArmUpper: [[0], [1, [1.5, 0, -0.8]]],
            rArmLower: [[0], [1, [-0.3, 0, 2.2]]],
            rHand: [],
            lLegUpper: [[0], [1, [0, 0, 0.15]]],
            lLegLower: [],
            lFoot: [],
            rLegUpper: [[0], [1, [0, 0, -0.15]]],
            rLegLower: [],
            rFoot: [],
        }, { once: true, ease: 'easeInOutSine' });

        this.animator.play('aim');
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        if (!this.parent.stat.ground) {
            this.animator.play('jumping');
        } else {
            if (this.parent.stat.running) {
                this.animator.play('running');
            } else {
                if (this.parent.aiming) {
                    this.animator.play('aim');
                } else {
                    this.animator.play('idle');
                }
            }
        }
    }
}