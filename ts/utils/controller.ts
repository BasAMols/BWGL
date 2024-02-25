import { CanvasElement, CanvasElementAttributes, CanvasElementType } from '../canvas/canvasElement';

export class CanvasController extends CanvasElement {
    public type: CanvasElementType = 'logic';

    public constructor(attr: CanvasElementAttributes = {}) {
        super(attr);
    }

    public render(c: CanvasRenderingContext2D): void {
        // void
    }
    public mouseMove(e: MouseEvent) {
        // void
    }
    public keyDown(e: KeyboardEvent) {
        // void
    }
    public keyUp(e: KeyboardEvent) {
        // void
    }
}