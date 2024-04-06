// import { TickerReturnData } from '../../utils/ticker';
// import { GlElement, GlElementAttributes, GlElementType } from './glElement';

// export type GlCameraAttributes = GlElementAttributes & {
//     target?: BABYLON.Vector3,
// };

// export class GLCamera extends GlElement {
//     public type: GlElementType = 'camera';
//     public node: BABYLON.UniversalCamera;
//     private _cameraTarget: BABYLON.Vector3;
//     public get cameraTarget(): BABYLON.Vector3 {
//         return this._cameraTarget;
//     }
//     public set cameraTarget(value: BABYLON.Vector3) {
//         this._cameraTarget = value;
//         this.node.setTarget(value);
//     }

//     constructor(attr: GlCameraAttributes = {}) {
//         super(attr);
//         this._cameraTarget = attr.target || BABYLON.Vector3.Zero();
//     }

//     public build(): void {
//     }

//     public tick(obj: TickerReturnData) {
//         super.tick(obj);
//         this.node.rotation.y = this.node.rotation.y+0.001
//     }

//     public render(c: WebGLRenderingContext): void {
//         // console.log('ss');
//     }
// }