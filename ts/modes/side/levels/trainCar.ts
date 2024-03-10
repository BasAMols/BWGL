import { CanvasCustom } from '../../../canvas/canvasCustom';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { Collider } from '../../../utils/collider';
import { Vector2 } from '../../../utils/vector2';
import { NPCOld } from '../npcs/npcOld';
import { NPCWoman } from '../npcs/npcWoman';
import { Train } from './train';
import { TrainDoor } from './trainDoor';


export class TrainCar extends CanvasWrapper {
    public foregsquare: CanvasImage;
    public door: TrainDoor;
    public frame: CanvasImage;
    public interior: CanvasImage;
    public set offset(value: Vector2) {
        this.door.offset = value;
    }
    constructor(public train: Train, x: number, y: number = 100, w: number = 800, h: number = 400) {
        super({
            position: new Vector2(x, y),
            size: new Vector2(w, h),
        });
    }

    build() {

        this.frame = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Frame Back.png',
                factor: this.train.canvasDrawer.scale,
            }, this.game),
            position: new Vector2(0, 0),
        });
        this.addChild(this.frame);

        this.interior = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Interior.png',
                factor: this.train.canvasDrawer.scale,
            }, this.game),
            position: new Vector2(0, 0),
        });
        this.addChild(this.interior);
        this.interior.relativity = 'anchor';


        this.interior.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.train.canvasDrawer.fill(this,[
                    [9, 14],
                    [247, 14],
                    [247, ce + 762 > 0 ? 16 : 8, ce + 762 > 0 ? 1 : 0],
                    [247, 8, 1],
                    [9, 8, 1],
                    [9, ce - 762 <= 0 ? 16 : 8, ce - 762 <= 0 ? 1 : 0],
                    [9, 16],
                ], '#58473f', '#140e14');

                this.train.canvasDrawer.fill(this,[
                    [18, 16],
                    [240, 16],
                    [240, 16, 1],
                    [18, 16, 1],
                ], '#8f563b');

                for (let index = 18; index < 239; index += 4) {
                    this.train.canvasDrawer.line(this, '#662736', 0 + index, 16, 0, 0 + index, 16, 1, 'x');
                    this.train.canvasDrawer.line(this, '#e37332', 1 + index, 16, 0, 1 + index, 16, 1, 'x');
                    if (index % 8 === 2){
                        this.train.canvasDrawer.line(this, '#662736', 0 + index, 16, 0.2, 0 + index, 16, 0.3, 'x', 4);
                    }
                    if (index % 8 === 6){
                        this.train.canvasDrawer.line(this, '#662736', 0 + index, 16, 0.7, 0 + index, 16, 0.8, 'x', 4);
                    }
                }

            }
        }), true);

        this.door = new TrainDoor(this.train.canvasDrawer, this);
        this.interior.addChild(this.door, true);
         
        this.interior.addChild(new CanvasCustom({
            render: (c) => {
                const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

                this.train.canvasDrawer.fill(this, [
                    [8, 61, 0],
                    [248, 61, 0],
                    [248, ce + 762 > 0 ? 61 : 57, ce + 762 > 0 ? 1 : 0],
                    [248, 57,1],
                    [8, 57, 1],
                    [8, ce - 762 <= 0 ? 61 : 57, ce - 762 <= 0 ? 1 : 0],
                    [8, 61, 0],
                ], '#7e6970', '#140e14');

                this.train.canvasDrawer.line(this,'#140e14', 8, 57, 1, 8, 61, 1);
                this.train.canvasDrawer.line(this,'#140e14', 8, 61, 1, 248, 61, 1);
                this.train.canvasDrawer.line(this,'#140e14', 248, 61, 1, 248, 57, 1);
                this.train.canvasDrawer.line(this,'#140e14', 8, 61, 0, 8, 61, 1);
                this.train.canvasDrawer.line(this,'#140e14', 248, 61, 0, 248, 61, 1);

            }
        }), true);

        // this.interior.addChild(new NPCBeard({
        //     position: new Vector2(50*this.train.canvasDrawer.scale,14*this.train.canvasDrawer.scale),
        // }), true);
        this.interior.addChild(new NPCOld({
            position: new Vector2(30*this.train.canvasDrawer.scale,14*this.train.canvasDrawer.scale),
            width: (this.width-(60*this.train.canvasDrawer.scale))
        }), true);
        this.interior.addChild(new NPCWoman({
            position: new Vector2(12*this.train.canvasDrawer.scale,13*this.train.canvasDrawer.scale),
        }), true);
        // this.interior.addChild(new NPCOld({
        //     position: new Vector2(200*this.train.canvasDrawer.scale,14*this.train.canvasDrawer.scale),
        // }), true);


        ([
            [0, 5, 256, 6], //hedgeBottom
            [8, 50, 240, 8], //hedgeBottom
        ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 80]) => {
            this.addChild(new Collider({
                position: new Vector2(x * this.train.canvasDrawer.scale, y * this.train.canvasDrawer.scale),
                size: new Vector2(w * this.train.canvasDrawer.scale, h * this.train.canvasDrawer.scale),
                cornerTolerance: t,
            }));
        });
    }


}