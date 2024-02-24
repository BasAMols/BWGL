import { Vector2 } from '../utils/vector2';
import { CanvasColor, CanvasColorAttributes } from './canvasColor';

export type CanvasSquareAttributes = CanvasColorAttributes & {
    size?: Vector2,
};
export class CanvasSquare extends CanvasColor {
    public shape = 'square' as const;

    private _size: Vector2;
    public get size() {
        return this._size;
    }
    public set size(value: Vector2) {
        if (value) {
            this._size = value;
        }
    };

    public get width() { return this._size.x; }
    public set width(value: number) {
        this._size.x = value;
    }

    public get height() { return this._size.y; }
    public set height(value: number) {
        this._size.y = value;
    }

    constructor(attr: CanvasSquareAttributes = {}) {
        super(attr);
        this.color = attr.color;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    public getLiniarGradient(): CanvasGradient | '' {
        if (this.linearGradient) {
            const grd = this.game.renderer.ctx.createLinearGradient(this.position.x, this.position.y, this.position.x + this.width, this.position.y + this.height);
            
            this.linearGradient.stops.forEach(([number,color])=>{
                grd.addColorStop(number, color);
            })
            
            return grd;
        } 
        return ""
    }
    public getRadialGradient(): CanvasGradient | '' {
        if (this.radialGradient) {
            const grd = this.game.renderer.ctx.createRadialGradient(
                this.position.x + this.width /2,
                this.position.y + this.height /2,
                0,
                this.position.x + this.width /2,
                this.position.y + this.height /2,
                this.width
            );            
            this.radialGradient.stops.forEach(([number,color])=>{
                grd.addColorStop(number, color);
            })
            return grd;
        } 
        return ""
    }
}
