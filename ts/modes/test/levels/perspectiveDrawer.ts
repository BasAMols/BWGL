import { CanvasElement } from '../../../elements/canvas/canvasElement';
import { Util } from '../../../utils/utils';
import { Vector3 } from '../../../utils/vector3';

export class CanvasDrawer {
    public lastZ: number = 1;
    public factor = 0.01;
    public scale = 6;
    public ctx: CanvasRenderingContext2D;
    public perspectiveSwitchFunction: (n: number, target: CanvasElement, c: CanvasRenderingContext2D) => void;

    constructor(ctx: CanvasRenderingContext2D, perspectiveSwitchFunction: (n: number, target: CanvasElement, c: CanvasRenderingContext2D) => void) {
        this.ctx = ctx;
        this.perspectiveSwitchFunction = perspectiveSwitchFunction;
    }

    public lineSequence(target: CanvasElement, fill: string, points: [number, number, number?, ('x' | 'y' | 'z' | 'xy')?][], style?: 'x' | 'y' | 'z' | 'xy') {
        for (let i = 0; i < points.length - 1; i++) {
            // this.line(target, fill, points[i][0], points[i][1], points[i][2] || 0, points[i + 1][0], points[i + 1][1], points[i + 1][2] || 0, style || points[i + 1][3]);
        }
    }

    public dot(target: CanvasElement, fill: string, v: Vector3, ): void {
        this.ctx.beginPath();
        const sf = (v.z/target.level.depth)*(2-(v.z/target.level.depth))//*(s.z/target.level.depth);
        const start = target.level.center.subtract(v).scale(sf).add(v);


        this.ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
        // this.ctx.moveTo((start.x), (start.y));
        // this.ctx.lineTo((end.x), (end.y));
        this.ctx.fillStyle = fill;
        this.ctx.fill();
        this.ctx.closePath();

        // this.ctx.save();
        // this.ctx.scale(1, -1);
        // this.ctx.translate(15, -target.game.renderer.height);
        // this.ctx.font = '20px monospace';
        // this.ctx.textAlign = 'left';
        // this.ctx.fillText(`x${Math.round(start.x)},y${Math.round(start.y)},${sf*100}`, start.x, target.game.renderer.height- start.y-20);
        // this.ctx.fillText(`x${Math.round(v.x)},y${Math.round(v.y)},${v.z}`, start.x, target.game.renderer.height- start.y);
        // this.ctx.restore();
    }

    public line(target: CanvasElement, fill: string, s: Vector3, e: Vector3, w: number = 2): void {
        this.ctx.beginPath();
        const sf = Util.clamp((s.z/target.level.depth)*(2-(s.z/target.level.depth)), 0,1)//*(s.z/target.level.depth);
        const ef = Util.clamp((e.z/target.level.depth)*(2-(e.z/target.level.depth)), 0,1)//*(e.z/target.level.depth);
        
        const start = target.level.center.subtract(s).scale(sf).add(s);
        const end = target.level.center.subtract(e).scale(ef).add(e);

        this.ctx.moveTo((start.x), (start.y));
        this.ctx.lineTo((end.x), (end.y));
        this.ctx.lineWidth = w;
        this.ctx.strokeStyle = fill;
        this.ctx.stroke();
    }

    private switchPerspective(target: CanvasElement, z: number) {
        if (this.lastZ !== z) {
            this.lastZ = z;
            this.ctx.restore();
            this.ctx.save();
            this.perspectiveSwitchFunction(z, target, this.ctx);
        }
    }

    public fill(target: CanvasElement, points: [number, number, number?][], fill: string, stroke?: string) {
        this.ctx.fillStyle = fill;
        this.ctx.save();
        this.ctx.beginPath();

        points.forEach((p, i) => {
            this.switchPerspective(target, p[2] || 0);
            this.ctx[i === 0 ? 'moveTo' : 'lineTo'](p[0] * this.scale, p[1] * this.scale);
        });

        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        this.lastZ = undefined;

        if (stroke) {
            this.lineSequence(target, stroke, points);
        }

    }
}