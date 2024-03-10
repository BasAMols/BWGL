import { CanvasAnimation } from '../../../canvas/canvasAnimation';
import { CanvasCustom } from '../../../canvas/canvasCustom';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { PrepSpritesheet } from '../../../canvas/spritesheet';
import { Character } from '../../../utils/character';
import { Collider } from '../../../utils/collider';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';
import { NPCOld } from '../npcs/npcOld';
import { NPCWoman } from '../npcs/npcWoman';
import { CanvasDrawer } from './perspectiveDrawer';
import { Train } from './train';
import { TrainDoor } from './trainDoor';


export class TrainCar extends CanvasWrapper {
    public backgroundWrap: CanvasWrapper;
    public door: TrainDoor;
    public frame: CanvasImage;
    public interior: CanvasImage;

    public foregroundWrap: CanvasWrapper;
    private wheels1: CanvasAnimation;
    private wheels2: CanvasAnimation;
    private wheels3: CanvasAnimation;
    private wheels4: CanvasAnimation;
    private wheelFrame: number = 0;
    private foregroundFrame: CanvasImage;
    private siding: CanvasImage;
    public set offset(value: Vector2) {
        this.door.offset = value;
    }
    constructor(public train: Train, public background: CanvasWrapper, public foreground: CanvasWrapper, public draw: CanvasDrawer, public count: number, public character: Character) {
        super({
            position: new Vector2(256 * draw.scale * count, 15 * draw.scale),
            size: new Vector2(256 * draw.scale, 64 * draw.scale),
        });
    }

    build() {
        this.buildBackground();
        this.buildForeground();
    }

    buildBackground() {

        this.backgroundWrap = new CanvasWrapper({
            position: new Vector2(256 * this.draw.scale * this.count, 15 * this.draw.scale),
            size: new Vector2(256 * this.draw.scale, 64 * this.draw.scale),
        });
        this.background.addChild(this.backgroundWrap, true);

        this.frame = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Frame Back.png',
                factor: this.draw.scale,
            }, this.game),
        });
        this.backgroundWrap.addChild(this.frame);

        this.interior = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Interior.png',
                factor: this.draw.scale,
            }, this.game),
        });
        this.backgroundWrap.addChild(this.interior);
        this.interior.relativity = 'anchor';

        this.interior.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.draw.fill(this.backgroundWrap, [
                    [9, 14],
                    [247, 14],
                    [247, ce + 762 > 0 ? 16 : 8, ce + 762 > 0 ? 1 : 0],
                    [247, 8, 1],
                    [9, 8, 1],
                    [9, ce - 762 <= 0 ? 16 : 8, ce - 762 <= 0 ? 1 : 0],
                    [9, 16],
                ], '#58473f', '#140e14');

                this.draw.fill(this.backgroundWrap, [
                    [18, 16],
                    [240, 16],
                    [240, 16, 1],
                    [18, 16, 1],
                ], '#8f563b');

                for (let index = 18; index < 239; index += 4) {
                    this.draw.line(this.backgroundWrap, '#662736', 0 + index, 16, 0, 0 + index, 16, 1, 'x');
                    this.draw.line(this.backgroundWrap, '#e37332', 1 + index, 16, 0, 1 + index, 16, 1, 'x');
                    if (index % 8 === 2) {
                        this.draw.line(this.backgroundWrap, '#662736', 0 + index, 16, 0.2, 0 + index, 16, 0.3, 'x', 4);
                    }
                    if (index % 8 === 6) {
                        this.draw.line(this.backgroundWrap, '#662736', 0 + index, 16, 0.7, 0 + index, 16, 0.8, 'x', 4);
                    }
                }

            }
        }), true);

        this.door = new TrainDoor(this.draw, this);
        this.interior.addChild(this.door, true);

        this.interior.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.draw.fill(this.backgroundWrap, [
                    [8, 61, 0],
                    [248, 61, 0],
                    [248, ce + 762 > 0 ? 61 : 57, ce + 762 > 0 ? 1 : 0],
                    [248, 57, 1],
                    [8, 57, 1],
                    [8, ce - 762 <= 0 ? 61 : 57, ce - 762 <= 0 ? 1 : 0],
                    [8, 61, 0],
                ], '#7e6970', '#140e14');

                this.draw.line(this.backgroundWrap, '#140e14', 8, 57, 1, 8, 61, 1);
                this.draw.line(this.backgroundWrap, '#140e14', 8, 61, 1, 248, 61, 1);
                this.draw.line(this.backgroundWrap, '#140e14', 248, 61, 1, 248, 57, 1);
                this.draw.line(this.backgroundWrap, '#140e14', 8, 61, 0, 8, 61, 1);
                this.draw.line(this.backgroundWrap, '#140e14', 248, 61, 0, 248, 61, 1);

            }
        }), true);

        // this.interior.addChild(new NPCBeard({
        //     position: new Vector2(50*this.draw.scale,14*this.draw.scale),
        // }), true);
        this.interior.addChild(new NPCOld({
            position: new Vector2(30 * this.draw.scale, 14 * this.draw.scale),
            width: (this.width - (60 * this.draw.scale))
        }), true);
        this.interior.addChild(new NPCWoman({
            position: new Vector2(12 * this.draw.scale, 13 * this.draw.scale),
        }), true);
        // this.interior.addChild(new NPCOld({
        //     position: new Vector2(200*this.draw.scale,14*this.draw.scale),
        // }), true);


        ([
            [0, 5, 256, 6], //hedgeBottom
            [8, 50, 240, 8], //hedgeBottom
        ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 80]) => {
            this.backgroundWrap.addChild(new Collider({
                position: new Vector2(x * this.draw.scale, y * this.draw.scale),
                size: new Vector2(w * this.draw.scale, h * this.draw.scale),
                cornerTolerance: t,
            }));
        });
    }

    buildForeground() {

        this.foregroundWrap = new CanvasWrapper({
            position: new Vector2(256 * this.draw.scale * this.count, 15 * this.draw.scale - 50),
            size: new Vector2(256 * this.draw.scale, 64 * this.draw.scale),
            relativity: 'anchor',
            zoom: new Vector2(this.draw.factor+1, this.draw.factor+1),
        });
        this.foreground.addChild(this.foregroundWrap, true);

        // this.y = this.y + 50;
        this.wheels1 = new CanvasAnimation({
            animation: new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: this.draw.scale,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(24 * this.draw.scale, 0),
        });
        this.foregroundWrap.addChild(this.wheels1);

        this.wheels2 = new CanvasAnimation({
            animation: new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: this.draw.scale,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(48 * this.draw.scale, 0),
        });
        this.foregroundWrap.addChild(this.wheels2);
        this.wheels2.frame = 20;

        this.wheels3 = new CanvasAnimation({
            animation: new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: this.draw.scale,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(192 * this.draw.scale, 0),
        });
        this.foregroundWrap.addChild(this.wheels3);
        this.wheels3.frame = 2 * 20;

        this.wheels4 = new CanvasAnimation({
            animation: new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: this.draw.scale,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(216 * this.draw.scale, 0),
        });
        this.foregroundWrap.addChild(this.wheels4);
        this.wheels4.frame = 3 * 20;

        this.foregroundFrame = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Frane Front.png',
                factor: this.draw.scale,
            }, this.game),
        });
        this.foregroundWrap.addChild(this.foregroundFrame);

        this.siding = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Exterior.png',
                factor: this.draw.scale,
            }, this.game),
        });
        this.foregroundWrap.addChild(this.siding);

        this.wheelFrame = 50 * this.count;
    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        const f = 200;
        [this.wheels4, this.wheels2, this.wheels3, this.wheels1].forEach((w) => {
            w.interval = 160 - Math.round(this.train.speed / this.train.maxSpeed * 120);
        });
        this.wheelFrame = (this.wheelFrame + 1) % 200;
        this.wheels4.y = (this.wheelFrame > 0 && this.wheelFrame < 30) ? this.draw.scale : 0;
        this.wheels3.y = (this.wheelFrame > 20 && this.wheelFrame < 50) ? this.draw.scale : 0;
        this.wheels2.y = (this.wheelFrame > 0 && this.wheelFrame < 30) ? this.draw.scale : 0;
        this.wheels1.y = (this.wheelFrame > 20 && this.wheelFrame < 50) ? this.draw.scale : 0;

        this.foregroundFrame.y = (this.wheelFrame > 40 && this.wheelFrame < 70) ? this.draw.scale / 3 : 0;
        this.siding.y = (this.wheelFrame > 40 && this.wheelFrame < 70) ? this.draw.scale / 3 : 0;
        this.frame.y = (this.wheelFrame > 40 && this.wheelFrame < 70) ? this.draw.scale / 3 : 0;
        this.interior.y = (this.wheelFrame > 40 && this.wheelFrame < 70) ? this.draw.scale / 3 : 0;

        this.foregroundWrap.x = this.backgroundWrap.x -
            this.backgroundWrap.width *
            (this.draw.factor / 2) + (
                (this.width / 2 + this.x) -
                (this.mode.width / 2 - this.level.x)
            ) * this.draw.factor;

        this.offset = this.foregroundWrap.position.subtract(this.backgroundWrap.position);

        if (this.character.y < this.y + this.height-60) {
            this.siding.opacity = Util.clamp((Math.abs((this.width / 2 + this.x) - (this.character.width / 2 + this.character.x)) - (this.width / 2 - f)) / f, 0, 1);
        }

    }
}