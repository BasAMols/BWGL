import { Character } from '../../../classes/character';
import { Collider } from '../../../classes/collider';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { Colors } from '../../../classes/util/colors';
import { FreeCamera } from '../player/player_camera';
import { PlayerController } from '../player/player_controller';

export class TestPlayer extends Character {
    public stat: Record<string, boolean> = { jumping: false, falling: false, running: false, fallAnimation: false };
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
        this.addChild(new GLCuboid({size: this.size, colors: [Colors.w], opacity: 1}))
    }
}