import { Vector2 } from '../utils/vector2';
import { CanvasColor, CanvasColorAttributes } from './canvasColor';

export type CanvasElipseAttributes = CanvasColorAttributes & {
    radiusX?: number,
    radiusY?: number,
    center?: boolean;
};
export class CanvasElipse extends CanvasColor {

    public readonly shape = 'circle';

    private radiusX: number;
    private radiusY: number;

    public center: boolean;

    constructor(attr: CanvasElipseAttributes = {}) {
        super(attr);
        this.radiusX = attr.radiusX;
        this.radiusY = attr.radiusY;
        this.center = attr.center;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radiusX, this.radiusY, 0, 2 * Math.PI, 0, false);
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
            const grd = this.game.renderer.ctx.createLinearGradient(this.position.x - this.radiusX, this.position.y - this.radiusY, this.position.x + this.radiusX, this.position.y + this.radiusY);
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
                Math.max(this.radiusX, this.radiusY)
            );
            this.radialGradient.stops.forEach(([number,color])=>{
                grd.addColorStop(number, color);
            })
            return grd;
        }
        return '';
    }
}
