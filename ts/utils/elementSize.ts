import { ElementScale, ElementScaleAttributes } from './elementZoom';
import { Vector2 } from './vector2';

export type ElementSizeAttributes = ElementScaleAttributes & {
    size?: Vector2,
};
export abstract class ElementSize extends ElementScale {

    protected _width: number = 0;
    protected _height: number = 0;
    public get width() {
        return this._width;
    };
    public set width(n) {
        this._width = n;
    };
    public get height() {
        return this._height;
    };
    public set height(n) {
        this._height = n;
    };

    public get size() {
        return new Vector2(this.width, this.height);
    }
    public set size(value: Vector2) {
        this.width = value.x;
        this.height = value.y;
    };

    constructor(attr: ElementSizeAttributes = {}) {
        super(attr);
        if (attr.size) {
            this._width = attr.size.x;
            this._height = attr.size.y;
        }
    }

}
