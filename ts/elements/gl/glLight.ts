import { TickerReturnData } from '../../utils/ticker';
import { GlElement, GlElementAttributes, GlElementType } from './glElement';

export type GlLightAttributes = GlElementAttributes & {
};

export class GLLight extends GlElement {
    public type: GlElementType = 'light';

    constructor(attr: GlLightAttributes = {}) {
        super(attr);
    }

    public build(): void {
        // this.node = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0),this.scene)
        // this.node.intensity = 0.7;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
    }

    public render(c: WebGLRenderingContext): void {
        // console.log('ss');
    }
}