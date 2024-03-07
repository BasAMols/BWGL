import { ElementPosition, ElementPositionAttributes } from './elementPosition';
import { Vector2 } from './vector2';

export type ElementScaleAttributes = ElementPositionAttributes & {
    // scale?: Vector2,
};
export abstract class ElementScale extends ElementPosition {

    // protected _scaleX: number = 1;
    // protected _scaleY: number = 1;
    // public get scaleX() {
    //     return this._scaleX;
    // };
    // public set scaleX(n) {
    //     this._scaleX = n;
    // };
    // public get scaleY() {
    //     return this._scaleY;
    // };
    // public set scaleY(n) {
    //     this._scaleY = n;
    // };

    // public get scale() {
    //     return new Vector2(this.scaleX, this.scaleY);
    // }
    // public set scale(value: Vector2) {
    //     this.scaleX = value.x;
    //     this.scaleY = value.y;
    // };

    constructor(attr: ElementScaleAttributes = {}) {
        super(attr);
        // if (attr.scale) {
        //     // this.scale = attr.scale;
        // }
    }

}
