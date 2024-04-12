// import { CanvasColorBackground } from '../../../elements/canvas/canvasBackground';
// import { CanvasGrid } from '../../../elements/canvas/canvasGrid';
// import { Level } from '../../../utils/level';
// import { Vector2 } from '../../../utils/vector2';
// import { RPGCharacter } from '../rpgCharacter';
// import { FlatContoller } from '../flatController';
// import { CameraController } from '../../snakeMode/controllers/cameraController';
// import { CanvasPrepSprites } from '../../../elements/canvas/canvasPrepSprites';
// import { CanvasImage } from '../../../elements/canvas/canvasImage';
// import { PrepImage } from '../../../elements/prepImage';
// import { Collider } from '../../../utils/collider';
// import { DomText } from '../../../elements/dom/domText';

// export class OverworldLevel extends Level {
//     private scale = 6;

//     public start = new Vector2(7 * this.scale * 16, 7 * this.scale * 16);
//     public background = new CanvasColorBackground('#272727');
//     public character: RPGCharacter;
//     public sprites: CanvasPrepSprites;
//     public mo: DomText;

//     constructor() {
//         super({
//             hasDom: true,
//             size: new Vector2(320 * 6, 320 * 6),
//         });

//         this.character = new RPGCharacter({
//             position: this.start,
//             controllers: [new FlatContoller()],
//         });

//         // this.addControllers([new CameraController({ target: this.character })]);

//         this.sprites = new CanvasPrepSprites({
//             jsons: ['/json/overworld/sprites.json'],
//             factor: this.scale,
//             callback: () => {
//                 this.assetsLoaded();
//             }
//         });
//         this.addControllers([this.sprites])
//     }

//     assetsLoaded() {
//         this.addChild(this.background);

//         this.addChild(new CanvasImage({
//             image: new PrepImage({ url: '/img/overworld/terrain.png', factor: this.scale }, this.game),
//         }));

        
//         this.addChild(new CanvasGrid({
//             sprites: this.sprites,
//             json: '/json/overworld/decorations.json',
//             factor: this.scale,
//         }));

//         this.addChild(new CanvasGrid({
//             sprites: this.sprites,
//             json: '/json/overworld/objects.json',
//             factor: this.scale,
//             condition: (entity)=>entity.y >= this.character.y
//         }));

//         this.addChild(this.character);

//         this.addChild(new CanvasGrid({
//             sprites: this.sprites,
//             json: '/json/overworld/objects.json',
//             factor: this.scale,
//             condition: (entity)=>entity.y < this.character.y
//         }));

//         this.addChild(new CanvasGrid({
//             sprites: this.sprites,
//             json: '/json/overworld/overlay.json',
//             factor: this.scale
//         }));

//         (([
//             [20,122,25,28],//doghouse
//             [147,163,173,50],//riverRight
//             [0,163,125,50],//riverLeft
//             [64,120,31,30],//statue
//             [23,260,25,62],//house1
//             [48,282,17,39],//house2
//             [65,260,24,62],//house3
//             [-15,0,30,112,100], //hedgeLeft
//             [305,0,30,112,100], //hedgeRight
//             [0,0,320,14,100], //hedgeBottom
//             [97,272,13,24],
//             [176,112,15,19],
//             [194,103,49,10],
//             [255,103,15,60],
//             [272,113,41,39],
//             [67,20,58,16],
//             [32,37,15,16],
//         ]) as ([number,number,number,number,number?])[]).forEach(([x,y,w,h,t = 30]) => {
//             this.addChild(new Collider({
//                 position: new Vector2(this.scale*x,this.scale*y),
//                 size: new Vector2(this.scale*w,this.scale*h),
//                 cornerTolerance: t,
//             }));
//         });

//         // const [x,y,w,h] = [23,260,25,62];
//         // this.mo = new DomButton({
//         //     position: new Vector2(this.scale*x,this.scale*y),
//         //     size: new Vector2(this.scale*w,this.scale*h),
//         //     background: 'rgba(0, 255,0,0.3)',
//         //     fontSize: 50,
//         //     onClick: () => {
//         //         navigator.clipboard.writeText(this.mo.text)
//         //     },
//         // })
//         // this.mo.dom.style.pointerEvents = 'all';
//         // this.mo.dom.style.userSelect = 'all';
//         // this.addChild(this.mo);
//     }

//     // tick(obj: TickerReturnData): void {
//     //     super.tick(obj);
//     //     if (this.mo){
//     //         this.mo.text = `[${Math.round(this.mo.x/this.scale)},${Math.round(this.mo.y/this.scale)},${Math.round(this.mo.width/this.scale)},${Math.round(this.mo.height/this.scale)}]`;
//     //     }
//     // }
// }