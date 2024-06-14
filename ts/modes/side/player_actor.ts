import { GLCuboid } from '../../gl/cuboid';
import { Character } from '../../gl/character';
import { Vector3 } from '../../utils/vector3';
import { GlElement } from '../../gl/elementBase';
import { HumanSkeleton } from '../../utils/skeleton_human';
import { PlayerSkel } from './player_skeleton';
import { MovementController } from './player_controller';
import { FreeCamera } from './player_camera';

export class Player extends Character {
    public stat: Record<string, boolean> = { jumping: false, falling: false, running: false, fallAnimation: false };
    public mesh: GLCuboid;
    public skeleton: HumanSkeleton;
    public aiming: boolean = false;

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

    keyDown(e: KeyboardEvent): void {
        if (e.key === 'e' || e.key === 'E'){
            this.aiming = true;
        }
    }

    keyUp(e: KeyboardEvent): void {
        if (e.key === 'e' || e.key === 'E'){
            this.aiming = false;
        }
    }

    build() {
        GlElement.registerControllers(this);
        this.skeleton = new PlayerSkel();
        this.addChild(this.skeleton);
    }

}