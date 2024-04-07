import { GLMeshType } from '../../utils/gl';
import { GLMesh, GlMeshAttributes } from './glMesh';
import { colors } from '../../utils/colors';
import { Vector3 } from '../../utils/vector3';

export type GlCubeAttributes = GlMeshAttributes & {

};

export class GlCube extends GLMesh {
    meshType: GLMeshType = 'cube';
    verticesCount = 36;

    constructor(attr: GlCubeAttributes = {}) {
        super(attr);
        this.colors = [
            colors.r,
            colors.g,
            colors.b,
            colors.c,
            colors.m,
            colors.y,
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
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ]);
    }

    protected positionBuffer(size: Vector3) {
        return this.getPositionBuffer([
            // Front face
            0.0, 0.0, -1.0,
            1.0, 0.0, -1.0,
            1.0, 1.0, -1.0,
            0.0, 1.0, -1.0,

            // Back fa-ce
            0.0, 0.0, -0.0,
            0.0, 1.0, -0.0,
            1.0, 1.0, -0.0,
            1.0, 0.0, -0.0,

            // Top fac-e
            0.0, 1.0, -0.0,
            0.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, -0.0,

            // Bottom -face
            0.0, 0.0, -0.0,
            1.0, 0.0, -0.0,
            1.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // Right f-ace
            1.0, 0.0, -0.0,
            1.0, 1.0, -0.0,
            1.0, 1.0, -1.0,
            1.0, 0.0, -1.0,

            // Left fa-ce
            0.0, 0.0, -0.0,
            0.0, 0.0, -1.0,
            0.0, 1.0, -1.0,
            0.0, 1.0, -0.0
        ].map((n, i) => n * size.array[(i % 3)]));
    }

}