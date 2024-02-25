import { CanvasElement, CanvasElementAttributes } from './canvasElement';

export type CanvasWrapperAttributes = CanvasElementAttributes & {
}
export abstract class CanvasWrapper extends CanvasElement {
    public readonly type = 'wrapper';

    constructor(attr: CanvasWrapperAttributes = {}) {
        super(attr);
    }
}
