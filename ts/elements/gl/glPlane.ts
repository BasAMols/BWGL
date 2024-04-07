import { GLMeshType } from '../../utils/gl';
import { GLMesh, GlMeshAttributes } from './glMesh';
import { colors } from '../../utils/colors';
import { Vector3 } from '../../utils/vector3';

export type GlPlaneAttributes = GlMeshAttributes & {

};

export class GLPlane extends GLMesh {
    public meshType: GLMeshType = 'plane';
    protected colors: [number, number, number, number][];
    public verticesCount = 6;

    constructor(attr: GlPlaneAttributes = {}) {
        super(attr);
        this.colors = [
            colors.r,
        ];
    }

    protected colorBuffer() {
        var colors: number[] = [];
        this.colors.forEach((f) => {
            colors = colors.concat(f, f, f, f);
        });

        return this.getColorBuffer(colors);
    }

    protected indexBuffer() {
        return this.getIndexBuffer([
            0, 1, 2, 0, 2, 3,
        ]);
    }

    protected positionBuffer(size: Vector3) {
        return this.getPositionBuffer([
            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 1.0, 1.0,
            0.0, 1.0, 1.0,
        ].map((n, i) => n * size.array[i % 3]));
    }


}