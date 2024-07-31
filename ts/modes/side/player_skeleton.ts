import { GLobj } from '../../gl/objects/obj';
import { v3 } from '../../gl/math/vector3';
import { HumanSkeleton } from '../../gl/animation/skeleton_human';
import { Player } from './player_actor';
import { TickerReturnData } from '../../gl/ticker';

export class PlayerSkel extends HumanSkeleton {

    public parent: Player;

    constructor() {
        super({
            'head': 6,
            'armUpper': 6,
            'armLower': 6,
            'hand': 0,
            'legUpper': 4,
            'legLower': 7,
            'foot': 1,
            'torso': 9,
            'hips': 3,
            'hipsWidth': 6,
            'shoulderWidth': 6,
        });
    }


    public build(): void {
        super.build();

        this.bones['head'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-15-Head-7.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(2, 3, 2) }));
        this.bones['torso'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-3-Spine3-2.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2, 5, 0) }));
        this.bones['torso'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-2-Spine2-4.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(this.sizes.shoulderWidth / 2-1, 2, 1) }));
        this.bones['hips'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-8-Spine1-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(3, 2, 0) }));
        this.bones['lLegUpper'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-14-L_Thigh-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(1, 3, 0) }));
        this.bones['rLegUpper'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-11-R_Thigh-2.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(0, 3, 0) }));
        this.bones['lLegLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-13-L_Calf-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(1,3,-0.5) }));
        this.bones['rLegLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-10-R_Calf-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(0,3,-0.5) }));
        this.bones['lLegLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-12-L_Foot-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(1,-0.5,0.5) }));
        this.bones['rLegLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-9-R_Foot-2.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, 0), position: v3(0,-0.5,0.5) }));
        this.bones['lArmUpper'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-7-L_Arm-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(0, 3, 1) }));
        this.bones['rArmUpper'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-1-R_Arm.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(1, 3, 1) }));
        this.bones['lArmLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-6-L_ForeArm-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(0, 4, 1) }));
        this.bones['rArmLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-0-R_ForeArm.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(1, 4, 1) }));
        this.bones['lArmLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-4-L_Hand-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, Math.PI / 2), position: v3(-0.5, 0.5, 1) }));
        this.bones['rArmLower'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-5-R_Hand-3.obj', size: v3(10,10,10), rotation: v3(0, Math.PI, -Math.PI / 2), position: v3(1.5, 0.5, 1) }));


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