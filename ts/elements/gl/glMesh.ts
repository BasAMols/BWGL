import { GlElementType } from '../../utils/gl';
import { Color, Colors } from '../../utils/colors';
import { Vector3 } from '../../utils/vector3';
import { GlElementAttributes } from './glElement';
import { GLRendable } from './glRendable';
import { GLTexture } from './glTexture';

export type GlMeshAttributes = GlElementAttributes & {
    colors?: [Color, Color?, Color?, Color?, Color?, Color?],
    textureUrl?: string,
    size3: Vector3;
};

export class GlMesh extends GLRendable {
    public texture: GLTexture;
    public type: GlElementType = 'mesh';
    public colors: [number, number, number, number][] = [];
    public verticesCount = 36;
    public dimensions = 0 | 1 | 2 | 3;
    private textureUrl: string;

    constructor(attr: GlMeshAttributes) {
        super(attr);
        this.dimensions = attr.size3.array.filter((v) => v !== 0).length;
        this.textureUrl = attr.textureUrl;

        if (attr.colors) this.colors = attr.colors;
        else if (this.dimensions === 2) this.colors = [Colors.r];
        else this.colors = [
            Colors.r,
            Colors.g,
            Colors.b,
            Colors.c,
            Colors.m,
            Colors.y
        ];

    }

    public build(): void {
        super.build();
        this.texture = new GLTexture(this.game, this.textureUrl ? { url: this.textureUrl } : { color: this.colors[0] });
    }

    protected colorBuffer() {
        while (this.colors.length < this.verticesCount / 3) {
            this.colors.push(this.colors[0]);
        }

        var colors: number[] = [];
        this.colors.forEach((f) => {
            colors = colors.concat(f, f, f, f);
        });

        return this.getColorBuffer(colors);
    }

    protected indexBuffer() {
        let b: number[] = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];

        if (this.dimensions === 2) {
            this.verticesCount = 6;
            b = b.slice(0, 6);
        }

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
            if (this.depth === 0) b = b.slice(0, 24);
            else if (this.width === 0) b = b.slice(60, 72);
            else if (this.height === 0) b = b.slice(36, 48);
        }
        return this.getPositionBuffer(b.map((n, i) => n * size.array[(i % 3)]));
    }

    protected textureBuffer(size: Vector3): WebGLBuffer {
        let b = [
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        ];

        if (this.dimensions === 2) {
            if (this.depth === 0) b = b.slice(0, 8);
            else if (this.width === 0) b = b.slice(40, 48);
            else if (this.height === 0) b = b.slice(24, 32);
        }

        return this.getTextureBuffer(b);
    }



}