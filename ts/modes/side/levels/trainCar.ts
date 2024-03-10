import { CanvasAnimation } from '../../../canvas/canvasAnimation';
import { CanvasCustom } from '../../../canvas/canvasCustom';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasSquare } from '../../../canvas/canvasSquare';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { PrepSpritesheet } from '../../../canvas/spritesheet';
import { Collider } from '../../../utils/collider';
import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';
import { Train } from './train';
import { TrainDoor } from './trainDoor';


export class TrainCar extends CanvasWrapper {
    public foregsquare: CanvasImage;
    private v: number;
    private lastOffset: number = 1;
    public door: TrainDoor;
    private factor = 0.05;
    private scale = 6;
    public frame: CanvasImage;
    public interior: CanvasImage;
    public train: Train;
    public set offset(value: Vector2) {
        this.door.offset = value;
    }
    constructor(train: Train, x: number, y: number = 100, w: number = 800, h: number = 400, v: number = 0) {
        super({
            position: new Vector2(x, y),
            size: new Vector2(w, h),
        });
        this.v = v || 0;
        this.train = train;
    }

    build() {

        this.frame = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Frame Back.png',
                factor: this.scale,
            }, this.game),
            position: new Vector2(0, 0),
        });
        this.addChild(this.frame);

        this.interior = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Interior.png',
                factor: this.scale,
            }, this.game),
            position: new Vector2(0, 0),
        });
        this.addChild(this.interior);

        this.interior.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.fill([
                    [9, 14],
                    [247, 14],
                    [247, ce + 762 > 0 ? 16 : 8, ce + 762 > 0 ? 1 : 0],
                    [247, 8, 1],
                    [9, 8, 1],
                    [9, ce - 762 <= 0 ? 16 : 8, ce - 762 <= 0 ? 1 : 0],
                    [9, 16],
                ], '#58473f', '#140e14');

                this.fill([
                    [18, 16],
                    [240, 16],
                    [240, 16, 1],
                    [18, 16, 1],
                ], '#8f563b');

                for (let index = 18; index < 239; index += 4) {
                    this.line('#662736', 0 + index, 16, 0, 0 + index, 16, 1, 'x');
                    this.line('#e37332', 1 + index, 16, 0, 1 + index, 16, 1, 'x');
                    if (index % 8 === 2){
                        this.line('#662736', 0 + index, 16, 0.2, 0 + index, 16, 0.3, 'x', 4);
                    }
                    if (index % 8 === 6){
                        this.line('#662736', 0 + index, 16, 0.7, 0 + index, 16, 0.8, 'x', 4);
                    }
                }

                // this.line('#140e14', 8, 15, 0, 8, 15, 1);
                // this.line('#140e14', 248, 15, 1,248, 15, 1);
                // this.line('#140e14', 8, 10, 0, 8, 10, 1);
                // this.line('#140e14', 248, 10, 0, 248, 10, 1);
            }
        }), true);

        this.door = new TrainDoor();
        this.interior.addChild(this.door, true);

        this.interior.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.fill([
                    [8, 61],
                    [248, 61],
                    [248, ce + 762 > 0 ? 61 : 57, ce + 762 > 0 ? 1 : 0],
                    [248, 57, 1],
                    [8, 57, 1],
                    [8, ce - 762 <= 0 ? 61 : 57, ce - 762 <= 0 ? 1 : 0],
                    [8, 61],
                ], '#7e6970', '#140e14');

                this.line('#140e14', 8, 57, 1, 8, 61, 1);
                this.line('#140e14', 8, 61, 1, 248, 61, 1);
                this.line('#140e14', 248, 61, 1, 248, 57, 1);
                this.line('#140e14', 8, 61, 0, 8, 61, 1);
                this.line('#140e14', 248, 61, 0, 248, 61, 1);

            }
        }), true);
        this.interior.relativity = 'anchor';


        ([
            [0, 5, 256, 6], //hedgeBottom
            [8, 50, 240, 8], //hedgeBottom
        ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 80]) => {
            this.addChild(new Collider({
                position: new Vector2(x * this.scale, y * this.scale),
                size: new Vector2(w * this.scale, h * this.scale),
                cornerTolerance: t,
            }));
        });
    }

    private lineSequence(fill: string, points: [number, number, number?][]) {
        for (let i = 0; i < points.length - 1; i++) {
            this.line(fill, points[i][0], points[i][1], points[i][2] || 0, points[i + 1][0], points[i + 1][1], points[i + 1][2] || 0);
        }
    }

    private line(fill: string, x: number, y: number, offset: number, x2: number, y2: number, offset2: number, style: 'x' | 'y' | 'z' = offset !== offset2 ? 'z' : x === x2 ? 'x' : 'y', w: number = 1): void {
        this.game.ctx.fillStyle = fill;
        this.game.ctx.save();

        if (style === 'x') {
            this.switchOffsetRender(offset);
            this.game.ctx.beginPath();
            this.game.ctx.moveTo((x) * this.scale, (y) * this.scale);
            this.game.ctx.lineTo((x + w) * this.scale, (y) * this.scale);
            this.switchOffsetRender(offset2);
            this.game.ctx.lineTo((x2 + w) * this.scale, (y2) * this.scale);
            this.game.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
            this.game.ctx.fill();
            this.game.ctx.closePath();
        }

        if (style === 'y') {
            this.switchOffsetRender(offset);
            this.game.ctx.beginPath();
            this.game.ctx.moveTo((x) * this.scale, (y) * this.scale);
            this.game.ctx.lineTo((x) * this.scale, (y + w) * this.scale);
            this.switchOffsetRender(offset2);
            this.game.ctx.lineTo((x2) * this.scale, (y2 + w) * this.scale);
            this.game.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
            this.game.ctx.fill();
            this.game.ctx.closePath();
        }

        if (style === 'z') {
            this.switchOffsetRender(offset);
            this.game.ctx.beginPath();
            this.game.ctx.moveTo((x) * this.scale, (y) * this.scale);
            this.game.ctx.lineTo((x + w) * this.scale, (y) * this.scale);
            this.switchOffsetRender(offset2);
            this.game.ctx.lineTo((x2 + w) * this.scale, (y2) * this.scale);
            this.game.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
            this.game.ctx.fill();
            this.game.ctx.closePath();

            this.game.ctx.beginPath();
            this.game.ctx.moveTo((x2) * this.scale, (y2) * this.scale);
            this.game.ctx.lineTo((x2) * this.scale, (y2 + w) * this.scale);
            this.switchOffsetRender(offset);
            this.game.ctx.lineTo((x) * this.scale, (y + w) * this.scale);
            this.game.ctx.lineTo((x) * this.scale, (y) * this.scale);
            this.game.ctx.fill();
            this.game.ctx.closePath();

            this.game.ctx.beginPath();
            this.game.ctx.moveTo((x) * this.scale, (y + w) * this.scale);
            this.game.ctx.lineTo((x + w) * this.scale, (y + w) * this.scale);
            this.switchOffsetRender(offset2);
            this.game.ctx.lineTo((x2 + w) * this.scale, (y2 + w) * this.scale);
            this.game.ctx.lineTo((x2) * this.scale, (y2 + w) * this.scale);
            this.game.ctx.fill();
            this.game.ctx.closePath();

            this.game.ctx.beginPath();
            this.game.ctx.moveTo((x2 + w) * this.scale, (y2) * this.scale);
            this.game.ctx.lineTo((x2 + w) * this.scale, (y2 + w) * this.scale);
            this.switchOffsetRender(offset);
            this.game.ctx.lineTo((x + w) * this.scale, (y + w) * this.scale);
            this.game.ctx.lineTo((x + w) * this.scale, (y) * this.scale);
            this.game.ctx.fill();
            this.game.ctx.closePath();
        }

        this.game.ctx.restore();
        this.lastOffset = undefined;

        // this.game.ctx.lineTo((x2) * this.scale, (y2 + 1) * this.scale);
        // this.game.ctx.lineTo((x2 + 1) * this.scale, (y2 + 1) * this.scale);
        // this.game.ctx.lineTo((x2 + 1) * this.scale, (y2) * this.scale);

        // this.switchOffsetRender(offset);
        // this.game.ctx.moveTo((x + 1) * this.scale, (y) * this.scale);
        // this.game.ctx.lineTo((x) * this.scale, (y + 1) * this.scale);
        // this.game.ctx.lineTo((x) * this.scale, (y + 1) * this.scale);
        // this.switchOffsetRender(offset2);
        // this.game.ctx.lineTo((x2) * this.scale, (y2 + 1) * this.scale);
        // this.game.ctx.lineTo((x2 + 1) * this.scale, (y2 + 1) * this.scale);
        // this.game.ctx.lineTo((x2 + 1) * this.scale, (y2) * this.scale);

        // if (offset2 !== offset) {

        //     let px1 = offset2 < offset ? x2 : x;
        //     let py1 = offset2 < offset ? y2 : y;
        //     let po1 = offset2 < offset ? offset2 : offset;
        //     let px2 = offset2 < offset ? x : x2;
        //     let py2 = offset2 < offset ? y : y2;
        //     let po2 = offset2 < offset ? offset : offset2;


        //     this.switchOffsetRender(po1);
        //     this.game.ctx.moveTo((px1) * this.scale, (py1 +1) * this.scale);
        //     this.game.ctx.lineTo((px1+1 ) * this.scale, (py1 + 1) * this.scale);
        //     this.game.ctx.lineTo((px1 + 1) * this.scale, (py1) * this.scale);
        //     this.switchOffsetRender(po2);
        //     this.game.ctx.lineTo((px2 + 1) * this.scale, (py2) * this.scale);
        //     this.game.ctx.lineTo((px2) * this.scale, (py2) * this.scale);
        //     this.game.ctx.lineTo((px2) * this.scale, (py2 + 1) * this.scale);
        // } else {
        //     this.switchOffsetRender(offset);
        //     if (x === x2) {
        //         this.game.ctx.moveTo((x) * this.scale, (y) * this.scale);
        //         this.game.ctx.lineTo((x + 1) * this.scale, (y) * this.scale);
        //         this.game.ctx.lineTo((x2 + 1) * this.scale, (y2) * this.scale);
        //         this.game.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
        //     } else if (y === y2) {
        //         this.game.ctx.moveTo((x) * this.scale, (y) * this.scale);
        //         this.game.ctx.lineTo((x) * this.scale, (y + 1) * this.scale);
        //         this.game.ctx.lineTo((x2) * this.scale, (y2 + 1) * this.scale);
        //         this.game.ctx.lineTo((x2) * this.scale, (y2) * this.scale);
        //     }
        // }

        // this.game.ctx.moveTo((x) * this.scale, (y) * this.scale);
        // this.game.ctx.lineTo((x) * this.scale, (y +1) * this.scale);
        // // this.game.ctx.lineTo((x + 1) * this.scale, (y + 1) * this.scale);
        // this.switchOffsetRender(offset2);
        // this.game.ctx.lineTo((x2 + 1) * this.scale, (y2 + 1) * this.scale);
        // this.game.ctx.lineTo((x2 + 1) * this.scale, (y2) * this.scale);
        // this.game.ctx.lineTo((x2) * this.scale, (y2) * this.scale);

    }

    private switchOffsetRender(offset: number) {

        if (this.lastOffset !== offset) {
            this.lastOffset = offset;
            this.game.ctx.restore();
            this.game.ctx.save();
            this.game.ctx.scale(1 + (this.factor * offset), 1 + (this.factor * offset));
            this.game.ctx.translate((-this.width * (this.factor / 2)) * offset, 0);
            this.game.ctx.translate(
                (((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x)) * this.factor) * offset,
                -50 * offset
            );

        }
    }

    private fill(points: [number, number, number?][], fill: string, stroke?: string) {
        this.game.ctx.beginPath();
        this.game.ctx.save();

        points.forEach((p, i) => {
            this.switchOffsetRender(p[2] || 0);
            this.game.ctx[i === 0 ? 'moveTo' : 'lineTo'](p[0] * this.scale, p[1] * this.scale);
        });

        this.game.ctx.fillStyle = fill;
        this.game.ctx.fill();
        this.game.ctx.closePath();
        this.game.ctx.restore();

        if (stroke) {
            this.lineSequence(stroke, points);
        }
    }
}