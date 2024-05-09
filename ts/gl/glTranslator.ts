import { mat4 } from 'gl-matrix';
import { Game } from '../game';
import { GLR } from './glRenderer';
import { initShaderProgram } from './glrInit';

export class GLTranslator {

    private uniforms: Record<string, {
        pointer: WebGLUniformLocation,
        type: 'matrix4' | 'float' | 'int';
    }>;
    private attributes: Record<string, {
        pointer: number,
        count: number;
    }>;
    public gl: WebGLRenderingContext;
    public programInfo: {
        program: WebGLProgram;
        attribLocations: {
            vertexPosition: number;
            vertexNormal: number;
            textureCoord: number,
        };
        uniformLocations: {
            projectionMatrix: WebGLUniformLocation;
            modelViewMatrix: WebGLUniformLocation;
            normalMatrix: WebGLUniformLocation,
            uSampler: WebGLUniformLocation;
        };
    };

    constructor(public game: Game, public glr: GLR) {
        this.gl = this.glr.gl;
        this.programInfo = initShaderProgram(this.gl);
        this.uniforms = {
            'projection':{
                pointer: this.programInfo.uniformLocations.projectionMatrix,
                type: 'matrix4'
            },
            'modelView':{
                pointer: this.programInfo.uniformLocations.modelViewMatrix,
                type: 'matrix4'
            },
            'normal':{
                pointer: this.programInfo.uniformLocations.normalMatrix,
                type: 'matrix4'
            },
            'opacity':{
                pointer: this.gl.getUniformLocation(this.programInfo.program, "uOpacity"),
                type: 'float'
            },
            'sampler':{
                pointer: this.programInfo.uniformLocations.uSampler,
                type: 'int'
            },
        }
        this.attributes = {
            'position':{
                pointer: this.programInfo.attribLocations.vertexPosition,
                count: 3,
            },
            'normal':{
                pointer: this.programInfo.attribLocations.vertexNormal,
                count: 3,
            },
            'texture':{
                pointer: this.programInfo.attribLocations.textureCoord,
                count: 2,
            },
        }
    }

    public sendAttribute(pointer: string, buffer: WebGLBuffer) {
        const at = this.attributes[pointer];
        if (at){
            this.sendBuffer(buffer);
            this.gl.vertexAttribPointer(
                at.pointer,
                at.count,
                this.gl.FLOAT,
                false,
                0,
                0,
            );
            this.gl.enableVertexAttribArray(at.pointer);

        } else {
            throw new Error(`${pointer} attribute doesnt exist`)
        }
                
    }

    public sendTexture(texture: WebGLTexture): void {
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    public sendBuffer(buffer: WebGLBuffer, type: 'normal'|'element' = 'normal'): void {
        this.gl.bindBuffer(type === 'element'?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER, buffer);
    }
    public sendUniform(pointer: string, data: unknown): void {
        const un = this.uniforms[pointer];
        if (un){
            if (un.type === 'matrix4') this.sendMat4(un.pointer, data as mat4);
            if (un.type === 'float') this.sendFloat(un.pointer, data as number);
            if (un.type === 'int') this.sendInt(un.pointer, data as number);
        } else {
            throw new Error('unform doesnt exist')
        }
    }

    public drawElements(n: number) {
        this.gl.drawElements(
            this.gl.TRIANGLES,
            n,
            this.gl.UNSIGNED_INT,
            0
        );
    }

    private sendMat4(pointer: WebGLUniformLocation, data: mat4) {
        this.gl.uniformMatrix4fv(
            pointer,
            false,
            data,
        );
    }
    private sendFloat(pointer: WebGLUniformLocation, data: number) {
        this.gl.uniform1f(
            pointer,
            data,
        );
    }
    private sendInt(pointer: WebGLUniformLocation, data: number) {
        this.gl.uniform1i(
            pointer,
            data,
        );
    }
}