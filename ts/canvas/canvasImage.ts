import { ElementRelativity } from '../utils/elementPosition';
import { Vector2 } from '../utils/vector2';
import { CanvasElement, CanvasElementAttributes,CanvasElementType } from './canvasElement';
import { PrepImage } from './prepImage';

export type CanvasImageAttributes = CanvasElementAttributes & {
    image: PrepImage,
    condition?: (position: Vector2, size: Vector2)=>void,
    paralax? : number,
    repeatX?: number,
    repeatY?: number,
    opacity?: number,
};
export class CanvasImage extends CanvasElement {
    public type: CanvasElementType = 'image';
    public prepped: PrepImage;
    public relativity: ElementRelativity = 'relative';
    public condition: (position: Vector2, size: Vector2) => void;
    protected paralax: number;
    protected repeatX: number;
    protected repeatY: number;
    protected opacity: number;

    constructor(attr: CanvasImageAttributes) {
        super(attr);
        this.prepped = attr.image;
        this.condition = attr.condition;
        this.paralax = attr.paralax || 0;
        this.repeatX = attr.repeatX || 1;
        this.repeatY = attr.repeatY || 1;
        this.opacity = attr.opacity || 1;
    }

    public render(ctx: CanvasRenderingContext2D) {        
        if (this.prepped.ready && (!this.condition || this.condition(this.position.add(this.parent.position), this.prepped.size))) {            
            for (let i = 0; i < this.repeatX; i++) {
                for (let j = 0; j < this.repeatY; j++) {
                    ctx.globalAlpha = this.opacity;
                    ctx.drawImage(
                        this.prepped.image,
                        this.x + (this.paralax * this.level.x) + (i * this.prepped.width),
                        this.y + (j * this.prepped.height),
                        this.prepped.width,
                        this.prepped.height,
                    );
                }
            }     
        }
    }
}
