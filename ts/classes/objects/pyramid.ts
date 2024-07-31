import { GlElementType } from '../rendering/glRenderer';
import { Color, Colors } from '../util/colors';
import { Vector3 } from '../math/vector3';
import { GLRendable, GLRendableAttributes } from '../rendable';
import { GLTexture } from '../texture';

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

export class GLPyramid extends GLRendable {
    public texture: GLTexture;
    public type: GlElementType = 'mesh';
    public colors: [number, number, number, number][] = [];
    public verticesCount = 30;
    public dimensions = 0 | 1 | 2 | 3;
    public textureUrl: string;
    private faceCount = 5;

    constructor(attr: GlMeshAttributes) {
        super(attr);
        this.dimensions = attr.size.array.filter((v) => v !== 0).length;
        if (this.dimensions < 2) {
            return;
        }
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
        return GLPyramid.scale(
            this.getBufferData().position,
            size
        );
    }

    protected normalBuffer() {
        return this.getBufferData().normal;
    }

    protected textureBuffer() {
        let b: number[] = [];
        if (this.textureUrl) {
            return this.getBufferData().texture;
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
        ];
    }
    protected getPositionBufferData(): number[] {
        return [
            0.0, 0.0, -1.0, 1.0, 0.0, -1.0,
            0.5, 1.0, -0.5, 0.5, 1.0, -0.5,

            0.0, 0.0, -0.0, 0.5, 1.0, -0.5,
            0.5, 1.0, -0.5, 1, 0.0, -0.0,

            0.0, 0.0, -0.0, 1.0, 0.0, -0.0,
            1.0, 0.0, -1.0, 0.0, 0.0, -1.0,

            1.0, 0.0, -0.0, 0.5, 1.0, -0.5,
            0.5, 1.0, -0.5, 1.0, 0.0, -1.0,

            0.0, 0.0, -0.0, 0.0, 0.0, -1.0,
            0.5, 1.0, -0.5, 0.5, 1.0, -0.5
        ];
    }
    protected getNormalBufferData(): number[] {
        return [
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
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

    public static scale(array: number[], size?: Vector3): number[] {
        return size ? array.map((n, i) => n * size.array[(i % 3)]) : array;
    }

}