import { TickerReturnData } from './ticker';
import { Vector2 } from './vector2';

export interface ElementPositionAttributes {
    position?: Vector2,
    relativity?: ElementRelativity,

}
export type ElementRelativity = 'absolute' | 'relative' | 'anchor';
export abstract class ElementPosition {
    public active: boolean = true;
    public relativity: ElementRelativity = 'relative';
    public lastPosition: Vector2 = Vector2.zero;
    public movedAmount: Vector2 = Vector2.zero;

    protected _x: number = 0;
    protected _y: number = 0;

    public get x() {
        return this._x;
    };
    public set x(n) {
        this._x = n;
    }
    public get y() {
        return this._y;
    };
    public set y(n) {
        this._y = n;
    }

    public get position() {
        return new Vector2(this.x, this.y);
    }
    public set position(value: Vector2) {
        this.x = value.x;
        this.y = value.y;
    };

    constructor(attr: ElementPositionAttributes = {}) {
        this.relativity = attr.relativity;
        if (attr.position) {
            this.position = attr.position;
            this._x = attr.position.x;
            this._y = attr.position.y;
        }
    }

    public tick(obj: TickerReturnData) {
        if (this.active) {
            this.movedAmount = this.lastPosition.subtract(this.position);
            this.lastPosition = this.position;
        }
    }
}
