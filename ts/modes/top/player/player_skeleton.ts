import { BlobSkeleton } from './skeleton_blob';
import { TickerReturnData } from '../../../classes/ticker';
import { Player } from './player_actor';


export class PlayerSkel extends BlobSkeleton {

    public parent: Player;

    constructor() {
        super();
    }


    public build(): void {
        super.build();

        this.animator.add('running', 1000, {
            torso: [[0, [-0.3, -0.3, 0]], [1, [-0.3, 0.3, 0]]],

            head: [[0, [0.2, 0.2, 0]], [1, [0.2, -0.2, 0]]],
            lEye: [],
            rEye: [],

            lArm: [[0, [-0.8, 0, 0.1]], [1, [1.2, 0, 0.1]]],
            rArm: [[0, [1.2, 0, -0.1]], [1, [-0.8, 0, -0.1]]],
            lForearm: [[0, [0.3, 0, 0]], [1, [1.2, 0, -1.2]]],
            rForearm: [[0, [1.2, 0, 1.2]], [1, [0.3, 0, 0]]],
            lHand: [],
            rHand: [],

            lLeg: [[0, [1.2, 0, 0]], [1, [-.6, 0, 0]]],
            rLeg: [[0, [-.6, 0, 0]], [1, [1.2, 0, 0]]],
            lForeleg: [[0, [-0.3, 0, 0]], [1, [-2, 0, 0]]],
            rForeleg: [[0, [-2, 0, 0]], [1, [-0.3, 0, 0]]],
            lFoot: [[0, [-0.2, 0, 0]]],
            rFoot: [[0, [-0.2, 0, 0]]],
            
        }, { loop: true, ease: 'easeInOutSine', bounce: true, dynamic: true });

        this.animator.add('walking', 700, {
            torso: [[0, [-0.1, -0.1, 0, 0, -0.6, 0]], [.5, [0, 0, 0, 0, 0.1, 0]], [1, [-0.1, 0.1, 0, 0, -0.6, 0]]],

            head: [[0, [0.1, 0.1, 0]], [1, [0.1, -0.1, 0]]],
            lEye: [],
            rEye: [],

            lArm: [[0, [-0.4, 0, 0.1]], [1, [0.6, 0, 0.1]]],
            rArm: [[0, [0.6, 0, -0.1]], [1, [-0.4, 0, -0.1]]],
            lForearm: [[0, [0.3, 0, 0]], [1, [0.6, 0, -0.6]]],
            rForearm: [[0, [0.6, 0, 0.6]], [1, [0.3, 0, 0]]],
            lHand: [],
            rHand: [],

            lLeg: [[0, [0.5, 0.05, 0]], [1, [-.3, -0.05, 0]]],
            rLeg: [[0, [-.3, 0.05, 0]], [1, [0.5, -0.05, 0]]],
            lForeleg: [[0, [-0.3, 0, 0]], [1, [-0.4, 0, 0]]],
            rForeleg: [[0, [-0.4, 0, 0]], [1, [-0.3, 0, 0]]],
            lFoot: [[0, [0, 0, 0]], [.5, [-0.4, 0, 0]], [1, [-0.4, 0, 0]]],
            rFoot: [[0, [-0.4, 0, 0]], [.5, [-0.4, 0, 0]], [1, [0, 0, 0]]],

        }, { loop: true, ease: 'easeInOutSine', bounce: true, dynamic: true });

        this.animator.add('grab', 1000, {
            torso: [],

            head: [],
            lEye: [],
            rEye: [],

            lArm: [[0], [1, [1.5, , -0.1]]],
            rArm: [[0], [1, [1.4, , 0.1]]],
            lForearm: [],
            rForearm: [],
            lHand: [],
            rHand: [],

            lLeg: [],
            rLeg: [],
            lForeleg: [],
            rForeleg: [],
            lFoot: [],
            rFoot: [],

        }, { once: true, ease: 'easeInOutSine', dynamic: true, });

        this.animator.add('carry', 1000, {
            torso: [],

            head: [],
            lEye: [],
            rEye: [],

            lArm: [[0, [1.5, , -0.1]]],
            rArm: [[0, [1.4, , 0.1]]],
            lForearm: [],
            rForearm: [],
            lHand: [],
            rHand: [],

            lLeg: [],
            rLeg: [],
            lForeleg: [],
            rForeleg: [],
            lFoot: [],
            rFoot: [],


        }, { loop: true, ease: 'easeInOutSine', dynamic: true, });

        this.animator.add('runningCarry', 1000, {
            torso: [[0, [-0.2, -0.3]], [1, [-0.2, 0.3]]],

            head: [[0, [0.1, 0.1, 0]], [1, [0.1, -0.1, 0]]],
            lEye: [],
            rEye: [],

            lArm: [[0, [1.5, , -0.2]], [1, [1.5, , 0.2]]],
            rArm: [[0, [1.4, , -0.2]], [1, [1.4, , 0.2]]],
            lForearm: [],
            rForearm: [],
            lHand: [],
            rHand: [],

            lLeg: [],
            rLeg: [],
            lForeleg: [],
            rForeleg: [],
            lFoot: [],
            rFoot: [],


        }, { loop: true, ease: 'easeInOutSine', bounce: true, dynamic: true });

        this.animator.add('idle', 15000, {
            torso: [],

            head: [[0.4, [, 0.5]], [0.5, [, -0.5]], [0.9, [, -0.5]], [1, [, 0.5]]],
            lEye: [[0.4, [0,0,0, 0.1]], [0.5, [0,0,0, -0.15]], [0.9, [0,0,0, -0.15]], [1, [0,0,0, 0.1]]],
            rEye: [[0.4, [0,0,0, 0.15]], [0.5, [0,0,0, -0.1]], [0.9, [0,0,0, -0.1]], [1, [0,0,0, 0.15]]],

            lArm: [],
            rArm: [],
            lLeg: [],
            rLeg: [],
            lForeleg: [],
            rForeleg: [],

            lFoot: [],
            rFoot: [],
            lHand: [],
            rHand: [],

            lForearm: [],
            rForearm: [],
        }, { loop: true, dynamic: true, ease: 'easeInOutSine' });

        this.animator.play('idle');
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        if (this.parent.stat.running) {
            if (this.parent.stat.holding) {
                this.animator.play('runningCarry');
            } else {
                this.animator.play('walking');
            }
        } else {
            if (this.parent.stat.holding) {
                this.animator.play('carry');
            } else {
                this.animator.play('idle');
            }
        }
    }
}