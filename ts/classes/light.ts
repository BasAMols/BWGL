import { GlElementAttributes } from './elementBase';
import { Vector3, v3 } from './math/vector3';
import { Color, Colors } from './util/colors';
import { GLGroup } from './group';
import { GLCuboid } from './objects/cuboid';


export type LightAttributes = GlElementAttributes & {
    range: [number,number];
    limit: [number,number];
    color?: Color,
    specular?: Color,
    direction?: Vector3
};

export class Light extends GLGroup{
    private _range: [number, number];
    public get range(): [number, number] {
        return this._range;
    }
    public set range(value: [number, number?]) {
        this._range = [
            value[0],
            value[1]===undefined || value[1]<=value[0]?value[0]+1:value[1],
        ]
    }
    private _limit: [number, number];
    public get limit(): [number, number] {
        return this._limit;
    }
    public set limit(value: [number, number]) {
        this._limit = [
            value[0],
            value[1]===undefined || value[1]<=value[0]?value[0]+1:value[1],
        ]
    }
    public specular: Color;
    public direction: Vector3;
    public color: Color;

    public constructor(attr: LightAttributes) {
        super(attr);
        this.range = attr.range;
        this.limit = attr.limit;
        this.color = attr.color || Colors.w;
        this.specular = attr.specular;
        this.direction = attr.direction || Vector3.forwards;
    }

    public build(): void {
        super.build();
        this.addChild(new GLCuboid({
            colors: [Colors.y],
            size: v3(50,50,2),
            rotation: this.direction
        }))
    }
}