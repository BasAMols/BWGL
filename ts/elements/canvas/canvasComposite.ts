import { ElementRelativity } from '../../utils/elementPosition';
import { CanvasElementType } from './canvasElement';
import { CanvasWrapper, CanvasWrapperAttributes } from './canvasWrapper';

export type CanvasCompositeAttributes = CanvasWrapperAttributes & {

};
export class CanvasComposite extends CanvasWrapper {
    public type: CanvasElementType = 'wrapper';
    public relativity: ElementRelativity = 'composite';
    public compositeCanvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public afterRenderFunction: (c: CanvasRenderingContext2D) => void;

    constructor(attr: CanvasCompositeAttributes = {}, afterRenderingFunction?: (c: CanvasRenderingContext2D) => void) {
        super(attr);
        this.afterRenderFunction = afterRenderingFunction;

    }
    public build(): void {
        super.build();
        this.compositeCanvas = document.createElement('canvas');
        this.compositeCanvas.width = this.level.width;
        this.compositeCanvas.height = this.level.height;
        this.ctx = this.compositeCanvas.getContext('2d');
    }

    public preRender(c: CanvasRenderingContext2D): void {
        if (this.relativity === 'composite') {
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.clearRect(0, 0, this.level.width, this.level.height);
            super.preRender(this.ctx);
        } else {
            super.preRender(c);
        }
    }

    public postRender(c: CanvasRenderingContext2D): void {
        if (this.relativity === 'composite') {
            if (this.afterRenderFunction) {
                this.afterRenderFunction(this.ctx);
            }
            this.renderHigher(this.ctx);
            c.drawImage(this.compositeCanvas, 0, 0);
            this.ctx.restore();
        } else {
            super.postRender(c);
        }
    }
}


