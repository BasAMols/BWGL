import { Vector2 } from '../utils/vector2';
import { CanvasElement, CanvasElementAttributes } from './canvasElement';

export type LinearGradient = {
    angle: number,
    stops: [number,string][]
}
export type RadialGradient = {
    stops: [number,string][],
    offset?: Vector2,
}
export type ColorType = 'color'|'linearGradient'|'radialGradient';
export type CanvasColorAttributes = CanvasElementAttributes & {
    color?: string,
    stroke?: string,
    strokeWidth?: number,
    linearGradient?: LinearGradient,
    radialGradient?: RadialGradient,
}
export abstract class CanvasColor extends CanvasElement {
    public abstract shape: 'circle'|'square';
    public type:'color' = 'color';
    public colorType: ColorType = 'color';
    public color: string;
    public linearGradient: LinearGradient;
    public radialGradient: RadialGradient;
    public stroke: string;
    public strokeWidth: number = 0;

    constructor(attr: CanvasColorAttributes = {}) {
        super(attr);
        this.color = attr.color
        this.stroke = attr.stroke
        this.strokeWidth = attr.strokeWidth | 0
        this.linearGradient = attr.linearGradient
        this.radialGradient = attr.radialGradient
    }

    public abstract render(c: CanvasRenderingContext2D ): void
    public getColor(): string | CanvasGradient | CanvasPattern {
        if (this.colorType === 'color'){
            return this.color
        }
        if (this.colorType === 'linearGradient'){
            return this.getLiniarGradient();
        }
        if (this.colorType === 'radialGradient'){
            return this.getRadialGradient();
        }
    }
    public abstract getLiniarGradient(): CanvasGradient | ''
    public abstract getRadialGradient(): CanvasGradient | ''
}
