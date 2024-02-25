import { CanvasCircle } from '../../../../canvas/canvasCircle';
import { ColorType } from '../../../../canvas/canvasColor';
import { CanvasController } from '../../../../utils/controller';
import { Vector2 } from '../../../../utils/vector2';
import { SnakeColors } from '../snake';

export class Tail extends CanvasCircle {
    private trace: Vector2[] = [];
    private number: number;
    
    protected bottomRadius: number;
    protected topRadius: number;
    protected moving: boolean = false;
    protected next: Tail;

    public colorType: ColorType = 'radialGradient';
    public colors: SnakeColors;
    public distance: number;
    public total: number;

    constructor({
        number,
        distance,
        total,
        topRadius = 120,
        bottomRadius = 20,
        controllers = []
    }: {
        number: number;
        distance: number;
        total: number;
        topRadius?: number;
        bottomRadius?: number;
        controllers?: CanvasController[];
    }) {

        super({
            position: new Vector2(200, 200),
            radius: (1- (number / total)) * (topRadius - bottomRadius) + bottomRadius,
            color: `transparant`,
            center: true,
            controllers
        });
        
        this.number = number;
        this.distance = distance;
        this.total = total;
        this.visible = false;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
    }

    public add(total: number) {
        if (this.next) {
            this.next.add(total);
        } else {
            this.next = new Tail({ number: this.number + 1, distance: this.distance, total, topRadius: this.topRadius, bottomRadius: this.bottomRadius, controllers: [] });
            this.next.colors = this.colors;
            this.addChild(this.next);
        }
    }

    public follow(p: Vector2) {
        this.trace.push(p);

        if (this.moving) {
            this.position = this.trace.shift().clone();
            if (this.next) {
                this.next.follow(this.position.clone());
            }

        } else if (this.trace.length === Math.max(3, Math.round((this.distance - ((this.number / this.total) * this.distance))))) {
            this.moving = true;
            this.position = this.trace[0].clone();
            this.visible = true;
            this.getColorGradient();

        } else {
            this.visible = false;
        }
    }

    public getColorGradient() {


        const lin = 1 - (this.number / this.total);
        const h = (lin * 360);
        const s = ({
            rainbow: [
                [0.1, `hsla(${h},0%,0%,${100}%)`],
                [0.68, `hsla(${h},100%,50%,${100}%)`],
            ],
            green: [
                [0.1, `hsla(140,0%,0%,${100}%)`],
                [0.68, `hsla(140,45%,40%,${100}%)`],
            ],
            dark: [
                [0.1, `black`],
                [0.68, `black`],
            ],
        } as Record<SnakeColors, [number, string][]>)[this.colors];

        s.push(
            [0.68, `black`],
            [0.7 + ((1 - lin) * .06), `black`],
            [0.7 + ((1 - lin) * .06), `#00000011`],
            [1, `#00000000`]
        );

        this.radialGradient = {
            stops: s,
            offset: new Vector2(10 * lin, 10 * lin)
        };
    }
}
