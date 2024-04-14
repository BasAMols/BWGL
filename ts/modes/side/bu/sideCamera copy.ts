// import { TickerReturnData } from '../../../utils/ticker';
// import { GlController } from '../../../utils/glController';
// import { Character } from '../../../utils/character';
// import { GlElementType } from '../../../utils/gl';

// export class CameraController extends GlController {
//     public type: GlElementType = 'controller';

//     constructor(public target: Character){
//         super();
//     }

//     public tick(o: TickerReturnData) {
//         super.tick(o);
//         this.camera.target = this.target.position3.clone().add(this.target.size3.multiply(0.5,0.5,0.5)).multiply(1,-1,1);
//     }
// }