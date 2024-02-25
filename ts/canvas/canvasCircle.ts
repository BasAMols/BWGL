import { Vector2 } from '../utils/vector2';
import { CanvasColor, CanvasColorAttributes } from './canvasColor';

export type CanvasCircleAttributes = CanvasColorAttributes & {
    radius: number,
    radiusY?: number,
    center?: boolean;
    angle?: number;
};
export class CanvasCircle extends CanvasColor {

    public readonly shape = 'circle';

    public radius: number;
    public radiusY: number;
    public angle: number;

    public center: boolean;

    constructor(attr: CanvasCircleAttributes) {
        super(attr);
        this.radius = attr.radius;
        this.radiusY = attr.radiusY || attr.radius;
        this.center = attr.center;
        this.angle = attr.angle || 0;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        super.render(ctx);
        ctx.fillStyle = this.getColor();
        ctx.beginPath();

        ctx.ellipse(
            this.position.x + this.anchoredPosition.x,
            this.position.y + this.anchoredPosition.y,
            this.radius,
            this.radiusY,
            this.angle,
            0, 2
        * Math.PI,
            false
        );

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
            const grd = this.game.renderer.ctx.createLinearGradient(
                this.position.x+this.anchoredPosition.x - this.radius, 
                this.position.y+this.anchoredPosition.y - this.radiusY, 
                this.position.x+this.anchoredPosition.x + this.radius, 
                this.position.y+this.anchoredPosition.y + this.radiusY
                );
            this.linearGradient.stops.forEach(([number, color]) => {
                grd.addColorStop(number, color);
            });
            return grd;
        }
        return '';
    }
    public getRadialGradient(): CanvasGradient | '' {
        if (this.radialGradient) {
            if (!this.radialGradient.offset) {
                this.radialGradient.offset = Vector2.zero;
            }
            const grd = this.game.renderer.ctx.createRadialGradient(
                this.position.x+this.anchoredPosition.x + this.radialGradient.offset.x,
                this.position.y+this.anchoredPosition.y + this.radialGradient.offset.y,
                0,
                this.position.x+this.anchoredPosition.x,
                this.position.y+this.anchoredPosition.y,
                Math.max(this.radius, this.radiusY)
            );
            this.radialGradient.stops.forEach(([number, color]) => {
                grd.addColorStop(number, color);
            });
            return grd;
        }
        return '';
    }
}
