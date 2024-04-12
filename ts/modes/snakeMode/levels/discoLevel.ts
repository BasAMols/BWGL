// import { Vector2 } from "../../../utils/vector2";
// import { Level } from "../../../utils/level";
// import { CanvasRadialGradientBackground } from '../../../elements/canvas/canvasRadialGradientBackground';
// import { Snake } from '../snake';
// import { RandomController } from '../controllers/randomController';
// import { FlatContoller } from '../../rpg/flatController';
// import { DomButton } from '../../../elements/dom/domButton';

// export class DiscoLevel extends Level {
//     public start = new Vector2(300, 400);
//     public background = new CanvasRadialGradientBackground({
//         stops: [[0, 'red'], [1, 'blue']],
//     });
    
//     constructor() {
//         super({hasDom: true});
//         this.size = new Vector2(1145, 2000)
//     }

//     build() {
//         this.game.getEvent('resize').subscribe(String(Math.random()), (size: Vector2) => {
//             this.size = size;
//         });
//         this.addChild(this.background);

//         this.dom.appendChild(new DomButton({
//             text: 'ADD',
//             fontSize: 39,
//             fontWeight: 1000,
//             color: 'black',
//             position: new Vector2(5, 120),
//             size: new Vector2(70, 50),
//             background: 'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)',
//             fontFamily: 'monospace',
//             padding: [0, 10, 0, 10],
//             onClick: () => {
//                 this.addSnake();
//             }
//         }));

//         this.addChild(new Snake({
//             totals: 30,
//             distance: 1,
//             topRadius: 50,
//             bottomRadius: 1,
//             colors: 'rainbow',
//             position: new Vector2(150, 200),
//             controllers: [new FlatContoller()]
//         }));

//         this.addSnake();
//     }

//     public addSnake() {

//         const topSize = 15 + Math.random() * 170;
//         const bottomSize = 2

//         this.addChild(new Snake({
//             totals: Math.ceil(Math.random() * 40 + 10),
//             distance: Math.ceil(topSize/17),
//             topRadius: topSize,
//             bottomRadius: bottomSize,
//             position: new Vector2(-topSize, -topSize),
//             colors: Math.random() < 0.2? 'green': 'rainbow',
//             controllers: [new RandomController(topSize, 3 + (185 - topSize)/17, Vector2.right)]
//         }));


//     }
// }