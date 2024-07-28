import { GLCuboid } from '../../gl/cuboid';
import { Character } from '../../gl/character';
import { Vector3, v3 } from '../../utils/vector3';
import { GlElement } from '../../gl/elementBase';
import { HumanSkeleton } from '../../utils/skeleton_human';
import { PlayerController } from './player_controller';
import { FreeCamera } from './player_camera';
import { BowActor } from './bow';
import { TickerReturnData } from '../../utils/ticker';
import { PlayerSkel } from './player_skeleton';
import { Collider } from '../../utils/collider';

export class Player extends Character {
    public stat: Record<string, boolean> = { jumping: false, falling: false, running: false, fallAnimation: false };
    public mesh: GLCuboid;
    public skeleton: HumanSkeleton;
    public bow: BowActor;

    public get aiming() {
        const a = (this.controllers[1] as PlayerController).aiming;
        // this.bow.holding = a;
        return a;
    }

    constructor({
        position = Vector3.f(0),
        rotation = Vector3.f(0)
    }: {
        position?: Vector3;
        rotation?: Vector3;
    } = {}) {
        super({
            position: position,
            rotation: rotation,
            size: v3(8, 33, 8),
            anchorPoint: v3(4,0,4)
        });
        this.addControllers([
            new Collider({
                size: v3(8,33,8),
                fixed: false,
                position: v3(4,0,4),
                absoluteOffset: v3(-4,0,-4),
            }),
            new PlayerController(this),
            new FreeCamera(this)
        ]);
    }

    build() {
        GlElement.registerControllers(this);
        // this.addChild(new GLCuboid({size: this.size, colors: [Colors.w], opacity: 0.1}))
        this.skeleton = new PlayerSkel();
        this.addChild(this.skeleton);
        this.skeleton.position = v3(0,0,0)
        this.bow = new BowActor();
        this.addChild(this.bow);
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        // (this.level as World).test.position = this.bow.handBow.bowRig.bones['bow'].worldPosition.clone()
    }
}