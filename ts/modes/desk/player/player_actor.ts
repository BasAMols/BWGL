import { Character } from '../../../classes/character';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { TickerReturnData } from '../../../classes/ticker';

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
            size: v3(8, 33, 8),
            anchorPoint: v3(4, 0, 4)
        });
        // this.addChild(new GLCuboid({ size: this.size }));
    }

    build() {
        super.build();
        GlElement.registerControllers(this);
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}