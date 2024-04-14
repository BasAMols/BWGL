import { DomText } from '../../dom/domText';
import { GLobj as GLObj } from '../../gl/obj';
import { Color } from '../../utils/colors';
import { Level } from '../../utils/level';
import { TickerReturnData } from '../../utils/ticker';
import { Vector2 } from '../../utils/vector2';
import { v3 } from '../../utils/vector3';
import { SideCharacter } from './sideCharacter';
import { Scroller } from './scrolling';
import { GlMesh as GLMesh } from '../../gl/mesh';



export class World extends Level {
    public start = Vector2.zero;
    public background: Color = [0.27451,0.203922,0.368627,1];
    public character: SideCharacter;
    public mo: DomText;
    public env: Scroller;
    // public get speed(): number {
    //     if (this.inTrain) {
    //         return this.train.speed;
    //     } else {
    //         return 0;
    //     }
    // }
    // private _inTrain: boolean = false;
    // public get inTrain(): boolean {
    //     return this._inTrain;
    // }
    // public set inTrain(value: boolean) {
    //     this._inTrain = value;
    //     this.character.active = !value;
    //     this.train.character.active = value;
    //     this.train.x = 0;
    //     this.backgroundLayer.x = this.foregroundLayer.x = 0;
    //     if (value) {
    //         this.train.character.x = Util.clamp(this.character.x, this.train.left, this.train.right - 1);
    //     } else {
    //         this.character.position = this.train.character.position;
    //     }
    // }
    // public env: Scroller;
    // public frame: number = 0;
    // public backgroundLayer: CanvasWrapper;
    // public foregroundLayer: CanvasWrapper;
    // public characterLayer: CanvasComposite;
    // // public station: Station;
    // public trainLayer: CanvasWrapper;
    // public train: Train;
    constructor() {
        super({
            size: v3(900, 200, 400)
        });
    }

    keyDown(e: KeyboardEvent): void {
        // if (e.code === 'Enter') {
        //     this.inTrain = !this.inTrain;
        // }
    }


    build() {
        super.build();
        this.addChild(new SideCharacter({
            size: v3(8, 24, 8),
            position: v3(0, 0, 250)
        }));

        // this.addChild(new GlMesh({ size3: v3(176, 65, 0), position3: v3(256 + 83 + 50 + 256, 0, 600), colors: [Colors.k], textureUrl: 'test.png' }));
        // this.addChild(new GlMesh({ size3: v3(-5000, -1000, -5000), position3: v3(2500, 999, 2500), colors: [[0.15, 0.15, 1.0, 1], [0.15, 0.15, 1.0, 1], [0.1, 0.1, 0.1, 1], [0.15, 0.15, 1.0, 1], [0.15, 0.15, 1.0, 1], [0.15, 0.15, 1.0, 1]] }));
        this.addChild(new GLMesh({ size: v3(10000, 1, 4000), position: v3(-5000, -1, -2000), colors: [[0.15, 0.15, 1.0, 1], [0.15, 0.15, 1.0, 1], [0.05, 0.05, 0.05, 1], [0.15, 0.15, 1.0, 1], [0.15, 0.15, 1.0, 1], [0.15, 0.15, 1.0, 1]] }));
        this.addChild(new GLMesh({ size: v3(10000, 4, 52), position: v3(-5000, 0, 300), colors: [[0.15, 0.15, 0.15, 1], [0.1, 0.1, 0.1, 1], [0.15, 0.15, 0.15, 1], [0.1, 0.1, 0.1, 1], [0.1, 0.1, 0.1, 1], [0.1, 0.1, 0.1, 1]] }));
        this.addChild(new GLObj({ url: 'carriage.obj', size: v3(1, 1, 1), position: v3(-512, 4, 300) }));
        this.addChild(new GLObj({ url: 'carriage.obj', size: v3(1, 1, 1), position: v3(-256, 4, 300) }));
        this.addChild(new GLObj({ url: 'carriage.obj', size: v3(1, 1, 1), position: v3(4, 4, 300) }));
        this.addChild(new GLObj({ url: 'carriage.obj', size: v3(1, 1, 1), position: v3(256, 4, 300) }));
        this.addChild(new GLObj({ url: 'coal.obj', size: v3(1, 1, 1), position: v3(513, 4, 302) }));
        this.addChild(new GLObj({ url: 'loco.obj', size: v3(1, 1, 1), position: v3(595, 4, 300) }));
        this.addChild(new GLObj({ url: 'GearPump3.obj', size: v3(10, 10, 10), position: v3(-1500, 60, 0) }));
        // this.addChild(new GLObj({ url: 'village.obj', size: v3(10, 10, 10), rotation: v3(0,-0.5,0), position: v3(200, 0, 400) }));
        this.addChild(new GLObj({ url: 'farm.obj', size: v3(30, 30, 30), position: v3(-1500, 0, 700) }));
        this.addChild(new GLObj({ url: 'subway.obj', size: v3(25, 25, 25), position: v3(-1500, 0,328), rotation: v3(0,Math.PI/2,0) }));

        // this.start = new Vector2((256 * 6) * 1.5, 15 * 6 + 90);
        // this.backgroundLayer = new CanvasWrapper();
        // this.trainLayer = new CanvasWrapper();
        // this.foregroundLayer = new CanvasWrapper();
        // this.characterLayer = new CanvasComposite({}, (c)=>{
        //     c.globalCompositeOperation = 'source-atop';
        //     c.fillStyle = 'rgba(23, 21, 11, 0.5)';
        //     c.fillRect(0, 0, this.level.width, this.level.height);
        //     c.globalCompositeOperation = 'source-over';
        // });
        this.env = new Scroller();
        // this.addChild(this.background);
        this.addChild(this.env);
        // this.addChild(this.backgroundLayer);
        // this.addChild(this.trainLayer);
        // this.addChild(this.foregroundLayer);
        // this.addChild(this.characterLayer);
        // this.train = new Train();
        // this.trainLayer.addChild(this.train);
        // this.station = new Station(this.train, this.backgroundLayer, this.foregroundLayer);
        // this.addChild(this.station);
        // this.character = new SideCharacter({
        //     position: this.start,
        //     controllers: [new SideContoller()],
        // });
        // this.character.active = false
        // this.characterLayer.addChild(this.character);
        // (([
        //     [0, 0, this.width, 75],
        // ]) as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
        //     this.addChild(new Collider({
        //         position: new Vector2(x, y),
        //         size: new Vector2(w, h),
        //         condition: () => !this.inTrain
        //     }));
        // });
        // this.inTrain = false;
        // this.train.x = 10;
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);
        // this.camera.target[0] = (this.camera.target[0]+1)%this.width
        // this.camera.rotation.y = (this.t.frame/360%Math.PI*2)
        // if (this.inTrain) {
        //     this.backgroundLayer.x = this.foregroundLayer.x = this.backgroundLayer.x - (this.train.speed*10);
        // } else {
        //     this.train.x = this.train.x + (this.train.speed*10);
        //     if (this.train.x > this.width){
        //         this.train.x = -this.train.right;
        //     }
        // }
        // this.speed = 1 / obj.frameRate * 144;
        // this.frame = (this.frame + 1) % (3000 * Math.PI);
        // this.speed = +(Math.sin(this.frame / 3000) * this.maxSpeed) * (1 / obj.frameRate);
    }
}
