import { ElementPosition, ElementPositionAttributes } from './elementPosition';
import { Vector2 } from './vector2';

export type ElementZoomAttributes = ElementPositionAttributes & {
    zoom?: Vector2,
};
export abstract class ElementZoom extends ElementPosition {

    protected _zoomX: number = 1;
    protected _zoomY: number = 1;
    public get zoomX() {
        return this._zoomX;
    };
    public set zoomX(n) {
        this._zoomX = n;
    };
    public get zoomY() {
        return this._zoomY;
    };
    public set zoomY(n) {
        this._zoomY = n;
    };

    public get zoom() {
        return new Vector2(this.zoomX, this.zoomY);
    }
    public set zoom(value: Vector2) {
        this.zoomX = value.x;
        this.zoomY = value.y;
    };

    constructor(attr: ElementZoomAttributes = {}) {
        super(attr);
        if (attr.zoom) {
            this._zoomX = attr.zoom.x;
            this._zoomY = attr.zoom.y;
        }

    }

}
