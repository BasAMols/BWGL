// import { CanvasAnimation } from '../../../elements/canvas/canvasAnimation';
// import { PrepSpritesheet } from '../../../elements/spritesheet';
// import { Collider } from '../../../utils/collider';
// import { TickerReturnData } from '../../../utils/ticker';
// import { Vector2 } from '../../../utils/vector2';
// import { TrainCar } from './trainCar';


// export class Locomotive extends TrainCar {
//     public backgroundAnimation1: CanvasAnimation;
//     public backgroundAnimation2: CanvasAnimation;

//     override build(): void {
//         super.build();
//         ([
//             [0, 5, 256, 6], //hedgeBottom
//         ] as ([number, number, number, number, number?])[]).forEach(([x, y, w, h, t = 30]) => {
//             this.addChild(new Collider({
//                 position: new Vector2(x * 6, y * 6),
//                 size: new Vector2(w * 6, h * 6),
//                 cornerTolerance: t,
//                 condition: () => this.level.inTrain
//             }));
//         });
//     }

//     override buildBackground() {

//         this.backgroundAnimation1 = new CanvasAnimation({
//             animation: new PrepSpritesheet({
//                 url: '/img/train/sheet_train_v18.png',
//                 factor: 6,
//                 size: new Vector2(256, 64),
//                 repeatX: 16,
//                 frameRate: 20,
//             }, this.game),
//             position: new Vector2(0, 0),
//         });

//         this.backgroundWrap.addChild(this.backgroundAnimation1);

//     }

//     override buildForeground() {

//         this.backgroundAnimation2 = new CanvasAnimation({
//             animation: new PrepSpritesheet({
//                 url: '/img/train/sheet_train_v18.png',
//                 factor: 6,
//                 size: new Vector2(256, 64),
//                 repeatX: 16,
//                 frameRate: 20,
//             }, this.game),
//             position: new Vector2(0, 0),
//         });

//         this.foregroundWrap.addChild(this.backgroundAnimation2);

//     }


//     public override tick(obj: TickerReturnData): void {
//         super.tick(obj);
//         this.backgroundAnimation1.playing = Boolean(this.train.speed);
//         this.backgroundAnimation2.playing = Boolean(this.train.speed);
        
//         this.backgroundAnimation1.frameRate = this.backgroundAnimation2.frameRate = 2 + (this.train.speed * 18);
//         this.backgroundAnimation2.frameRate = this.backgroundAnimation2.frameRate = 2 + (this.train.speed * 18);

//     }

//     public override versionTick(obj: TickerReturnData): void {
//         //
//     }
// }