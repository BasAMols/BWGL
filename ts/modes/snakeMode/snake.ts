// import { CanvasCircle } from '../../elements/canvas/canvasCircle';
// import { CanvasController } from '../../utils/controller';
// import { TickerReturnData } from '../../utils/ticker';
// import { Vector2 } from '../../utils/vector2';
// import { Eye } from './parts/eye';
// import { Tail } from './parts/tail';

// export type SnakeColors = 'rainbow' | 'dark' | 'green';
// export class Snake extends Tail {
//     public eye1: CanvasCircle;
//     public eye2: CanvasCircle;
//     private faceSize: number;

//     constructor({
//         position = Vector2.zero,
//         totals = 10,
//         distance = 10,
//         topRadius = 120,
//         bottomRadius = 5,
//         colors = 'rainbow',
//         controllers = []
//     }: {
//         position?: Vector2;
//         totals?: number;
//         distance?: number;
//         topRadius?: number;
//         bottomRadius?: number;
//         colors?: SnakeColors;
//         controllers?: CanvasController[];
//     } = {}) {

//         super({ number: 0, distance, total: totals, controllers, topRadius: topRadius + 25, bottomRadius });
//         this.faceSize = topRadius;
//         this.position = position;
//         this.colors = colors;
//     }

//     build() {
//         this.moving = true;
//         this.visible = true;
//         this.radius = this.faceSize * 1.2;
//         this.radiusY = this.faceSize;
//         this.strokeWidth = this.faceSize*0.05;
//         this.setcolor();

//         for (let index = 0; index < this.total; index++) {
//             this.add(this.total);
//         }

//         this.addChild(new Eye(new Vector2(-this.faceSize * 0.62, -this.faceSize * 0.4), this.faceSize * 0.6), true);
//         this.addChild(new Eye(new Vector2(this.faceSize * 0.62, -this.faceSize * 0.4), this.faceSize * 0.6), true);

//     }

//     public tick(obj: TickerReturnData) {
//         super.tick(obj);

//         if (this.next) {
//             this.next.follow(this.position.clone());
//         }
//     }

//     public setcolor() {
//         if (this.colors === 'rainbow') {
//             this.colorType = 'linearGradient';
//             this.linearGradient = {
//                 stops: [
//                     [0.0, 'rgba(255,0,0,1)'],
//                     [0.1, 'rgba(255,154,0,1)'],
//                     [0.2, 'rgba(208,222,33,1)'],
//                     [0.3, 'rgba(79,220,74,1)'],
//                     [0.4, 'rgba(63,218,216,1)'],
//                     [0.5, 'rgba(47,201,226,1)'],
//                     [0.6, 'rgba(28,127,238,1)'],
//                     [0.7, 'rgba(95,21,242,1)'],
//                     [0.8, 'rgba(186,12,248,1)'],
//                     [0.9, 'rgba(251,7,217,1)'],
//                     [1.0, 'rgba(255,0,0,1)'],
//                 ],
//                 angle: 0,
//             };

//         } else if (this.colors === 'dark') {
//             this.colorType = 'radialGradient';
//             this.radialGradient = {
//                 stops: [
//                     [0.0, 'rgba(255,0,0,1)'],
//                     [0.1, 'rgba(255,154,0,1)'],
//                     [0.2, 'rgba(208,222,33,1)'],
//                     [0.3, 'rgba(79,220,74,1)'],
//                     [0.4, 'rgba(63,218,216,1)'],
//                     [0.5, 'rgba(47,201,226,1)'],
//                     [0.6, 'rgba(28,127,238,1)'],
//                     [0.7, 'rgba(95,21,242,1)'],
//                     [0.8, 'rgba(186,12,248,1)'],
//                     [0.9, 'rgba(251,7,217,1)'],
//                     [1.0, 'rgba(255,0,0,1)'],
//                 ],
//             };
           
//         } else if (this.colors === 'green') {
//             this.colorType = 'radialGradient';
//             this.radialGradient = {
//                 stops: [
//                     [0, `hsla(140,100%,20%,${100}%)`],
//                     [1, `hsla(140,45%,40%,${100}%)`],
//                 ],
//             };
//         }
//     }
// }
