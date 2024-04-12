// import { CanvasComposite } from '../../../elements/canvas/canvasComposite';
// import { CanvasElement } from '../../../elements/canvas/canvasElement';
// import { CanvasPrepSprites } from '../../../elements/canvas/canvasPrepSprites';
// import { CanvasWrapper } from '../../../elements/canvas/canvasWrapper';
// import { Collider } from '../../../utils/collider';
// import { TickerReturnData } from '../../../utils/ticker';
// import { Vector2 } from '../../../utils/vector2';
// import { SideCharacter } from '../character/SideCharacter';
// import { Locomotive } from './locomotive';
// import { CanvasDrawer } from './perspectiveDrawer';
// import { Station } from './station';
// import { TrainCar } from './trainCar';
// import { World } from './world';


// export class Train extends CanvasWrapper {
//     public level: World;
//     public start = Vector2.zero;
//     public character: SideCharacter;
//     public sprites: CanvasPrepSprites;
//     public speed: number = 1;
//     public inputSpeed: number = 1;
//     public frame: number = 0;
//     public canvasDrawer: CanvasDrawer;
//     backgroundLayer: CanvasWrapper;
//     foregroundLayer: CanvasWrapper;
//     characterLayer: CanvasComposite;
//     public cars: TrainCar[] = [];
//     station: Station;
//     carWidth: number;
//     left: number;
//     right: number;

//     constructor() {
//         super({
//             size: new Vector2((256 * 6) * 2, 1200),
//         });
//         this.carWidth = (256 * 6);
//         this.left = 0.5*this.carWidth;
//         this.right = this.left + this.carWidth*2 ;
//     }

//     keyDown(e: KeyboardEvent) {
//         if (e.key === '1') {
//             this.inputSpeed = 0;
//         }
//         if (e.key === '2') {
//             this.inputSpeed = 0.1;
//         }
//         if (e.key === '3') {
//             this.inputSpeed = 0.2;
//         }
//         if (e.key === '4') {
//             this.inputSpeed = 0.3;
//         }
//         if (e.key === '5') {
//             this.inputSpeed = 0.4;
//         }
//         if (e.key === '6') {
//             this.inputSpeed = 0.5;
//         }
//         if (e.key === '7') {
//             this.inputSpeed = 0.6;
//         }
//         if (e.key === '8') {
//             this.inputSpeed = 0.7;
//         }
//         if (e.key === '9') {
//             this.inputSpeed = 0.8;
//         }
//         if (e.key === '0') {
//             this.inputSpeed = 0.9;
//         }
       
//     }

//     perpective(z: number, target: CanvasElement, c: CanvasRenderingContext2D = this.game.ctx) {
//         c.scale(1 + (this.canvasDrawer.factor * z), 1 + (this.canvasDrawer.factor * z));
//         c.translate((-target.width * (this.canvasDrawer.factor / 2)) * z, 0);
//         c.translate(
//             (((target.width / 2 + target.x + this.x) - this.level.center.x) * this.canvasDrawer.factor) * z,
//             (-50) * z
//         );
//     }

//     build() {
//         this.canvasDrawer = new CanvasDrawer(this.game.ctx, this.perpective.bind(this));
//         this.start = new Vector2((256 * this.canvasDrawer.scale) * 1.5, 12 * this.canvasDrawer.scale + 90);
//         this.backgroundLayer = new CanvasWrapper();
//         // this.character.active = false;
//         this.characterLayer = new CanvasComposite({}, (c) => {
//             c.globalCompositeOperation = 'source-atop';
//             c.fillStyle = 'rgba(23, 21, 11, 0.5)';

//             this.cars.forEach(car => {
//                 c.fillRect(car.x + 0, car.y + 0, 16 * this.canvasDrawer.scale, car.height);
//                 c.fillRect(car.x + 240 * this.canvasDrawer.scale, car.y + 0, 16 * this.canvasDrawer.scale, car.height);
//                 c.fillRect(car.x + 16 * this.canvasDrawer.scale, car.y + 57 * this.canvasDrawer.scale, car.width - 16 * this.canvasDrawer.scale * 2, car.height - 57 * this.canvasDrawer.scale);
//                 c.fillRect(car.x + 16 * this.canvasDrawer.scale, car.y + 0, car.width - 16 * this.canvasDrawer.scale * 2, 8 * this.canvasDrawer.scale);
//             });
//             c.fillRect(0, this.cars[0].y + this.cars[0].height, this.level.width, this.level.height - (this.cars[0].y + this.cars[0].height));
//             c.fillRect(0, 0, this.cars[0].x, this.cars[0].y + this.cars[0].height);
//             c.fillRect(this.cars[0].x + this.cars[0].width * this.cars.length, 0, this.level.width - (this.cars[0].x + this.cars[0].width * this.cars.length), this.cars[0].y + this.cars[0].height);

//         });

//         this.foregroundLayer = new CanvasWrapper();

//         this.addChild(this.backgroundLayer);
//         this.addChild(this.characterLayer);
//         this.addChild(this.foregroundLayer);

//         for (let index = 0.5; index < 2; index++) {
//             const car = new TrainCar(this, this.backgroundLayer, this.characterLayer, this.foregroundLayer, this.canvasDrawer, index, this.character);
//             this.cars.push(car);
//             this.addChild(car);
//         }
//         this.addChild(new Locomotive(this, this.backgroundLayer, this.characterLayer, this.foregroundLayer, this.canvasDrawer, 2.5, this.character));
//         this.characterLayer.addChild(this.character);

//         (([
//             [0, 0, this.width, 35],
//             [0, 0, this.left, this.height],
//             [this.right, 0, this.level.width - this.right, this.height],

//         ]) as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
//             this.addChild(new Collider({
//                 position: new Vector2(x, y),
//                 size: new Vector2(w, h),
//                 condition: () => this.level.inTrain
//             }));
//         });
//     }

//     public tick(obj: TickerReturnData): void {
//         super.tick(obj);
//         // this.speed = 1 / obj.frameRate * 144 * this.inputSpeed/2;
//         // this.frame = (this.frame + 1) % (200 * Math.PI);
//     }
// }