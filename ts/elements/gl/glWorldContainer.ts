import { GlCube, GlCubeAttributes } from './glCube';

export type GLContainerAttributes = GlCubeAttributes & {

};

export class GLContainer extends GlCube {
    constructor(attr: GLContainerAttributes = {}) {
        super(attr);
        this.colors = [
            [1, 0.2, 0.2, 0],
            [0.4, 0.4, 0.4, 1],
            [0.3, 0.3, 0.3, 1],
            [0.3, 0.3, 0.3, 1],
            [0.2, 0.2, 0.2, 1],
            [0.2, 0.2, 0.2, 1],
        ];
    }
}