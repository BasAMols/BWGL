import { CanvasElement, CanvasElementAttributes, CanvasElementType } from './canvasElement';

export type CanvasCustomAttributes = CanvasElementAttributes & {
    render?: (c: CanvasRenderingContext2D)=>void,
};
export class CanvasCustom extends CanvasElement {
    public type: CanvasElementType = 'color';
    constructor(attr: CanvasCustomAttributes = {}) {
        super(attr);
        this.render = attr.render.bind(this);
    }
}
