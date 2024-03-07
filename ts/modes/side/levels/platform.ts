import { CanvasColorBackground } from '../../../canvas/canvasBackground';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasPrepSprites } from '../../../canvas/canvasPrepSprites';
import { DomText } from '../../../dom/domText';
import { Collider } from '../../../utils/collider';
import { Collisions } from '../../../utils/collisions';
import { Level } from '../../../utils/level';
import { Vector2 } from '../../../utils/vector2';
import { CameraController } from '../../snakeMode/controllers/cameraController';
import { SideCharacter } from '../character/SideCharacter';
import { SideContoller } from '../character/SideController';
import { Scroller } from './scrolling';
import { TrainCar } from './trainCar';


export class PlatformLevel extends Level {
    public start = new Vector2(2000,150);
    public background = new CanvasColorBackground('#46345E');
    public character: SideCharacter;
    public sprites: CanvasPrepSprites;
    public mo: DomText;
    public trainCars:TrainCar[] = []
    public ground: CanvasImage;

    constructor() {
        super({
            hasDom: true,
            size: new Vector2((256*5)*4, 1200),
        });

        this.trainCars.push(new TrainCar((256*5)*1, 35, 256*5, 64*5));
        this.trainCars.push(new TrainCar((256*5)*2, 35, 256*5, 64*5));

        this.character = new SideCharacter({
            position: this.start,
            controllers: [new SideContoller()],
        });

        this.addControllers([new CameraController({ target: this.character })]);
    }
    build() {
        this.addChild(this.background);
        this.addChild(new Scroller());

        this.trainCars.forEach(trainCar => {
            this.addChild(trainCar);
            trainCar.foreground.condition = (bP, bS) => !Collisions.overlap(bP, bS, this.character.position, this.character.size );
        });

        this.addChild(this.character);

        (([
            [0,0,this.width,35],
        ]) as ([number,number,number,number,number?])[]).forEach(([x,y,w,h,t = 30]) => {
            this.addChild(new Collider({
                position: new Vector2(x,y),
                size: new Vector2(w,h),
            }));
        });

    }

    // public tick(obj: TickerReturnData): void {
    //     super.tick(obj);
    //     this.ground.x = (this.ground.x - this.trainSpeed) % this.ground.prepped.width;
    //     if (Collisions.overlap(Vector2.zero, new Vector2(this.width, 90), this.character.position, this.character.size)){
    //         this.character.x -= this.trainSpeed;
    //     }
    // }
}