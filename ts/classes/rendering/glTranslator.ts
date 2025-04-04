import { mat4, vec2, vec3, vec4 } from 'gl-matrix';
import { Game } from '../../game';
import { GLRenderer } from './glRenderer';
import { attributes, initShaderProgram, uniforms, TransformUniforms, LightUniforms } from './glrInit';

export class GLTranslator {

    public program: WebGLProgram;
    private uniforms: uniforms;
    private attributes: attributes;
    public gl: WebGL2RenderingContext;
    private transformUBO: WebGLBuffer;
    private lightUBO: WebGLBuffer;

    constructor(public game: Game, public glr: GLRenderer) {
        this.gl = this.glr.gl;
        [this.program, this.uniforms, this.attributes] = initShaderProgram(this.gl);
        
        // Create UBOs
        this.transformUBO = this.gl.createBuffer();
        this.lightUBO = this.gl.createBuffer();
        
        // Initial UBO setup
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, this.transformUBO);
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 1, this.lightUBO);
    }

    public createBuffer(data: number[], type: 'normal'|'element' = 'normal', dataType: typeof Float32Array|typeof Uint32Array = Float32Array) {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(type === 'element'?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(
            type === 'element'?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,
            new dataType(data),
            this.gl.STATIC_DRAW
        );
        return buffer;
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

    public sendTexture(texture: WebGLTexture | null): void {
        if (!texture) return;
        
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        
        // Enable anisotropic filtering if available
        const ext = this.gl.getExtension('EXT_texture_filter_anisotropic');
        if (ext) {
            const max = this.gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            this.gl.texParameterf(this.gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }
        
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
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
            if (un.type === 'vector2') this.sendVector2(un.pointer, data as vec2);
            if (un.type === 'vector3') this.sendVector3(un.pointer, data as vec3);
            if (un.type === 'vector4') this.sendVector4(un.pointer, data as vec4);
        } else {
            throw new Error(`${pointer} uniform doesnt exist`)
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
    private sendVector2(pointer: WebGLUniformLocation, data: vec2) {
        this.gl.uniform2fv(
            pointer,
            data,
        );
    }
    private sendVector3(pointer: WebGLUniformLocation, data: vec3) {
        this.gl.uniform3fv(
            pointer,
            data,
        );
    }
    private sendVector4(pointer: WebGLUniformLocation, data: vec4) {
        this.gl.uniform4fv(
            pointer,
            data,
        );
    }

    // Add methods for updating UBOs
    public updateTransformUBO(data: TransformUniforms) {
        // std140 layout requires specific alignment
        // mat4 = 4x4 = 16 floats each
        // vec3 = 4 floats each (padded to vec4)
        const buffer = new Float32Array(16 * 6 + 4 * 2); // 6 mat4s + 2 vec3s (padded)
        let offset = 0;

        // mat4s
        buffer.set(data.uModelViewMatrix, offset); offset += 16;
        buffer.set(data.uProjectionMatrix, offset); offset += 16;
        buffer.set(data.uNormalMatrix, offset); offset += 16;
        buffer.set(data.o_u_world, offset); offset += 16;
        buffer.set(data.o_u_worldViewProjection, offset); offset += 16;
        buffer.set(data.o_u_worldInverseTranspose, offset); offset += 16;

        // vec3s (padded to vec4)
        buffer.set([...data.o_u_lightWorldPosition, 0], offset); offset += 4;
        buffer.set([...data.o_u_viewWorldPosition, 0], offset); offset += 4;

        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.transformUBO);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, buffer, this.gl.DYNAMIC_DRAW);
    }

    public updateLightUBO(data: LightUniforms) {
        // std140 layout
        // vec3s = 4 floats each (padded to vec4)
        // floats = 4 bytes, aligned to 4-byte boundary
        const buffer = new Float32Array(4 * 6 + 8); // 6 vec3s (padded) + 8 floats
        let offset = 0;

        // vec3s (padded to vec4)
        buffer.set([...data.o_u_lightColor, 0], offset); offset += 4;
        buffer.set([...data.o_u_specularColor, 0], offset); offset += 4;
        buffer.set([...data.o_u_lightDirection, 0], offset); offset += 4;
        buffer.set([...data.o_u_ambientLight, 0], offset); offset += 4;

        // floats
        buffer[offset++] = data.o_u_shininess;
        buffer[offset++] = data.o_u_innerLimit;
        buffer[offset++] = data.o_u_outerLimit;
        buffer[offset++] = data.o_u_innerRange;
        buffer[offset++] = data.o_u_outerRange;
        buffer[offset++] = data.o_u_ignoreLighting;

        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.lightUBO);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, buffer, this.gl.DYNAMIC_DRAW);
    }
}