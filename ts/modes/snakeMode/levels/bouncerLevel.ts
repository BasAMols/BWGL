// import { CanvasColorBackground } from '../../../elements/canvas/canvasBackground';
// import { Vector2 } from "../../../utils/vector2";
// import { Level } from "../../../utils/level";
// import { Snake } from '../snake';
// import { BouncyController } from '../controllers/bouncyController';

// export class BouncerLevel extends Level {
//     public start = new Vector2(300, 400)
//     public background = new CanvasColorBackground('black')

//     constructor() {
//         super();
//         this.size = new Vector2(1145, 2000)
//     }

//     build(){
//         this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
//             this.size = size;
//         });
//         this.addChild(this.background);
//         this.addChild(new Snake({ position: this.start, totals: 50, distance: 6, colors: 'rainbow', controllers: [new BouncyController(120)] }));
//     }

// }
