import { CanvasElement } from '../../../canvas/canvasElement';

export class CanvasDrawer {
    public lastZ: number = 1;
    public factor = 0.05;
    public scale = 6;
    public ctx: CanvasRenderingContext2D;
    public perspectiveSwitchFunction: (n: number, target: CanvasElement) => void;

    constructor(ctx: CanvasRenderingContext2D, perspectiveSwitchFunction: (n: number, target: CanvasElement) => void) {
        this.ctx = ctx;
        this.perspectiveSwitchFunction = perspectiveSwitchFunction;
    }

    public lineSequence(target: CanvasElement, fill: string, points: [number, number, number?][]) {
        for (let i = 0; i < points.length - 1; i++) {
            this.line(target, fill, points[i][0], points[i][1], points[i][2] || 0, points[i + 1][0], points[i + 1][1], points[i + 1][2] || 0);
        }
    }

    public line(target: CanvasElement, fill: string, x: number, y: number, offset: number, x2: number, y2: number, offset2: number, style: 'x' | 'y' | 'z' = offset !== offset2 ? 'z' : x === x2 ? 'x' : 'y', w: number = 1): void {
        this.ctx.fillStyle = fill;
        this.ctx.save();

        if (style === 'x') {
            this.switchPerspective(target, offset);
            this.ctx.beginPath();
            this.ctx.moveTo((x) * this.scale, (y) * this.scale);
            this.ctx.lineTo((x + w) * this.scale, (y) * this.scale);
            this.switchPerspective(target, offset2);
            this.ctx.lineTo((x2 + w) * this.scale, (y2) * this.scale);
            this.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
            this.ctx.fill();
            this.ctx.closePath();
        }

        if (style === 'y') {
            this.switchPerspective(target, offset);
            this.ctx.beginPath();
            this.ctx.moveTo((x) * this.scale, (y) * this.scale);
            this.ctx.lineTo((x) * this.scale, (y + w) * this.scale);
            this.switchPerspective(target, offset2);
            this.ctx.lineTo((x2) * this.scale, (y2 + w) * this.scale);
            this.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
            this.ctx.fill();
            this.ctx.closePath();
        }

        if (style === 'z') {
            this.switchPerspective(target, offset);
            this.ctx.beginPath();
            this.ctx.moveTo((x) * this.scale, (y) * this.scale);
            this.ctx.lineTo((x + w) * this.scale, (y) * this.scale);
            this.switchPerspective(target, offset2);
            this.ctx.lineTo((x2 + w) * this.scale, (y2) * this.scale);
            this.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.moveTo((x2) * this.scale, (y2) * this.scale);
            this.ctx.lineTo((x2) * this.scale, (y2 + w) * this.scale);
            this.switchPerspective(target, offset);
            this.ctx.lineTo((x) * this.scale, (y + w) * this.scale);
            this.ctx.lineTo((x) * this.scale, (y) * this.scale);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.moveTo((x) * this.scale, (y + w) * this.scale);
            this.ctx.lineTo((x + w) * this.scale, (y + w) * this.scale);
            this.switchPerspective(target, offset2);
            this.ctx.lineTo((x2 + w) * this.scale, (y2 + w) * this.scale);
            this.ctx.lineTo((x2) * this.scale, (y2 + w) * this.scale);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.moveTo((x2 + w) * this.scale, (y2) * this.scale);
            this.ctx.lineTo((x2 + w) * this.scale, (y2 + w) * this.scale);
            this.switchPerspective(target, offset);
            this.ctx.lineTo((x + w) * this.scale, (y + w) * this.scale);
            this.ctx.lineTo((x + w) * this.scale, (y) * this.scale);
            this.ctx.fill();
            this.ctx.closePath();
        }

        this.ctx.restore();
        this.lastZ = undefined;
    }

    private switchPerspective(target: CanvasElement, z: number) {

        if (this.lastZ !== z) {
            this.lastZ = z;
            this.ctx.restore();
            this.ctx.save();
            this.perspectiveSwitchFunction(z, target);
        }
    }

    public fill(target: CanvasElement, points: [number, number, number?][], fill: string, stroke?: string) {
        this.ctx.beginPath();
        this.ctx.save();

        points.forEach((p, i) => {
            this.switchPerspective(target, p[2] || 0);
            this.ctx[i === 0 ? 'moveTo' : 'lineTo'](p[0] * this.scale, p[1] * this.scale);
        });

        this.ctx.fillStyle = fill;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        if (stroke) {
            this.lineSequence(target, stroke, points);
        }
    }
}