import { CanvasCircle } from '../../../canvas/canvasCircle';
import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';
import { Eye } from './parts/eye';
import { Tail } from './parts/tail';

export type SnakeColors = 'rainbow' | 'dark' | 'green';
export class Snake extends Tail {
    public renderStyle: 'over' | 'under' = 'over';
    public eye1: CanvasCircle;
    public eye2: CanvasCircle;

    constructor({
        position = Vector2.zero,
        totals = 10,
        distance = 10,
        colors = 'rainbow',
    }: {
        position?: Vector2;
        totals?: number;
        distance?: number;
        colors?: SnakeColors;
    } = {}) {
        super(0, distance, totals);
        this.position = position;
        this.colors = colors;
        
    }

    build() {
        this.moving = true;
        this.visible = true;
        this.radius = 120;
        this.strokeWidth = 5;
        this.colorType = 'linearGradient';
        this.linearGradient = {
            stops: [
                [0.0, 'rgba(255,0,0,1)'],
                [0.1, 'rgba(255,154,0,1)'],
                [0.2, 'rgba(208,222,33,1)'],
                [0.3, 'rgba(79,220,74,1)'],
                [0.4, 'rgba(63,218,216,1)'],
                [0.5, 'rgba(47,201,226,1)'],
                [0.6, 'rgba(28,127,238,1)'],
                [0.7, 'rgba(95,21,242,1)'],
                [0.8, 'rgba(186,12,248,1)'],
                [0.9, 'rgba(251,7,217,1)'],
                [1.0, 'rgba(255,0,0,1)'],
            ],
            angle: 2
        };

        for (let index = 0; index < this.total; index++) {
            this.add(this.total);
        }

        this.addChild(new Eye(new Vector2(-70, -40)));
        this.addChild(new Eye(new Vector2(70, -40)));
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);

        if (this.next) {
            this.next.follow(this.position.clone());
        }
    }
}
