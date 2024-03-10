import { ElementRelativity } from '../utils/elementPosition';
import { Vector2 } from '../utils/vector2';
import { CanvasElement, CanvasElementAttributes,CanvasElementType } from './canvasElement';
import { PrepImage } from './prepImage';

export type CanvasImageAttributes = CanvasElementAttributes & {
    image: PrepImage,
    condition?: (position: Vector2, size: Vector2)=>void,
    worldSpaceParalaxX? : number,
    worldSpaceParalaxY? : number,
    screenSpaceParalaxX? : number,
    screenSpaceParalaxY? : number,
    repeatX?: number,
    repeatY?: number,
    opacity?: number,
    shadow?: [string, number, number, number],
};
export class CanvasImage extends CanvasElement {
    public type: CanvasElementType = 'image';
    public prepped: PrepImage;
    public relativity: ElementRelativity = 'relative';
    public condition: (position: Vector2, size: Vector2) => void;
    public repeatX: number;
    public repeatY: number;
    public opacity: number;
    public shadow: [string, number, number, number];
    public worldSpaceParalaxX: number;
    public worldSpaceParalaxY: number;
    public screenSpaceParalaxX: number;
    public screenSpaceParalaxY: number;

    get width() {
        return this.prepped.width;
    }
    get height() {
        return this.prepped.height;
    }


    constructor(attr: CanvasImageAttributes) {
        super(attr);
        this.prepped = attr.image;
        this.condition = attr.condition;
        this.worldSpaceParalaxX = attr.worldSpaceParalaxX || 0;
        this.worldSpaceParalaxY = attr.worldSpaceParalaxY || 0;
        this.screenSpaceParalaxX = attr.screenSpaceParalaxX || 0;
        this.screenSpaceParalaxY = attr.screenSpaceParalaxY || 0;
        this.repeatX = attr.repeatX || 1;
        this.repeatY = attr.repeatY || 1;
        this.opacity = attr.opacity || 1;
        this.shadow = attr.shadow;
    }

    public render(ctx: CanvasRenderingContext2D) {        
        if (this.prepped.ready && (!this.condition || this.condition(this.position.add(this.parent.position), this.prepped.size))) {            
            for (let i = 0; i < this.repeatX; i++) {
                for (let j = 0; j < this.repeatY; j++) {
                    if (this.opacity !== 1){
                        ctx.globalAlpha = this.opacity;
                    }
                    if (this.shadow){
                        ctx.shadowColor = this.shadow[0];
                        ctx.shadowOffsetX = this.shadow[1];
                        ctx.shadowOffsetY = this.shadow[2];
                        ctx.shadowBlur = this.shadow[3];
                    }

                    ctx.drawImage(
                        this.prepped.image,
                        this.x + (this.worldSpaceParalaxX * this.level.x) + ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x)) * this.screenSpaceParalaxX + (i * this.prepped.width),
                        this.y + (j * this.prepped.height),
                        this.prepped.width,
                        this.prepped.height,
                    );
                }
            }     
        }
        // this.level.x + this.x + (this.prepped.width/2); // center of image
        // this.level.x + this.x + (this.prepped.width/2);
    }
}
