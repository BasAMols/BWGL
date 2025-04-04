import { v3, Vector3 } from '../../classes/math/vector3';
import { GLGroup } from '../../classes/group';
import { Collider } from '../../classes/collider';
export type GarageAttributes = {
    position: Vector3;
    open?: number;
};

export class Garage extends GLGroup {
    constructor(attr: GarageAttributes) {
        super({
            position: attr.position,
            controllers: [
                new Collider({
                    size: v3(32, 28, 1),
                    position: v3(0, 0, 0),
                    fixed: true,
                }),
                new Collider({
                    size: v3(5, 28, 143),
                    position: v3(-2, 0, 2),
                    fixed: true,
                }),
                new Collider({
                    size: v3(5, 28, 143),
                    position: v3(32, 0, 2),
                    fixed: true,
                }),
                new Collider({
                    size: v3(39, 28, 5),
                    position: v3(-2, 0, 143),
                    fixed: true,
                }),
            ],
        });
        Garage.registerControllers(this);
        this.controllers[0].position = v3(0, (attr.open||0)*24+1, 0);
    }
}