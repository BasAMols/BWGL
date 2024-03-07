import { CanvasAnimation } from '../../../canvas/canvasAnimation';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasSquare } from '../../../canvas/canvasSquare';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { PrepSpritesheet } from '../../../canvas/spritesheet';
import { Collider } from '../../../utils/collider';
import { Vector2 } from '../../../utils/vector2';


export class TrainCar extends CanvasWrapper {
    public foreground: CanvasImage;
    public background: CanvasAnimation;
    constructor(x: number, y: number = 100, w: number = 800, h: number = 400) {
        super({
            position: new Vector2(x, y),
            size: new Vector2(w, h),
        });
    }

    build() {

        this.background = new CanvasAnimation({
            position: Vector2.zero,
            animation:  new PrepSpritesheet({
                url: '/img/train/sheet_carriage_v18.png',
                factor: 5,
                size: new Vector2(256, 64),
                repeatX: 16,
                interval: 20
            }, this.game)
        });
        this.addChild(this.background);

        this.foreground = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/carriage_v18_car1.png',
                factor: 5
            }, this.game),
        });
        // this.addChild(this.foreground);

        ([
            [0, 8, 256, 7], //hedgeBottom
            [16, 48, 4, 8], //hedgeBottom
            [236, 48, 4, 8], //hedgeBottom
            [4, 56, 248, 8], //hedgeBottom
        ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
            this.addChild(new Collider({
                position: new Vector2(x * 5, y * 5),
                size: new Vector2(w * 5, h * 5),
                cornerTolerance: t,
            }));
            // this.addChild(new CanvasSquare({
            //     color: '#ff0000aa',
            //     position: new Vector2(x*6,y*6),
            //     size: new Vector2(w*6,h*6),
            // }))
        });

        this.addChild(this.foreground);

    }
}