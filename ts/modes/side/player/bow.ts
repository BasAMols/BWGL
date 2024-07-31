import { GlElement, GlElementAttributes } from '../../../gl/elementBase';
import { GlElementType } from '../../../gl/rendering/glRenderer';
import { GLGroup } from '../../../gl/group';
import { GLobj } from '../../../gl/objects/obj';
import { Skeleton } from '../../../gl/animation/skeleton';
import { Bone } from '../../../gl/animation/skeleton_bone';
import { v2 } from '../../../gl/math/vector2';
import { Vector3, v3 } from '../../../gl/math/vector3';
import { Player } from './player_actor';

export type BowAttributes = GlElementAttributes & {
    parentBone: Bone;
    offsetP?: Vector3;
    offsetR?: Vector3;
};

export class BowActor extends GLGroup {
    public parent: Player;

    private _holding: boolean;
    public get holding(): boolean {
        return this._holding;
    }
    public set holding(value: boolean) {
        this._holding = value;
        this.backBow.active = !value;
        this.backBow.visible = !value;
        this.handBow.active = value;
        this.handBow.visible = value;
        this.backBow.tension = 0.999;
        this.handBow.tension = 0.999;
        
    }

    public handBow: Bow;
    public backBow: Bow;

    public build(): void {
        super.build();

        this.handBow = new Bow({ parentBone: this.parent.skeleton.bones['lHand'], offsetR: v3(0, 0, 0.2) });
        this.addChild(this.handBow);

        this.backBow = new Bow({
            parentBone: this.parent.skeleton.bones['torso'], offsetP: v3(0, 6, -3), offsetR: v3(
                Math.PI / 2,
                0.5,
                Math.PI / 2 + 0.9
            )
        });
        this.addChild(this.backBow);

        this.holding = false;
    }
}

export class Bow extends GlElement {
    public type: GlElementType;
    public stat: Record<string, boolean> = {};
    public parent: BowActor;
    public parentBone: Bone;
    public bowRig: BowSkeleton;

    public get visible(): boolean {
        return super.visible;
    }
    public set visible(value: boolean) {
        super.visible = value;
        this.bowRig.visible = value;
    }

    public set tension(v: number) {
        this.bowRig.animator.setToInterval('tension', v);
    }

    constructor(attr: BowAttributes) {
        super(attr);
        this.parentBone = attr.parentBone;
        this.bowRig = new BowSkeleton(attr.offsetP, attr.offsetR);
    }
    public build(): void {
        super.build();
        this.parentBone.addChild(this.bowRig);
        this.tension = 0.999;
    }
}



export class BowSkeleton extends Skeleton {

    public get visible(): boolean {
        return super.visible;
    }
    public set visible(value: boolean) {
        super.visible = value;
        this.bones['bow'].visible = value;
    }

    constructor(public offsetP: Vector3 = v3(0), public offsetR: Vector3 = v3(0)) {
        super({
            bones: [
                ['bow', new Bone({ profile: v2(1, 28), length: 6, position: v3(0, 0, 0), mesh: false }), ''],
                ['bowS1', new Bone({ profile: v2(1, 13), length: 1, position: v3(0, 5, -12), mesh: false }), 'bow'],
                ['bowS2', new Bone({ profile: v2(1, 13), length: 1, position: v3(0, 5, 1), mesh: false }), 'bow'],
            ]
        });
        this.rotation = offsetR;
        this.position = offsetP;
    }
    public build(): void {
        super.build();
        this.bones['bow'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-2-LongBow.obj', size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0.5, 2.5, 1) }));
        this.bones['bowS1'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-0-BowRope.obj', size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0.5, 0.5, 6.5) }));
        this.bones['bowS2'].addChild(new GLobj({ colorIntensity: 1.3, url: 'RPGCharacters_Source-1-BowRope-1.obj', size: v3(10, 10, 10), rotation: v3(0, Math.PI, 0), position: v3(0.5, 0.5, 6.5) }));

        this.animator.add('tension', 100, {
            bow: [[0, [0, 0, 0]], [1, [1, 1, 0]]],
            bowS1: [[0, [0, 0, 0]], [1, [1, 1, 1]]],
            bowS2: [[0, [0, 0, 0]], [1, [1, 1, 1]]],
        }, { loop: false, bounce: false, once: false, dynamic: false });
    }
}
