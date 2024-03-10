import { CanvasColorBackground } from '../../../canvas/canvasBackground';
import { CanvasElement } from '../../../canvas/canvasElement';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasPrepSprites } from '../../../canvas/canvasPrepSprites';
import { DomText } from '../../../dom/domText';
import { Collider } from '../../../utils/collider';
import { Level } from '../../../utils/level';
import { TickerReturnData } from '../../../utils/ticker';
import { Vector2 } from '../../../utils/vector2';
import { SideCharacter } from '../character/SideCharacter';
import { SideContoller } from '../character/SideController';
import { Locomotive } from './locomotive';
import { CanvasDrawer } from './perspectiveDrawer';
import { Scroller } from './scrolling';
import { TrainCar } from './trainCar';
import { TrainCarForeground } from './trainCarForeground';


export class Train extends Level {
    public start = Vector2.zero;
    public background = new CanvasColorBackground('#46345E');
    public character: SideCharacter;
    public sprites: CanvasPrepSprites;
    public mo: DomText;
    public trainCars: TrainCar[] = [];
    public ground: CanvasImage;
    public speed: number = 0;
    public maxSpeed: number = 10;
    public env: Scroller;
    public frame: number = 0;
    public canvasDrawer: CanvasDrawer;

    constructor() {
        super({
            hasDom: true,
            size: new Vector2((256 * 6) * 6, 1200),
        });
    }

    perpective(z: number, target: CanvasElement){
        this.game.ctx.scale(1 + (this.canvasDrawer.factor * z), 1 + (this.canvasDrawer.factor * z));
        this.game.ctx.translate((-target.width * (this.canvasDrawer.factor / 2)) * z, 0);
        this.game.ctx.translate(
            (((target.width / 2 + target.x) - (this.mode.width / 2 - this.level.x)) * this.canvasDrawer.factor) * z,
            -50 * z
        );
    }

    build() {
        this.canvasDrawer = new CanvasDrawer(this.game.ctx, this.perpective.bind(this));

        this.start = new Vector2((256 * this.canvasDrawer.scale) * 1.5, 12* this.canvasDrawer.scale + 90);

        this.trainCars.push(new TrainCar(this,(256 * this.canvasDrawer.scale) * 1, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
        this.trainCars.push(new TrainCar(this,(256 * this.canvasDrawer.scale) * 2, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
        this.trainCars.push(new TrainCar(this,(256 * this.canvasDrawer.scale) * 3, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
        // this.trainCars.push(new TrainCar(this,(256 * this.canvasDrawer.scale) * 4, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));
        // this.trainCars.push(new TrainCar(this,(256 * this.canvasDrawer.scale) * 5, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale));

        this.character = new SideCharacter({
            position: this.start,
            controllers: [new SideContoller()],
        });


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

        const loco = new Locomotive(this.canvasDrawer, (256 * this.canvasDrawer.scale) * 4, 90, 256 * this.canvasDrawer.scale, 64 * this.canvasDrawer.scale);
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