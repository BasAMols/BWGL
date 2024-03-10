import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { Vector2 } from '../../../utils/vector2';

export class TrainDoor extends CanvasWrapper {
    public offset: Vector2;
    public factor = 0.05;
    public doorHeight = 45 * 6;
    public outer: CanvasImage;
    public inner: CanvasImage;

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
            if (this.offset.x + 17 * 6 * this.factor > 0) {
                c.save();
                c.transform((this.offset.x + 17 * 6 * this.factor) / this.outer.prepped.width, -(0.22), 0, 1 / (this.outer.prepped.height / this.doorHeight), 17 * 6, 13 * 6);
                or(c);
                c.restore();
            }
            if (this.offset.x + 223 * 6 * this.factor < 0) {
                c.save();
                c.transform((this.offset.x + 223 * 6 * this.factor) / this.outer.prepped.width, -(0.22), 0, 1 / (this.outer.prepped.height / this.doorHeight), 240 * 6, 13 * 6);
                or(c);
                c.restore();
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
            if (this.offset.x + 17 * 6 * this.factor < 0) {
                c.save();
                c.transform((this.offset.x + 17 * 6 * this.factor) / this.inner.prepped.width, -(0.22), 0, 1 / (this.inner.prepped.height / this.doorHeight), 17 * 6, 14 * 6);
                ir(c);
                c.restore();
            }
            if (this.offset.x + 223 * 6 * this.factor > 0) {
                c.save();
                c.transform((this.offset.x + 223 * 6 * this.factor) / this.inner.prepped.width, -(0.22), 0, 1 / (this.inner.prepped.height / this.doorHeight), 240 * 6, 14 * 6);
                ir(c);
                c.restore();
            }
        };


    }
}
