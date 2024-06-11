import { GLCuboid } from '../../gl/cuboid';
import { Character } from '../../gl/character';
import { Vector3 } from '../../utils/vector3';
import { SideController } from './sideController';
import { SideCamera } from './sideCamera';
import { FreeCamera } from './freeCamera';
import { GlElement } from '../../gl/elementBase';
import { MovementController } from './movementController';
import { TickerReturnData } from '../../utils/ticker';
import { Skeleton } from './Skeleton';

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
        this.addControllers([new SideController(), new SideCamera(this), new FreeCamera(this), new MovementController(this)]);

    }

    keyDown(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            if (this.controllers[0].active) {
                this.controllers[0].active = false;
                this.controllers[1].active = false;
                this.controllers[2].active = true;
                this.controllers[3].active = true;
            } else {
                this.controllers[0].active = true;
                this.controllers[1].active = true;
                this.controllers[2].active = false;
                this.controllers[3].active = false;
            }
        }
    }

    build() {
        // this.addChild(this.mesh = new GLCuboid({ size: this.size, colors: [[0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1], [0.3,0.4,0.2,1]] }));
        // this.addChild(new GLobj({ url: 'PhoneAddict-1-Man.obj', size: v3(10, 10, 10), position: v3(-4, 0,33), rotation: v3(0,Math.PI,0) }));
        GlElement.registerControllers(this);
        this.skeleton = new Skeleton();
        this.addChild(this.skeleton);
        this.controllers[0].active = false;
        this.controllers[1].active = false;
        this.controllers[2].active = true;
        this.controllers[3].active = true;
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

    }
}