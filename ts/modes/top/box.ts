import { Vector3 } from '../../classes/math/vector3';
import { v3 } from '../../classes/math/vector3';
import { GLCuboid } from '../../classes/objects/cuboid';
import { TickerReturnData } from '../../classes/ticker';
import { Character } from '../../classes/character';
import { Collider } from '../../classes/collider';
export type BoxAttributes = {
    position: Vector3;
};

export class Box extends GLCuboid {
    private _carrier: Character;
    public get carrier(): Character {
        return this._carrier;
    }
    public set carrier(value: Character|undefined) {
        this._carrier = value;
        this.controllers[0].active = Boolean(!value);
    }
    constructor(attr: BoxAttributes) {
        super({
            colors: [[0.12, 0.12, 0.12, 1]],
            size: v3(6),
            anchorPoint: v3(3, 0, 3),
            position: attr.position,
            controllers: [
                new Collider({
                    size: v3(6),
                    position: v3(0, 0, 0),
                    fixed: false,
                }),
            ],
        });
    }

    drop(position: Vector3) {
        this.position = position.clone();
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        if (this.carrier) {
            this.controllers[0].active = false;
            const offset = v3(6,0,0).rotateXY(-this.carrier.rotation.y+Math.PI/2);
            this.position = this.carrier.position.clone().add(offset).add(v3(0,3,0));
            this.rotation = this.carrier.rotation.clone().add(v3(0,Math.PI/2,0));
        } else {
            this.position.y = 0;
            this.rotation = v3(0,0,0);
            this.controllers[0].active = true;
        }
    }
}