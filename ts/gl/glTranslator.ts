import { mat4 } from 'gl-matrix';
import { Game } from '../game';
import { GLR } from './glRenderer';
import { attributes, initShaderProgram, uniforms } from './glrInit';


export class GLTranslator {

    public program: WebGLProgram;
    private uniforms: uniforms;
    private attributes: attributes;
    public gl: WebGLRenderingContext;

    constructor(public game: Game, public glr: GLR) {
        this.gl = this.glr.gl;
        [this.program, this.uniforms, this.attributes] = initShaderProgram(this.gl) as [WebGLProgram, uniforms, attributes];
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