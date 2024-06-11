import { GLCuboid } from '../../gl/cuboid';
import { Character } from '../../gl/character';
import { Vector3, v3 } from '../../utils/vector3';
import { FreeCamera } from './freeCamera';
import { GlElement } from '../../gl/elementBase';
import { MovementController } from './movementController';
import { TickerReturnData } from '../../utils/ticker';
import { Skeleton } from './skeleton';
import { GLobj } from '../../gl/obj';

export class Player extends Character {
    public stat: Record<string, boolean> = { jumping: false, falling: false, running: false, fallAnimation: false };
    public mesh: GLCuboid;
    public skeleton: Skeleton;

    constructor({
        position = Vector3.f(0),
        size = Vector3.f(0),
        rotation = Vector3.f(0)
    }: {
        position?: Vector3;
        size?: Vector3;
        rotation?: Vector3;
    } = {}) {
        super({
            position: position,
            size: size,
            rotation: rotation,
            anchorPoint: size.multiply(0.5, 0, 0.5),
        });
        this.addControllers([new FreeCamera(this), new MovementController(this)]);

    }

    build() {
        // this.addChild(this.mesh = new GLCuboid({ size: this.size, colors: [[0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1]] }));
        GlElement.registerControllers(this);
        this.skeleton = new Skeleton({
            boneSizes: {
                'head': 6,
                'armUpper': 5,
                'armElbow': 0,
                'armLower': 3,
                'hand': 3,
                'legUpper': 6,
                'legKnee': 0,
                'legLower': 6,
                'foot': 2,
                'torso': 7,
                'hips': 3,
            }
        });
        this.addChild(this.skeleton);
        this.skeleton.torso.addChild(new GLobj({url: 'worker/worker-8-TorsoUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(2,-1,2)}));
        this.skeleton.hips.addChild(new GLobj({url: 'worker/worker-9-TorsoLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(2,2,2)}));
        this.skeleton.lLegUpper.addChild(new GLobj({url: 'worker/worker-0-lLegUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(4,8,2)}));
        this.skeleton.rLegUpper.addChild(new GLobj({url: 'worker/worker-1-rLegUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(-1,8,2)}));
        this.skeleton.lLegLower.addChild(new GLobj({url: 'worker/worker-2-lLegLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(3.5,14.5,2)}));
        this.skeleton.rLegLower.addChild(new GLobj({url: 'worker/worker-3-rLegLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(-1.5,14.5,2)}));
        this.skeleton.lArmUpper.addChild(new GLobj({url: 'worker/worker-4-lArmUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,Math.PI/2), position: v3(9,7.75,1.5)}));
        this.skeleton.rArmUpper.addChild(new GLobj({url: 'worker/worker-5-rArmUpper.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,-Math.PI/2), position: v3(-6.5,7.75,1.5)}));
        this.skeleton.lArmLower.addChild(new GLobj({url: 'worker/worker-6-lArmLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,Math.PI/2), position: v3(8.75,10.5,1.5)}));
        this.skeleton.rArmLower.addChild(new GLobj({url: 'worker/worker-7-rArmLower.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,-Math.PI/2), position: v3(-6.75,10.5,1.5)}));
        this.skeleton.head.addChild(new GLobj({url: 'worker/worker-10-Head.obj', size: v3(6,6,6), rotation: v3(0,Math.PI,0), position: v3(2.5,-9,3)}));
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

    }
}