import { CanvasImage } from '../../../elements/canvasImage';
import { CanvasWrapper } from '../../../elements/canvasWrapper';
import { PrepImage } from '../../../elements/prepImage';
import { Vector2 } from '../../../utils/vector2';
import { CanvasDrawer } from './perspectiveDrawer';
import { TrainCar } from './trainCar';

export class TrainDoor extends CanvasWrapper {
    public offset: Vector2;
    public doorHeight = 45 *this.draw.scale;
    public outer: CanvasImage;
    public inner: CanvasImage;
    
    constructor(public draw: CanvasDrawer, public car: TrainCar) {
        super();
    }

    public build(): void {
        this.outer = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/door.png',
                factor: 6,
            }, this.game),
            position: new Vector2(0, 0),
        });
        this.addChild(this.outer);
        const or = this.outer.render.bind(this.outer);
        this.outer.render = (c: CanvasRenderingContext2D) => {
            if (this.offset.x + 17 *this.draw.scale * this.draw.factor > 0) {
                c.transform((this.offset.x + 17 *this.draw.scale * this.draw.factor) / this.outer.prepped.width, -(0.22), 0, 1 / (this.outer.prepped.height / this.doorHeight), 17 *this.draw.scale, 13 *this.draw.scale);
                or(c);
            }
            if (this.offset.x + 223 *this.draw.scale * this.draw.factor < 0) {
                c.transform((this.offset.x + 223 *this.draw.scale * this.draw.factor) / this.outer.prepped.width, -(0.22), 0, 1 / (this.outer.prepped.height / this.doorHeight), 240 *this.draw.scale, 13 *this.draw.scale);
                or(c);
            }
        };

        this.inner = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/door2.png',
                factor: 6,
            }, this.game),
            position: new Vector2(0, 0),
        });
        this.addChild(this.inner);
        const ir = this.inner.render.bind(this.inner);
        this.inner.render = (c: CanvasRenderingContext2D) => {
            c.save();
            if (this.offset.x + 17 *this.draw.scale * this.draw.factor < 0) {
                c.transform((this.offset.x + 17 *this.draw.scale * this.draw.factor) / this.inner.prepped.width, -(0.22), 0, 1 / (this.inner.prepped.height / this.doorHeight), 17 *this.draw.scale, 14 *this.draw.scale);
                ir(c);
            }
            c.restore();
            c.save();
            if (this.offset.x + 223 *this.draw.scale * this.draw.factor > 0) {
                c.transform((this.offset.x + 223 *this.draw.scale * this.draw.factor) / this.inner.prepped.width, -(0.22), 0, 1 / (this.inner.prepped.height / this.doorHeight), 240 *this.draw.scale, 14 *this.draw.scale);
                ir(c);
            }
            c.restore();
        };
    }
}
