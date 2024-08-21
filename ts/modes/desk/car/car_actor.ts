import { HumanSkeleton } from '../../../classes/animation/skeleton_human';
import { Character } from '../../../classes/character';
import { Collider } from '../../../classes/collider';
import { GlElement } from '../../../classes/elementBase';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { GLCuboid } from '../../../classes/objects/cuboid';
import { GLobj } from '../../../classes/objects/obj';
import { TickerReturnData } from '../../../classes/ticker';
import { CarCamera } from './car_camera';
import { CarController } from './car_controller';


export class Driver extends Character {
    public stat: Record<string, boolean> = { jumping: false, falling: false, running: false, fallAnimation: false };
    public mesh: GLCuboid;
    public skeleton: HumanSkeleton;

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
        this.addControllers([new Collider({
            size: this.size,
            fixed: true,
        }), new CarController(this), new CarCamera(this)]);

    }

    build() {
        GlElement.registerControllers(this);
        this.addChild(new GLobj({  url: 'Shop-3-Car.obj', size: v3(18, 18, 18), position: v3(18, 12, 47), rotation: v3(0, -Math.PI / 2, 0) }));
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}