import { GLGroup } from '../../../classes/group';
import { Vector2 } from '../../../classes/math/vector2';
import { Vector3, v3 } from '../../../classes/math/vector3';
import { ObjStorage } from '../../../classes/objStorage';
import { RandomTree } from './randomTree';

export type ForrestAttributes = {
    storage: ObjStorage,
    position?: Vector3,
    area: Vector2,
    density: number,
};

export class Forrest extends GLGroup {
    area: Vector2;
    density: number;
    constructor(attr: ForrestAttributes) {
        super({
            position: attr.position,
        });
        this.area = attr.area;
        this.density = attr.density;
    }
    public build(): void {
        super.build();

        for (let x = 0; x < this.area.x; x += 10) {
            for (let y = 0; y < this.area.y; y += 10) {
                if (Math.random() < this.density) {
                    this.addChild(new RandomTree({
                        position: v3(x, 0, y)
                    }));
                }
            }
        }
    }
}
