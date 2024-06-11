import { GLCuboid } from '../../gl/cuboid';
import { Character } from '../../gl/character';
import { Vector3, v3 } from '../../utils/vector3';
import { GlElement } from '../../gl/elementBase';
import { TickerReturnData } from '../../utils/ticker';
import { Skeleton } from './skeleton';
import { GLobj } from '../../gl/obj';
import { CarController } from './carController';
import { CarCamera } from './carCamera';

export class Driver extends Character {
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
        this.addControllers([new CarController(this), new CarCamera(this)]);

    }

    build() {
        GlElement.registerControllers(this);
        this.addChild(new GLobj({ storage: this.mode.storage, url: 'Shop-3-Car.obj', size: v3(20, 20, 20), position: v3(20, 15, 52), rotation: v3(0, -Math.PI / 2, 0) }));
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

    }
}