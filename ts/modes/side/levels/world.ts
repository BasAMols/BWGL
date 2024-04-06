import { CanvasColorBackground } from '../../../elements/canvas/canvasBackground';
import { CanvasComposite } from '../../../elements/canvas/canvasComposite';
import { CanvasImage } from '../../../elements/canvas/canvasImage';
import { CanvasPrepSprites } from '../../../elements/canvas/canvasPrepSprites';
import { CanvasWrapper } from '../../../elements/canvas/canvasWrapper';
import { DomText } from '../../../elements/dom/domText';
import { Collider } from '../../../utils/collider';
import { Level } from '../../../utils/level';
import { TickerReturnData } from '../../../utils/ticker';
import { Util } from '../../../utils/utils';
import { Vector2 } from '../../../utils/vector2';
import { SideCharacter } from '../character/SideCharacter';
import { SideContoller } from '../character/SideController';
import { Scroller } from './scrolling';
import { Station } from './station';
import { Train } from './train';


export class World extends Level {
    public start = Vector2.zero;
    public background = new CanvasColorBackground('#46345E');
    public character: SideCharacter;
    public sprites: CanvasPrepSprites;
    public mo: DomText;
    public ground: CanvasImage;
    public get speed(): number {
        if (this.inTrain) {
            return this.train.speed;
        } else {
            return 0
        }
    }

    private _inTrain: boolean = false;
    public get inTrain(): boolean {
        return this._inTrain;
    }
    public set inTrain(value: boolean) {
        this._inTrain = value;
        this.character.active = !value;
        this.train.character.active = value;
        this.train.x = 0;
        this.backgroundLayer.x = this.foregroundLayer.x = 0;
        if (value){
            this.train.character.x = Util.clamp(this.character.x, this.train.left, this.train.right-1);
        } else {
            this.character.position = this.train.character.position;
        }
    }

    public env: Scroller;
    public frame: number = 0;
    public backgroundLayer: CanvasWrapper;
    public foregroundLayer: CanvasWrapper;
    public characterLayer: CanvasComposite;
    public station: Station;
    public trainLayer: CanvasWrapper;
    public train: Train;

    constructor() {
        super({
            size: new Vector2((256 * 6) * 5, 1200),
        });
    }

    keyDown(e: KeyboardEvent): void {
        if (e.code === 'Enter') {
            this.inTrain = !this.inTrain;
        }
    }
    

    build() {
        this.start = new Vector2((256 * 6) * 1.5, 15 * 6 + 90);

        this.backgroundLayer = new CanvasWrapper();
        this.trainLayer = new CanvasWrapper();
        this.foregroundLayer = new CanvasWrapper();
        this.characterLayer = new CanvasComposite({}, (c)=>{
            c.globalCompositeOperation = 'source-atop';
            c.fillStyle = 'rgba(23, 21, 11, 0.5)';
            c.fillRect(0, 0, this.level.width, this.level.height);
            c.globalCompositeOperation = 'source-over';
        });
        this.env = new Scroller();

        
        this.addChild(this.background);
        this.addChild(this.env);
        this.addChild(this.backgroundLayer);
        this.addChild(this.trainLayer);
        this.addChild(this.foregroundLayer);
        this.addChild(this.characterLayer);

        this.train = new Train();
        this.trainLayer.addChild(this.train);

        this.station = new Station(this.train, this.backgroundLayer, this.foregroundLayer);
        this.addChild(this.station);
        
        this.character = new SideCharacter({
            position: this.start,
            controllers: [new SideContoller()],
        });
        this.character.active = false
        this.characterLayer.addChild(this.character);

       
        (([
            [0, 0, this.width, 75],
            
        ]) as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
            this.addChild(new Collider({
                position: new Vector2(x, y),
                size: new Vector2(w, h),
                condition: () => !this.inTrain
            }));
        });
        

        this.inTrain = false;
        this.train.x = -this.train.right*2;
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        if (this.inTrain) {
            this.backgroundLayer.x = this.foregroundLayer.x = this.backgroundLayer.x - (this.train.speed*10);
        } else {
            this.train.x = this.train.x + (this.train.speed*10);
            if (this.train.x > this.width){
                this.train.x = -this.train.right;
            }
        }
        // this.speed = 1 / obj.frameRate * 144;
        // this.frame = (this.frame + 1) % (3000 * Math.PI);
        // this.speed = +(Math.sin(this.frame / 3000) * this.maxSpeed) * (1 / obj.frameRate);
    }
}