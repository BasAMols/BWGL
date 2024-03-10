import { CanvasAnimation } from '../../../canvas/canvasAnimation';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepSpritesheet } from '../../../canvas/spritesheet';
import { Collider } from '../../../utils/collider';
import { ElementRelativity } from '../../../utils/elementPosition';
import { Vector2 } from '../../../utils/vector2';
import { CanvasDrawer } from './perspectiveDrawer';


export class Locomotive extends CanvasWrapper {
    public background: CanvasAnimation;
    public relativity: ElementRelativity = 'anchor';
    constructor(public draw: CanvasDrawer, x: number, y: number = 100, w: number = 800, h: number = 400) {
        super({
            position: new Vector2(x, y),
            size: new Vector2(w, h),
        });
    }

    build() {

        this.background = new CanvasAnimation({
            animation: new PrepSpritesheet({
                url: '/img/train/sheet_train_v18.png',
                factor: 6,
                size: new Vector2(256, 64),
                repeatX: 16,
                interval: 20,
            }, this.game),
            position: new Vector2(0, 0),
        });

        const r = this.background.postRender.bind(this.background);
        this.background.postRender = (c) => {
            c.save();
            r(c);
            this.draw.perspectiveSwitchFunction(1, this);
            r(c);
            c.restore();
        };

        this.addChild(this.background);

        ([
            [0, 5, 256, 6], //hedgeBottom
        ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
            this.addChild(new Collider({
                position: new Vector2(x * 6, y * 6),
                size: new Vector2(w * 6, h * 6),
                cornerTolerance: t,
            }));
        });


    }
}