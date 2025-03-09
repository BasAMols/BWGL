import { BlobSkeleton } from './skeleton_blob';
import { TickerReturnData } from '../../../classes/ticker';
import { Player } from './player_actor';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { v3 } from '../../../classes/math/vector3';
import { Color } from '../../../classes/util/colors';


export class PlayerSkel extends BlobSkeleton {

    public parent: Player;

    constructor() {
        super();
    }


    public build(): void {
        super.build();
        const skin: Color = [0.84, 0.84, 0.82, 1];
        const hair: Color = [0.39, 0.23, 0.11, 1];

        this.bones['torso'].addChild(new GLCuboid({ size: this.bones['torso'].size, colors: [[0.55, 0.56, 0.71, 1]] }));
        this.bones['head'].addChild(new GLCuboid({ size: v3(4, 4, 1), position: v3(0, 3, 3), colors: [skin] }));
        this.bones['head'].addChild(new GLCuboid({ size: v3(4, 4, 3), position: v3(0, 3, 0), colors: [hair, [0.44, 0.34, 0.31, 1]] }));
        // this.bones['lArm'].addChild(new GLCuboid({ size: this.bones['lArm'].size, colors: [[0.49, 0.43, 0.51, 1]] }));
        // this.bones['rArm'].addChild(new GLCuboid({ size: this.bones['rArm'].size, colors: [[0.49, 0.43, 0.51, 1]] }));
        // this.bones['lArm'].addChild(new GLCuboid({ size: v3(1.5, 1, 2), position: v3(0, -1, 0), colors: [skin] }));
        // this.bones['rArm'].addChild(new GLCuboid({ size: v3(1.5, 1, 2), position: v3(0, -1, 0), colors: [skin] }));

        this.animator.add('running', 1000, {
            torso: [[0, [-0.2, -0.3]], [1, [-0.2, 0.3]]],
            head: [[0, [0.1, 0.1, 0]], [1, [0.1, -0.1, 0]]],
            lArm: [[0, [-0.4]], [1, [0.6]]],
            rArm: [[0, [0.5]], [1, [-0.4]]],
        }, { loop: true, ease: 'easeInOutSine', bounce: true, dynamic: true });

        this.animator.add('grab', 1000, {
            torso: [],
            head: [],
            lArm: [[0], [1, [1.5, , -0.1]]],
            rArm: [[0], [1, [1.4, , 0.1]]],
        }, { once: true, ease: 'easeInOutSine', dynamic: true, });

        this.animator.add('carry', 1000, {
            torso: [],
            head: [],
            lArm: [[0, [1.5, , -0.1]]],
            rArm: [[0, [1.4, , 0.1]]],
        }, { loop: true, ease: 'easeInOutSine', dynamic: true, });

        this.animator.add('runningCarry', 1000, {
            torso: [[0, [-0.2, -0.3]], [1, [-0.2, 0.3]]],
            head: [[0, [0.1, 0.1, 0]], [1, [0.1, -0.1, 0]]],
            lArm: [[0, [1.5, , -0.2]], [1, [1.5, , 0.2]]],
            rArm: [[0, [1.4, , -0.2]], [1, [1.4, , 0.2]]],
        }, { loop: true, ease: 'easeInOutSine', bounce: true, dynamic: true });

        this.animator.add('idle', 15000, {
            torso: [],
            head: [[0.4, [, 0.5]], [0.5, [, -0.5]], [0.9, [, -0.5]], [1, [, 0.5]]],
            lArm: [],
            rArm: [],
        }, { loop: true, dynamic: true, ease: 'easeInOutSine' });

        this.animator.play('idle');
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        if (this.parent.stat.running) {
            if (this.parent.stat.holding) {
                this.animator.play('runningCarry');
            } else {
                this.animator.play('running');
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