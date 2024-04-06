import { Vector2 } from '../../utils/vector2';
import { CanvasColor, CanvasColorAttributes } from './canvasColor';

export type CanvasSquareAttributes = CanvasColorAttributes & {
    rounded?: number;
    condition?: (position: Vector2, size: Vector2)=>void,
    opacity?: number,
};
export class CanvasSquare extends CanvasColor {
    public shape = 'square' as const;
    public rounded: number;
    public condition: (position: Vector2, size: Vector2) => void;
    public opacity: number;

    constructor(attr: CanvasSquareAttributes = {}) {
        super(attr);
        this.color = attr.color;
        this.rounded = attr.rounded || 3;
        this.condition = attr.condition;
        this.opacity = attr.opacity || 1;

    }

    public render(ctx: CanvasRenderingContext2D): void {
        if ((!this.condition || this.condition(this.position.add(this.parent.position), this.size))) {
            ctx.fillStyle = this.getColor();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.roundRect(this.position.x, this.position.y, this.width, this.height, this.rounded);
            if (this.color){
                ctx.fill();
            }
            if (this.strokeWidth) {
                ctx.lineWidth = this.strokeWidth;
                ctx.strokeStyle = this.stroke || 'black';
                ctx.stroke();
            }
            ctx.closePath();
        }
    }

    public getLiniarGradient(): CanvasGradient | '' {
        if (this.linearGradient) {
            const grd = this.game.renderer.ctx.createLinearGradient(
                this.position.x + this.anchoredPosition.x,
                this.position.y + this.anchoredPosition.y,
                this.position.x + this.anchoredPosition.x + this.width,
                this.position.y + this.anchoredPosition.y + this.height
            );

            this.linearGradient.stops.forEach(([number, color]) => {
                grd.addColorStop(number, color);
            });

            return grd;
        }
        return "";
    }
    public getRadialGradient(): CanvasGradient | '' {
        if (this.radialGradient) {
            const grd = this.game.renderer.ctx.createRadialGradient(
                this.position.x + this.width / 2,
                this.position.y + this.height / 2,
                0,
                this.position.x + this.width / 2,
                this.position.y + this.height / 2,
                this.width
            );
            this.radialGradient.stops.forEach(([number, color]) => {
                grd.addColorStop(number, color);
            });
            return grd;
        }
        return "";
    }
}
