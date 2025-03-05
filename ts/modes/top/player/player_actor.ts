import { Character } from '../../../classes/character';
import { Collider } from '../../../classes/collider';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { TickerReturnData } from '../../../classes/ticker';
import { ISOCamera } from '../entities/iso_camera';
import { PlayerController } from './player_controller';
import { PlayerSkel } from './player_skeleton';

export class Player extends Character {
    public mesh: GLCuboid;

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
            size: v3(6, 3, 6),
            anchorPoint: v3(3, 0, 3)
        });
        this.addControllers([]);
        // this.addChild(new GLCuboid({
        //     size: this.size,
        //     colors: [
        //         [1, 1, 1, 1]
        //     ]
        // }));
    }

    build() {
        super.build();
        this.addControllers([
            new Collider({
                position: v3(3,0,3),
                size: this.size,
                anchorPoint: v3(3, 5, 3),
                absoluteOffset: v3(-3,0,-3)
            }),
            new PlayerController(this),
            new ISOCamera(this),
        ]);
        GlElement.registerControllers(this);

        this.skeleton = new PlayerSkel();
        this.addChild(this.skeleton);
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        // this.skeleton.tick(obj);
    }
}