import { CanvasColorBackground } from '../../../canvas/canvasBackground';
import { CanvasElement } from '../../../canvas/canvasElement';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasPrepSprites } from '../../../canvas/canvasPrepSprites';
import { DomText } from '../../../dom/domText';
import { Collider } from '../../../utils/collider';
import { Collisions } from '../../../utils/collisions';
import { Level } from '../../../utils/level';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';
import { CameraController } from '../../snakeMode/controllers/cameraController';
import { SideCharacter } from '../character/SideCharacter';
import { SideContoller } from '../character/SideController';
import { Locomotive } from './locomotive';
import { Scroller } from './scrolling';
import { TrainCar } from './trainCar';
import { TrainCarForeground } from './trainCarForeground';


export class Train extends Level {
    public start = new Vector2((256 * 6) * 2
        , 250);
    public background = new CanvasColorBackground('#46345E');
    public character: SideCharacter;
    public sprites: CanvasPrepSprites;
    public mo: DomText;
    public trainCars: TrainCar[] = [];
    public ground: CanvasImage;
    public speed: number = 0;
    public maxSpeed: number = 10;
    public env: Scroller;
    frame: number = 0;

    constructor() {
        super({
            hasDom: true,
            size: new Vector2((256 * 8) * 8, 1200),
        });

        this.trainCars.push(new TrainCar(this,(256 * 6) * 1, 90, 256 * 6, 64 * 6, 7));
        this.trainCars.push(new TrainCar(this,(256 * 6) * 2, 90, 256 * 6, 64 * 6, 5));
        this.trainCars.push(new TrainCar(this,(256 * 6) * 3, 90, 256 * 6, 64 * 6, 2));
        this.trainCars.push(new TrainCar(this,(256 * 6) * 4, 90, 256 * 6, 64 * 6, 0));
        this.trainCars.push(new TrainCar(this,(256 * 6) * 5, 90, 256 * 6, 64 * 6, 0));

        this.character = new SideCharacter({
            position: this.start,
            controllers: [new SideContoller()],
        });

        this.addControllers([new CameraController({ target: this.character })]);
    }

    build() {
        this.addChild(this.background);
        this.env = new Scroller()
        this.addChild(this.env);

        this.trainCars.forEach(trainCar => {
            this.addChild(trainCar);
        });

        this.addChild(this.character);

        this.trainCars.forEach(trainCar => {
            this.addChild(new TrainCarForeground(trainCar, this.character));
        });

        const loco = new Locomotive((256 * 6) * 6, 90, 256 * 6, 64 * 6);
        this.addChild(loco);

        (([
            [0, 0, this.width, 35],
        ]) as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
            this.addChild(new Collider({
                position: new Vector2(x, y),
                size: new Vector2(w, h),
            }));
        });

    }


    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.frame = (this.frame+1)%(3000*Math.PI);
        this.speed = +(Math.sin(this.frame / 3000) * this.maxSpeed).toPrecision(2);
        this.env.speed = this.speed;
    }
}