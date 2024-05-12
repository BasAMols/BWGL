// import { CanvasAnimation } from '../../../elements/canvas/canvasAnimation';
// import { CanvasComposite } from '../../../elements/canvas/canvasComposite';
// import { CanvasCustom } from '../../../elements/canvas/canvasCustom';
// import { CanvasImage } from '../../../elements/canvas/canvasImage';
// import { CanvasWrapper } from '../../../elements/canvas/canvasWrapper';
// import { GlCube } from '../../../elements/gl/glCube';
// import { PrepImage } from '../../../elements/prepImage';
// import { PrepSpritesheet } from '../../../elements/spritesheet';
// import { Character } from '../../../utils/character';
// import { Collider } from '../../../utils/collider';
// import { TickerReturnData } from '../../../utils/ticker';
// import { Util } from '../../../utils/utils';
// import { Vector2 } from '../../../utils/vector2';
// import { v3 } from '../../../utils/vector3';
// import { NPCOld } from '../npcs/npcOld';
// import { NPCWoman } from '../npcs/npcWoman';
// import { CanvasDrawer } from './perspectiveDrawer';
// import { Train } from './train';
// import { World } from './world';

import { GLGroup } from '../../gl/group';
import { GLobj } from '../../gl/obj';
import { Collider } from '../../utils/collider';
import { Vector3, v3 } from '../../utils/vector3';


export class TrainCar extends GLGroup {
    public build(): void {
        super.build();
        this.addChild(new GLobj({ url: 'carriage.obj', size: v3(1, 1, 1)}));
        const floor = new Collider({size: v3(16,4,16), direction: Vector3.up, showMesh: true });
        this.addChild(floor);
        console.log(floor.absolutePosition.vec);
        

    }
}


// export class TrainCar extends CanvasWrapper {
//     public level: World;
//     public backgroundWrap: CanvasComposite;
//     public frame: CanvasImage;
//     public interior: CanvasImage;

//     public foregroundWrap: CanvasComposite;
//     private wheels1: CanvasAnimation;
//     private wheels2: CanvasAnimation;
//     private wheels3: CanvasAnimation;
//     private wheels4: CanvasAnimation;
//     private animationFrame: number = 0;
//     private foregroundFrame: CanvasImage;
//     private siding: CanvasImage;
//     bdraw: CanvasDrawer;
//     fdraw: CanvasDrawer;
//     public object3: GlCube;

//     constructor(public train: Train, public background: CanvasWrapper, public characterLayer: CanvasWrapper, public foreground: CanvasWrapper, public draw: CanvasDrawer, public count: number, public character: Character) {
//         super({
//             position: new Vector2(256 * draw.scale * count, 15 * draw.scale),
//             size: new Vector2(256 * draw.scale, 64 * draw.scale),
//         });
//     }

//     build() {

//         this.backgroundWrap = new CanvasComposite({
//             position: new Vector2(256 * this.draw.scale * this.count, 15 * this.draw.scale),
//             size: new Vector2(256 * this.draw.scale, 64 * this.draw.scale),
//         }, (c) => {
//             c.globalCompositeOperation = 'source-atop';
//             c.fillStyle = 'rgba(23, 21, 11, 0.5)';
//             c.fillRect(0, 0, this.level.width, this.level.height);
//             c.globalCompositeOperation = 'source-over';
//         });
//         this.background.addChild(this.backgroundWrap, true);
//         this.bdraw = new CanvasDrawer(this.backgroundWrap.ctx, this.draw.perspectiveSwitchFunction.bind(this.train));
//         this.buildBackground();

//         this.foregroundWrap = new CanvasComposite({
//             position: new Vector2(256 * this.draw.scale * this.count, 15 * this.draw.scale - 50),
//             size: new Vector2(256 * this.draw.scale, 64 * this.draw.scale),
//             relativity: 'anchor',
//             zoom: new Vector2(this.draw.factor + 1, this.draw.factor + 1),
//         }, (c) => {
//             c.globalCompositeOperation = 'source-atop';
//             c.fillStyle = 'rgba(23, 21, 11, 0.5)';
//             c.fillRect(0, 0, this.level.width, this.level.height);
//             c.globalCompositeOperation = 'source-over';
//         });
//         this.foreground.addChild(this.foregroundWrap, true);
//         // this.foregroundWrap.visible = false
//         this.fdraw = new CanvasDrawer(this.foregroundWrap.ctx, this.draw.perspectiveSwitchFunction.bind(this.train));
//         this.buildForeground();

//     }

//     buildBackground() {
//         this.addChild(new GlCube({ size3: v3(256,64,32), position3: v3(0,0,0) }));

//         this.characterLayer.addChild(new NPCOld({
//             position: new Vector2(30 * this.bdraw.scale, 14 * this.bdraw.scale).add(this.position),
//             width: (this.width - (60 * this.bdraw.scale))
//         }));
//         this.characterLayer.addChild(new NPCWoman({
//             position: new Vector2(14 * this.bdraw.scale, 13 * this.bdraw.scale).add(this.position),
//         }));

//         this.frame = new CanvasImage({
//             image: new PrepImage({
//                 url: '/img/train/Frame Back.png',
//                 factor: this.bdraw.scale,
//             }, this.game),
//         });
//         this.backgroundWrap.addChild(this.frame);


//         this.backgroundWrap.addChild(new CanvasCustom({
//             relativity: 'anchor',
//             position: new Vector2(0, 0),
//             render: (c) => {
//                 const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

//                 this.bdraw.fill(this.foregroundWrap, [
//                     [9, 61, 0],
//                     [11, 61, 0],
//                     [11, 62, 0],
//                     [16, 62, 0],
//                     [16, 63, 0],
//                     [240, 63, 0],
//                     [240, 62, 0],
//                     [245, 62, 0],
//                     [245, 61, 0],
//                     [248, 61, 0],
//                     [248, 61, 1],
//                     [9, 61, 1],
//                 ], '#ffffff');

//                 // this.bdraw.lineSequence(this.foregroundWrap, '#222034', [
//                 //     [9, 61, 1],
//                 //     [12, 61, 1],
//                 //     [12, 62, 1],
//                 //     [17, 62, 1],
//                 //     [17, 63, 1],
//                 //     [240, 63, 1],
//                 //     [240, 62, 1],
//                 //     [245, 62, 1],
//                 //     [245, 61, 1],
//                 //     [248, 61, 1],
//                 // ], 'y');

//                 this.bdraw.fill(this.backgroundWrap, [
//                     [9, 14],
//                     [247, 14],
//                     [247, ce + 762 > 0 ? 16 : 8, ce + 762 > 0 ? 1 : 0],
//                     [247, 8, 1],
//                     [9, 8, 1],
//                     [9, ce - 762 <= 0 ? 16 : 8, ce - 762 <= 0 ? 1 : 0],
//                     [9, 16],
//                 ], '#5d5d5d', '#381c45');

//                 if (ce + 762 < 0) {

//                     // Door outer right
//                     this.bdraw.fill(this.backgroundWrap, [
//                         [240, 16, 0],
//                         [240, 57, 0],
//                         [240, 57, 0.25],
//                         [240, 16, 0.25],
//                     ], '#f3b65a');
//                 }
//                 if (ce - 762 >= 0) {

//                     // Door outer left
//                     this.bdraw.fill(this.backgroundWrap, [
//                         [16, 16, 0],
//                         [16, 57, 0],
//                         [16, 57, 0.25],
//                         [16, 16, 0.25],
//                     ], '#f3b65a');
//                 }


//             }
//         }));

//         this.interior = new CanvasImage({
//             image: new PrepImage({
//                 url: '/img/train/Interior.png',
//                 factor: this.bdraw.scale,
//             }, this.game),
//         });
//         this.backgroundWrap.addChild(this.interior, true);
//         this.interior.relativity = 'anchor';

//         this.interior.addChild(new CanvasCustom({
//             render: (c) => {
//                 const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

//                 this.bdraw.fill(this.backgroundWrap, [
//                     [16, 16],
//                     [240, 16],
//                     [240, 16, 1],
//                     [16, 16, 1],
//                 ], '#8f563b');

//                 for (let index = 16; index < 239; index += 4) {
//                     this.bdraw.line(this.backgroundWrap, '#662736', 0 + index, 16, 0, 0 + index, 16, 1, 'x');
//                     this.bdraw.line(this.backgroundWrap, '#e37332', 1 + index, 16, 0, 1 + index, 16, 1, 'x');
//                     if (index % 8 === 0) {
//                         this.bdraw.line(this.backgroundWrap, '#662736', 0 + index, 16, 0.2, 0 + index, 16, 0.3, 'x', 4);
//                     }
//                     if (index % 8 === 4) {
//                         this.bdraw.line(this.backgroundWrap, '#662736', 0 + index, 16, 0.5, 0 + index, 16, 0.6, 'x', 4);
//                     }
//                 }

//                 if (ce + 762 > 0) {
//                     // Door inner right
//                     this.bdraw.fill(this.backgroundWrap, [
//                         [239, 16, 0],
//                         [239, 57, 0],
//                         [239, 57, 0.25],
//                         [239, 16, 0.25],
//                     ], '#8f563b');
//                 }
//                 if (ce - 762 < 0) {
//                     // Door inner left
//                     this.bdraw.fill(this.backgroundWrap, [
//                         [17, 16, 0],
//                         [17, 57, 0],
//                         [17, 57, 0.25],
//                         [17, 16, 0.25],
//                     ], '#8f563b');
//                 }
//             }
//         }), true);


//         ([
//             [0, 5, 256, 6],
//             [13, 50, 230, 10],
//         ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 80]) => {
//             this.backgroundWrap.addChild(new Collider({
//                 position: new Vector2(x * this.bdraw.scale, y * this.bdraw.scale),
//                 size: new Vector2(w * this.bdraw.scale, h * this.bdraw.scale),
//                 cornerTolerance: t,
//                 condition: () => this.level.inTrain
//             }));
//         });


//     }

//     buildForeground() {

//         // this.y = this.y + 50;
//         this.wheels1 = new CanvasAnimation({
//             animation: new PrepSpritesheet({
//                 url: '/img/train/wheels.png',
//                 factor: this.fdraw.scale,
//                 size: new Vector2(16, 8),
//                 repeatX: 4,
//                 frameRate: 2,
//             }, this.game),
//             reverse: true,
//             position: new Vector2(24 * this.fdraw.scale, 0),
//         });
//         this.foregroundWrap.addChild(this.wheels1);

//         this.wheels2 = new CanvasAnimation({
//             animation: new PrepSpritesheet({
//                 url: '/img/train/wheels.png',
//                 factor: this.fdraw.scale,
//                 size: new Vector2(16, 8),
//                 repeatX: 4,
//                 frameRate: 2,
//             }, this.game),
//             reverse: true,
//             position: new Vector2(48 * this.fdraw.scale, 0),
//         });
//         this.foregroundWrap.addChild(this.wheels2);
//         this.wheels2.frame = 20;

//         this.wheels3 = new CanvasAnimation({
//             animation: new PrepSpritesheet({
//                 url: '/img/train/wheels.png',
//                 factor: this.fdraw.scale,
//                 size: new Vector2(16, 8),
//                 repeatX: 4,
//                 frameRate: 2,
//             }, this.game),
//             reverse: true,
//             position: new Vector2(192 * this.fdraw.scale, 0),
//         });
//         this.foregroundWrap.addChild(this.wheels3);
//         this.wheels3.frame = 2 * 20;

//         this.wheels4 = new CanvasAnimation({
//             animation: new PrepSpritesheet({
//                 url: '/img/train/wheels.png',
//                 factor: this.fdraw.scale,
//                 size: new Vector2(16, 8),
//                 repeatX: 4,
//                 frameRate: 2,
//             }, this.game),
//             reverse: true,
//             position: new Vector2(216 * this.fdraw.scale, 0),
//         });
//         this.foregroundWrap.addChild(this.wheels4);
//         this.wheels4.frame = 3 * 20;


//         this.foregroundWrap.addChild(new CanvasCustom({
//             render: (c) => {
//                 const ce = ((this.width / 2 + this.x) - (this.mode.width / 2 - this.level.x));

//                 if (ce + 762 > 0) {
//                     // Door inner right
//                     this.fdraw.fill(this.foregroundWrap, [
//                         [239, 16, 0],
//                         [239, 57, 0],
//                         [239, 57, -0.75],
//                         [239, 50, -0.75],
//                         [239, 50, -0.25],
//                         [239, 57, -0.25],
//                         [239, 16, -0.25],
//                     ], '#8f563b');
//                 } else {
//                     // Door outer right
//                     this.fdraw.fill(this.foregroundWrap, [
//                         [240, 16, 0],
//                         [240, 57, 0],
//                         [240, 57, -0.75],
//                         [240, 50, -0.75],
//                         [240, 50, -0.25],
//                         [240, 57, -0.25],
//                         [240, 16, -0.25],
//                     ], '#f3b65a');
//                 }
//                 if (ce - 762 < 0) {
//                     // Door inner left
//                     this.fdraw.fill(this.foregroundWrap, [
//                         [17, 16, 0],
//                         [17, 57, 0],
//                         [17, 57, -0.75],
//                         [17, 50, -0.75],
//                         [17, 50, -0.25],
//                         [17, 57, -0.25],
//                         [17, 16, -0.25],
//                     ], '#8f563b');
//                 } else {
//                     // Door outer left
//                     this.fdraw.fill(this.foregroundWrap, [
//                         [16, 16, 0],
//                         [16, 57, 0],
//                         [16, 57, -0.75],
//                         [16, 50, -0.75],
//                         [16, 50, -0.25],
//                         [16, 57, -0.25],
//                         [16, 16, -0.25],
//                     ], '#f3b65a');
//                 }


//                 // this.fdraw.fill(this.foregroundWrap, [
//                 //     [9, 61, -1],
//                 //     [11, 61, -1],
//                 //     [11, 62, -1],
//                 //     [16, 62, -1],
//                 //     [16, 63, -1],
//                 //     [240, 63, -1],
//                 //     [240, 62, -1],
//                 //     [245, 62, -1],
//                 //     [245, 61, -1],
//                 //     [248, 61, -1],
//                 //     [248, 61, 0],
//                 //     [9, 61, 0],
//                 // ], '#ffffff');

//                 this.fdraw.fill(this.foregroundWrap, [
//                     [9, 57, 0],
//                     [9, 61, 0],
//                     [248, 61, 0],
//                     [248, 57, 0],
//                 ], '#cbdbfc');

//                 if (ce + 762 < 0) {
//                     this.fdraw.fill(this.foregroundWrap, [
//                         [248, 61, -1],
//                         [248, 57, -1],
//                         [248, 57, 0],
//                         [248, 61, 0],
//                     ], '#cbdbfc');
//                 }

//                 if (ce - 762 > 0) {
//                     this.fdraw.fill(this.foregroundWrap, [
//                         [9, 61, -1],
//                         [9, 57, -1],
//                         [9, 57, 0],
//                         [9, 61, 0],
//                     ], '#cbdbfc');
//                 }

//                 this.fdraw.lineSequence(this.foregroundWrap, '#222034', [
//                     [9, 61, 0],
//                     [12, 61, 0],
//                     [12, 62, 0],
//                     [17, 62, 0],
//                     [17, 63, 0],
//                     [240, 63, 0],
//                     [240, 62, 0],
//                     [245, 62, 0],
//                     [245, 61, 0],
//                     [248, 61, 0],
//                 ], 'y');

//             }
//         }));

//         this.foregroundFrame = new CanvasImage({
//             image: new PrepImage({
//                 url: '/img/train/Frane Front.png',
//                 factor: this.fdraw.scale,
//             }, this.game),
//         });
//         this.foregroundWrap.addChild(this.foregroundFrame);

//         this.siding = new CanvasImage({
//             image: new PrepImage({
//                 url: '/img/train/Exterior.png',
//                 factor: this.fdraw.scale,
//             }, this.game),
//         });
//         this.foregroundWrap.addChild(this.siding);

//         this.animationFrame = 50 * this.count;
//     }

//     perspectiveTick(obj: TickerReturnData) {
//         this.foregroundWrap.x = this.backgroundWrap.x - ((this.level.center.x - (this.train.x + (this.x + this.backgroundWrap.x) / 2)) * this.draw.factor);
//     }

//     public tick(obj: TickerReturnData): void {
//         super.tick(obj);
//         this.perspectiveTick(obj);
//         this.versionTick(obj);
//     }

//     public versionTick(obj: TickerReturnData) {

//         const f = 200;
//         [this.wheels4, this.wheels2, this.wheels3, this.wheels1].forEach((w) => {
//             w.frameRate = Math.round(this.train.speed * 9);
//             w.playing = Boolean(this.train.speed);
//         });
//         this.animationFrame = (this.animationFrame + this.train.speed) % 200;
//         this.wheels4.y = (this.animationFrame > 0 && this.animationFrame < 30) ? this.draw.scale : 0;
//         this.wheels3.y = (this.animationFrame > 20 && this.animationFrame < 50) ? this.draw.scale : 0;
//         this.wheels2.y = (this.animationFrame > 0 && this.animationFrame < 30) ? this.draw.scale : 0;
//         this.wheels1.y = (this.animationFrame > 20 && this.animationFrame < 50) ? this.draw.scale : 0;

//         this.foregroundWrap.y = ((this.animationFrame > 40 && this.animationFrame < 70) ? this.draw.scale / 3 : 0) + 50;
//         this.frame.y = (this.animationFrame > 40 && this.animationFrame < 70) ? this.draw.scale / 3 : 0;
//         this.interior.y = (this.animationFrame > 40 && this.animationFrame < 70) ? this.draw.scale / 3 : 0;

//         if (this.character.active && this.character.y < this.y + this.height - 60) {
//             this.siding.opacity = Util.clamp((Math.abs((this.width / 2 + this.x) - (this.character.width / 2 + this.character.x)) - (this.width / 2 - f)) / f, 0, 1);
//         } else {
//             this.siding.opacity = 1;
//         }
//     }
// }