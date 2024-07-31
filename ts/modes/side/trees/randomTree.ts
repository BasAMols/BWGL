import { GLGroup } from '../../../gl/group';
import { Vector3, v3 } from '../../../gl/math/vector3';
import { Tree1 } from './tree1';
import { Tree2 } from './tree2';
import { Tree3 } from './tree3';
import { Tree4 } from './tree4';
import { Tree5 } from './tree5';
import { Tree6 } from './tree6';

export type RandomTreeAttributes = {
    position?: Vector3,
};

export class RandomTree extends GLGroup {
    constructor(attr: RandomTreeAttributes) {
        super({
            position: attr.position,
        });
    }
    public build(): void {
        super.build();
        this.addChild(new ([Tree1, Tree2, Tree3, Tree4, Tree5, Tree6, Tree2, Tree3, Tree4, Tree5, Tree6][Math.floor(Math.random() * 11)])({
            rotation: v3(0, Math.random() * Math.PI, 0),
            scale: 0.8 + (0.4 * Math.random())
        }));
    }
}
