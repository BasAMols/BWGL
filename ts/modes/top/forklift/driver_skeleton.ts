import { BlobSkeleton } from '../player/skeleton_blob';
import { TickerReturnData } from '../../../classes/ticker';
import { Player } from '../player/player_actor';


export class DriverSkel extends BlobSkeleton {

    public parent: Player;

    constructor() {
        super();
    }


    public build(): void {
        super.build();

        this.rotation.y = -Math.PI/2;
        this.position.x = 13.5;
        this.position.z = 3;

        this.animator.add('driving', 1000, {
            torso: [[0, [0.2, 0, 0]]],

            head: [[0, [-0.2, 0, 0]]],
            lEye: [],
            rEye: [],

            lArm: [[0, [0.8, 0, 0, 0, -0.5, 0.2]]],
            rArm: [[0, [0.8, 0, 0, 0, -0.5, 0.2]]],
            lForearm: [[0, [0.3, 0, -0.3]]],
            rForearm: [[0, [0.3, 0, 0.3]]],
            lHand: [[0, [0, 0.3, 0]]],
            rHand: [[0, [0, -0.3, 0]]],
            lFingers: [[0, [0.6, 0, 0]]],
            rFingers: [[0, [0.6, 0, 0]]],

            lLeg: [[0, [1.4, -0.1, 0.1, 0, 0, 1]]],
            rLeg: [[0, [1.4, 0.1, -0.1, 0, 0, 1]]],
            lForeleg: [[0, [-0.8, 0, 0]]],
            rForeleg: [[0, [-0.8, 0, 0]]],
            lFoot: [],
            rFoot: [],

            
        }, { loop: true, dynamic: true, ease: 'easeInOutSine' });

        this.animator.play('driving');
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}