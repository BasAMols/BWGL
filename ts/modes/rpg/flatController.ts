// import { Character } from '../../utils/character';
// import { Collisions } from '../../utils/collisions';
// import { CanvasController } from '../../utils/controller';
// import { TickerReturnData } from '../../utils/ticker';
// import { Util } from '../../utils/utils';
// import { Vector2 } from '../../utils/vector2';

// export class FlatContoller extends CanvasController {
//     private speed = 4;
//     private velocity: Vector2 = Vector2.zero;
//     public parent: Character;

//     public tick(obj: TickerReturnData) {
//         super.tick(obj); 

//         const angle = new Vector2(
//             this.mode.input.right ? 1 : this.mode.input.left ? -1 : 0,
//             this.mode.input.down ? -1 : this.mode.input.up ? 1 : 0
//         );

//         this.velocity.x = Util.to0(this.velocity.x * 0.9, 0.1);
//         this.velocity.y = Util.to0(this.velocity.y * 0.9, 0.1);

//         if (angle.x !== 0 || angle.y !== 0) {
//             this.velocity = this.velocity
//                 .add(Vector2.right.scale(this.speed).rotate(angle.angle()))
//                 .clampMagnitute(this.speed)
//                 .toPrecision(2);
//         }

//         const r = Collisions.check(this.level.colliders, this.parent, this.velocity.scale(obj.interval / 10));

//         if (r.length !== 0) {
//             r.sort(function (a, b) {
//                 return Math.abs(a[1]) - Math.abs(b[1]);
//             });
//             if (r.find((a) => a[0] === "x")) { this.velocity.x = r.find((a) => a[0] === "x")[1] / (obj.interval / 10); }
//             if (r.find((a) => a[0] === "y")) { this.velocity.y = r.find((a) => a[0] === "y")[1] / (obj.interval / 10); }
//         }

//         this.parent.position = Vector2.clamp(
//             this.parent.position.add(this.velocity.scale(obj.interval / 10)),
//             this.level.size.subtract(this.parent.size),
//             Vector2.zero,
//         );
//     }
// }