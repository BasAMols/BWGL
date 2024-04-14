// import { CanvasController } from '../../../utils/controller';
// import { TickerReturnData } from '../../../utils/ticker';
// import { Vector2 } from '../../../utils/vector2';

// export class mouseController extends CanvasController {
//     private speed = new Vector2(6, 6);
//     private direction = Vector2.right;
//     public target: Vector2;

//     constructor(direction: Vector2 = Vector2.up) {
//         super();
//         this.direction = direction;
//     }

//     public tick(obj: TickerReturnData) {
//         super.tick(obj);

//         if (this.target) {
//             const d = this.target.subtract(this.parent.position).angle()+ Math.PI - this.direction.angle();
            
//             if (d > Math.PI || d < 0){
//                 this.direction = this.direction.rotate(Math.PI/120);
//             } else {
//                 this.direction = this.direction.rotate(-Math.PI/120);
//             }
//             this.parent.position = this.parent.position.add(this.direction.multiply(this.speed).scale(obj.interval / 10));
//         }
//     }

//     mouseMove(e: MouseEvent){
//         super.mouseMove(e);
//         this.target = new Vector2(e.clientX, e.clientY);
//     }
// }