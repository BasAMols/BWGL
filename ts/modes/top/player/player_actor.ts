import { Character } from '../../../classes/character';
import { Collider } from '../../../classes/collider';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { NormalCamera } from '../entities/camera';
import { PlayerController } from './player_controller';
import { PlayerSkel } from './player_skeleton';

export class Player extends Character {
    public mesh: GLCuboid;
    cameraController: NormalCamera;

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
            size: v3(4, 17, 3),
            anchorPoint: v3(2, 0, 1.5)
        });
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
            // new ISOCamera(this),
            (this.cameraController = new NormalCamera(this)),
        ]);
        GlElement.registerControllers(this);

        this.skeleton = new PlayerSkel();
        this.addChild(this.skeleton);
        this.setDriving(false);
    }

    setDriving(v: boolean) {
        this.stat.driving = v;
        this.visible = !v;
        this.active = !v;
        this.cameraController.active = !v;
        this.controllers[0].active = !v;
    }
}