import { Vector2 } from '../utils/vector2';
import { CanvasColor, CanvasColorAttributes } from './canvasColor';

export type CanvasCircleAttributes = CanvasColorAttributes & {
    radius?: number,
    center?: boolean;
};
export class CanvasCircle extends CanvasColor {

    public readonly shape = 'circle';

    private _radius: number;
    public get radius() {
        return this._radius;
    }
    public set radius(value: number) {
        if (value) {
            this._radius = value;
        }
    };

    public center: boolean;

    constructor(attr: CanvasCircleAttributes = {}) {
        super(attr);
        this.radius = attr.radius;
        this.center = attr.center;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        if (this.strokeWidth) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.stroke || 'black';
            ctx.stroke();
        }
        ctx.closePath();
    }

    public getLiniarGradient(): CanvasGradient | '' {
        if (this.linearGradient) {
            const grd = this.game.renderer.ctx.createLinearGradient(this.position.x - this.radius, this.position.y - this.radius, this.position.x + this.radius, this.position.y + this.radius);
            this.linearGradient.stops.forEach(([number,color])=>{
                grd.addColorStop(number, color);
            })
            return grd;
        }
        return '';
    }
    public getRadialGradient(): CanvasGradient | '' {
        if (this.radialGradient) {
            if (!this.radialGradient.offset){
                this.radialGradient.offset = Vector2.zero
            }
            const grd = this.game.renderer.ctx.createRadialGradient(
                this.position.x+ this.radialGradient.offset.x,
                this.position.y + this.radialGradient.offset.y,
                0,
                this.position.x ,
                this.position.y,
                this.radius
            );
            this.radialGradient.stops.forEach(([number,color])=>{
                grd.addColorStop(number, color);
            })
            return grd;
        }
        return '';
    }
}
