import { GlElementType } from './glr';
import { Color, Colors } from '../utils/colors';
import { Vector3 } from '../utils/vector3';
import { GlElementAttributes } from './elementBase';
import { GLRendable } from './rendable';
import { GLTexture } from './texture';

export type GlMeshAttributes = GlElementAttributes & {
    colors?: [Color, Color?, Color?, Color?, Color?, Color?],
    textureUrl?: string,
    size: Vector3;
};

export class GlMesh extends GLRendable {
    public texture: GLTexture;
    public type: GlElementType = 'mesh';
    public colors: [number, number, number, number][] = [];
    public verticesCount = 36;
    public dimensions = 0 | 1 | 2 | 3;
    private textureUrl: string;
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
        let b: number[] = [
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
        ].slice(0, this.faceCount * 6);

        return this.getIndexBuffer(b);
    }

    protected positionBuffer(size: Vector3) {
        let b = [
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

        if (this.dimensions === 2) {
            if (this.size.z === 0) b = b.slice(0, 24);
            else if (this.size.x === 0) b = b.slice(60, 72);
            else if (this.size.y === 0) b = b.slice(36, 48);
        }
        return this.getPositionBuffer(b.map((n, i) => n * size.array[(i % 3)]));
    }
    protected normalBuffer() {
        let b = [
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        ];

        if (this.dimensions === 2) {
            if (this.size.z === 0) b = b.slice(12, 24);
            else if (this.size.x === 0) b = b.slice(60, 72);
            else if (this.size.y === 0) b = b.slice(36, 48);
        }
        return this.getNormalBuffer(b);
    }

    protected textureBuffer(size: Vector3): WebGLBuffer {
        let b: number[] = [];
        if (this.textureUrl) {
            b = [
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
            if (this.dimensions === 2) {
                if (this.size.z === 0) b = b.slice(0, 8);
                else if (this.size.x === 0) b = b.slice(40, 48);
                else if (this.size.y === 0) b = b.slice(24, 32);
            }
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
        
        return this.getTextureBuffer(b);

    }
}