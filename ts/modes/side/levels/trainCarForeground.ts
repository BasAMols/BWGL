import { CanvasAnimation } from '../../../canvas/canvasAnimation';
import { CanvasCustom } from '../../../canvas/canvasCustom';
import { CanvasImage } from '../../../canvas/canvasImage';
import { CanvasWrapper } from '../../../canvas/canvasWrapper';
import { PrepImage } from '../../../canvas/prepImage';
import { PrepSpritesheet } from '../../../canvas/spritesheet';
import { Character } from '../../../utils/character';
import { Collider } from '../../../utils/collider';
import { ElementRelativity } from '../../../utils/elementPosition';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';
import { TrainCar } from './trainCar';


export class TrainCarForeground extends CanvasWrapper {
    public foreground: CanvasImage;
    public background: CanvasImage;
    public relativity: ElementRelativity = 'anchor';
    public factor = 0.05;
    private car: TrainCar;
    private character: Character;
    private wheels1: CanvasAnimation;
    private wheels2: CanvasAnimation;
    private wheels3: CanvasAnimation;
    private wheels4: CanvasAnimation;
    private wheelFrame: number = 0;
    private frame: CanvasImage;
    constructor(car: TrainCar, character: Character) {
        super({
            position: new Vector2(car.x, car.y - 50),
            size: new Vector2(car.width, car.height),
            relativity: 'anchor',
            zoom: new Vector2(1.05, 1.05),
        });
        this.car = car;
        this.character = character;
    }

    build() {

        // this.y = this.car.y + 50;


        this.wheels1 = new CanvasAnimation({
            animation:  new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: 6,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(24*6, 0),
        });
        this.addChild(this.wheels1);

        this.wheels2 = new CanvasAnimation({
            animation:  new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: 6,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(48*6, 0),
        });
        this.addChild(this.wheels2);
        this.wheels2.frame = 1*20;

        this.wheels3 = new CanvasAnimation({
            animation:  new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: 6,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(192*6, 0),
        });
        this.addChild(this.wheels3);
        this.wheels3.frame = 2*20;

        this.wheels4 = new CanvasAnimation({
            animation:  new PrepSpritesheet({
                url: '/img/train/wheels.png',
                factor: 6,
                size: new Vector2(16, 8),
                repeatX: 4,
                interval: 30,
            }, this.game),
            reverse: true,
            position: new Vector2(216*6, 0),
        });
        this.addChild(this.wheels4);
        this.wheels4.frame = 3*20;
        
        this.frame = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Frane Front.png',
                factor: 6,
            }, this.game),
        });
        this.addChild(this.frame);

        this.foreground = new CanvasImage({
            image: new PrepImage({
                url: '/img/train/Exterior.png',
                factor: 6
            }, this.game),
        });
        this.addChild(this.foreground);

        this.wheelFrame = 25*this.car.x / this.car.width

    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        const f = 200;
        [this.wheels4,this.wheels2,this.wheels3,this.wheels1].forEach((w)=>{
            w.interval = 160 - Math.round(this.car.train.speed/this.car.train.maxSpeed * 120);
        });
        this.wheelFrame = (this.wheelFrame + 1) % 200;
        this.wheels4.y = (this.wheelFrame > 0 && this.wheelFrame < 30)? 1*6 : 0;
        this.wheels3.y = (this.wheelFrame > 20 && this.wheelFrame < 50 )? 1*6 : 0;
        this.wheels2.y = (this.wheelFrame > 0 && this.wheelFrame < 30 )? 1*6 : 0;
        this.wheels1.y = (this.wheelFrame > 20 && this.wheelFrame < 50 )? 1*6 : 0;

        this.frame.y = (this.wheelFrame > 40 && this.wheelFrame < 70)? 1*6/3 : 0;
        this.foreground.y = (this.wheelFrame > 40 && this.wheelFrame < 70)? 1*6/3 : 0;
        this.car.frame.y = (this.wheelFrame > 40 && this.wheelFrame < 70)? 1*6/3 : 0;
        this.car.interior.y = (this.wheelFrame > 40 && this.wheelFrame < 70)? 1*6/3 : 0;
        
        this.x = this.car.x -
            this.car.width *
            (this.factor / 2) + (
                (this.width / 2 + this.x) -
                (this.mode.width / 2 - this.level.x)
            ) * this.factor * 1;
            
        this.car.offset = this.position.subtract(this.car.position);

        if (this.character.y < this.y + this.height) {
            this.foreground.opacity = Util.clamp((Math.abs((this.width / 2 + this.x) - (this.character.width / 2 + this.character.x)) - (this.width / 2 - f)) / f, 0, 1);
        }
        
    }
}