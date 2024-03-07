import { ElementPosition, ElementPositionAttributes } from './elementPosition';
import { ElementSize, ElementSizeAttributes } from './elementSize';
import { Vector2 } from './vector2';

export type ElementVisibleAttributes = ElementSizeAttributes & {
    visible?: boolean,
}
export abstract class ElementVisible extends ElementSize{
    
    protected _visible: boolean = true;
    public get visible () {
        return this._visible;
    };
    public set visible (v: boolean) {
        this._visible = v;
    }

    constructor(attr: ElementVisibleAttributes = {}) {
        super(attr)
        if (attr.visible !== undefined) {
            this.visible = attr.visible;
        }
    }

}
