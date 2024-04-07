import { GLMeshType, GlElementType, buffers } from '../../utils/gl';
import { TickerReturnData } from '../../utils/ticker';
import { GlElement, GlElementAttributes } from './glElement';
import { Vector3 } from '../../utils/vector3';

export type GlMeshAttributes = GlElementAttributes & {

};

export abstract class GLMesh extends GlElement {
    public type: GlElementType = 'mesh';
    protected colors: [number, number, number, number][];
    public abstract meshType: GLMeshType;
    public abstract verticesCount: number
    public buffer: buffers;

    constructor(attr: GlMeshAttributes = {}) {
        super(attr);
    }

    public build() {
        this.buffer = {
            positionBuffer: this.positionBuffer(this.size3),
            colorBuffer: this.colorBuffer(this.colors),
            indices: this.indexBuffer(),
        };
        this.GLR.initGlMesh(this);
    };

    protected abstract colorBuffer(faceColors: [number, number, number, number][]): WebGLBuffer;
    protected abstract indexBuffer(): WebGLBuffer;
    protected abstract positionBuffer(size: Vector3): WebGLBuffer;

    
    getColorBuffer(colors: number[]) {
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        return colorBuffer;
    }

    getIndexBuffer(indices: number[]) {
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            this.gl.STATIC_DRAW,
        );
        return indexBuffer;
    }

    getPositionBuffer(positions: number[]) {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        return positionBuffer;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
    }
}