import { GLCuboid } from '../../gl/cuboid';
import { Character } from '../../gl/character';
import { Vector3 } from '../../utils/vector3';
import { FreeCamera } from './freeCamera';
import { GlElement } from '../../gl/elementBase';
import { MovementController } from './movementController';
import { TickerReturnData } from '../../utils/ticker';
import { Skeleton } from './skeleton';

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
                'armUpper': 6,
                'armElbow': 0,
                'armLower': 3,
                'hand': 3,
                'legUpper': 6,
                'legKnee': 0,
                'legLower': 5,
                'foot': 2,
                'torso': 13,
            }
        });
        this.addChild(this.skeleton);
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

    }
}