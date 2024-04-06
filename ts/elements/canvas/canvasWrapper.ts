import { ElementRelativity } from '../../utils/elementPosition';
import { CanvasElement, CanvasElementAttributes, CanvasElementType } from './canvasElement';

export type CanvasWrapperAttributes = CanvasElementAttributes & {
};
export class CanvasWrapper extends CanvasElement {
    public type: CanvasElementType = 'wrapper';
    public relativity: ElementRelativity;

    constructor(attr: CanvasWrapperAttributes = {}) {
        super(attr);
        if (!attr.relativity) {
            this.relativity = 'anchor';
        }
    }
}


