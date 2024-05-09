import { GlElementType } from './glRenderer';
import { Color, Colors } from '../utils/colors';
import { Vector3 } from '../utils/vector3';
import { GLRendable, GLRendableAttributes } from './rendable';
import { GLTexture } from './texture';

export type GlMeshAttributes = GLRendableAttributes & {
    colors?: [Color, Color?, Color?, Color?, Color?, Color?],
    textureUrl?: string,
    size: Vector3;
};

export type bufferData = {
    index: number[],
    position: number[],
    normal: number[],
    texture: number[],
};

export class GlMesh extends GLRendable {
    public texture: GLTexture;
    public type: GlElementType = 'mesh';
    public colors: [number, number, number, number][] = [];
    public verticesCount = 36;
    public dimensions = 0 | 1 | 2 | 3;
    public textureUrl: string;
    private faceCount: number;

    constructor(attr: GlMeshAttributes) {
        super(attr);
        this.dimensions = attr.size.array.filter((v) => v !== 0).length;
        if (this.dimensions < 2) {
            return;
        }
        this.verticesCount = this.dimensions === 3 ? 36 : 6;
        this.faceCount = this.dimensions === 3 ? 6 : 1;
        this.textureUrl = attr.textureUrl;

        if (attr.colors) this.colors = attr.colors;
        else this.colors = [
            Colors.r,
            Colors.g,
            Colors.b,
            Colors.c,
            Colors.m,
            Colors.y
        ].slice(0, this.faceCount);


    }

    public build(): void {
        super.build();
        this.texture = new GLTexture(this.game, this.textureUrl ? { url: this.textureUrl } : { color: this.colors });
    }

    protected indexBuffer() {
        let b: number[] = this.getBufferData().index.slice(0, this.faceCount * 6);
        return b;
    }

    protected positionBuffer(size: Vector3) {
        return GlMesh.scale(
            GlMesh.sliceToDimension(
                this.getBufferData().position,
                this.size,
                72
            ),
            size
        );
    }

    protected normalBuffer() {
        return GlMesh.sliceToDimension(
            this.getBufferData().normal,
            this.size,
            72
        );
    }

    protected textureBuffer() {
        let b: number[] = [];
        if (this.textureUrl) {
            return GlMesh.sliceToDimension(
                this.getBufferData().texture,
                this.size,
                48
            );
        } else {
            const inc = 1 / this.faceCount;

            for (let index = 0; index < this.faceCount; index++) {
                b.push(
                    index * inc + (inc / 3), 0,
                    index * inc + (inc / 3), 1,
                    (index + 1) * inc - (inc / 3), 0,
                    (index + 1) * inc - (inc / 3), 0
                );
            }
        }

        return b;
    }


    protected getIndexBufferData(): number[] {
        return [
            0, 1, 2,
            0, 2, 3,
            4, 5, 6,
            4, 6, 7,
            8, 9, 10,
            8, 10, 11,
            12, 13, 14,
            12, 14, 15,
            16, 17, 18,
            16, 18, 19,
            20, 21, 22,
            20, 22, 23
        ];
    }
    protected getPositionBufferData(): number[] {
        return [
            0.0, 0.0, -1.0,
            1.0, 0.0, -1.0,

            1.0, 1.0, -1.0,
            0.0, 1.0, -1.0,

            0.0, 0.0, -0.0,
            0.0, 1.0, -0.0,

            1.0, 1.0, -0.0,
            1.0, 0.0, -0.0,

            0.0, 1.0, -0.0,
            0.0, 1.0, -1.0,

            1.0, 1.0, -1.0,
            1.0, 1.0, -0.0,

            0.0, 0.0, -0.0,
            1.0, 0.0, -0.0,

            1.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            1.0, 0.0, -0.0,
            1.0, 1.0, -0.0,

            1.0, 1.0, -1.0,
            1.0, 0.0, -1.0,

            0.0, 0.0, -0.0,
            0.0, 0.0, -1.0,

            0.0, 1.0, -1.0,
            0.0, 1.0, -0.0
        ];
    }
    protected getNormalBufferData(): number[] {
        return [
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        ];
    }
    protected getTextureBufferData(): number[] {
        return [
            0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0,
        ];
    }
    protected getBufferData(): bufferData {
        return {
            index: this.getIndexBufferData(),
            position: this.getPositionBufferData(),
            normal: this.getNormalBufferData(),
            texture: this.getTextureBufferData(),
        };
    }

    public static sliceToDimension(array: number[], size: Vector3, total: number): number[] {
        const s = total / 6;
        if (size.z === 0) array = array.slice(0, s * 1);
        else if (size.x === 0) array = array.slice(s * 5, s * 6);
        else if (size.y === 0) array = array.slice(s * 3, s * 4);
        return array;
    }

    public static scale(array: number[], size?: Vector3): number[] {
        return size ? array.map((n, i) => n * size.array[(i % 3)]) : array;
    }

}