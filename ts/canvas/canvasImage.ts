import { CanvasElement, CanvasElementAttributes } from './canvasElement';
import { PreppedImage } from './prepImage';

export type CanvasImageAttributes = CanvasElementAttributes & {
    image: PreppedImage,
}
export class CanvasImage extends CanvasElement {
    public type = 'image' as const;
    public prepped: PreppedImage;

    public get width() { return this.prepped.size.x; }
    public set width(value: number) {
        this.prepped.size.x = value;
    }

    public get height() { return this.prepped.size.y; }
    public set height(value: number) {
        this.prepped.size.y = value;
    }

    constructor(attr: CanvasImageAttributes) {
        super(attr);
        this.prepped = attr.image;
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (this.prepped.ready){
            ctx.drawImage(this.prepped.image, this.position.x, this.position.y, this.prepped.width, this.prepped.height);
        }
    }
}
