import { buffers } from './glRenderer';
import { Vector3 } from '../utils/vector3';
import { GlElement, GlElementAttributes } from './elementBase';
import { GLTexture } from './texture';

export type GLRendableAttributes = GlElementAttributes & {
    opacity?: number;
};

export abstract class GLRendable extends GlElement {
    public buffer: buffers;
    public opacity: number = 1;
    public colors: [number, number, number, number][] = [];
    public abstract verticesCount: number;
    public abstract texture: GLTexture;

    constructor(attr: GLRendableAttributes = {}) {
        super(attr);
        this.opacity = attr.opacity !== undefined ? attr.opacity : 1;
    }

    public build() {
        this.buffer = {
            positionBuffer: this.GLT.createBuffer(this.positionBuffer(this.size)),
            indices: this.GLT.createBuffer(this.indexBuffer(), 'element', Uint32Array),
            textureCoord: this.GLT.createBuffer(this.textureBuffer(this.size)),
            normalBuffer: this.GLT.createBuffer(this.normalBuffer()),
        };
        this.GLR.initGlElement(this);
        // this.texture = new GLTexture(this.game, { url: 'cubetexture.png' });
    };

    public ready() {
        this.build();
        if (this.game.waitCount) {
            this.game.waitCount--;
        }
    }

    protected abstract indexBuffer(): number[];
    protected abstract positionBuffer(size: Vector3): number[];
    protected abstract textureBuffer(size: Vector3): number[];
    protected abstract normalBuffer(): number[];
}


