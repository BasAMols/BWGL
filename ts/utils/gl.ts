import { mat4, vec4 } from 'gl-matrix';
import { Game } from '../game';
import { initShaderProgram } from './glInit';
import { TickerReturnData } from './ticker';
import { Vector3 } from './vector3';
import { GLRendable } from '../elements/gl/glRendable';

export interface bufferDataInitilizers {
    indices: WebGLBuffer;
    initColor: (gl: WebGLRenderingContext, colors: vec4[]) => WebGLBuffer;
    initSize: (gl: WebGLRenderingContext, size: Vector3) => WebGLBuffer;
    verticesCount: number;
}
export interface buffers {
    indices: WebGLBuffer;
    positionBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
    textureCoord: WebGLBuffer,
}

export type GlElementType = 'camera' | 'obj' | 'mesh' | 'collider' | 'group';

export interface objectData {
    meshType: GlElementType,
    size3?: Vector3,
    position3: Vector3,
    buffer?: buffers;
    verticesCount?: number;
}

export class GLR {
    private objects: (GLRendable)[] = [];
    public gl: WebGLRenderingContext;
    private frameData: {
        projectionMatrix?: mat4;
        modelViewMatrix?: mat4;
    } = {};
    private programInfo: {
        program: WebGLProgram;
        attribLocations: {
            vertexPosition: number;
            vertexColor: number;
            textureCoord: number,
        };
        uniformLocations: {
            projectionMatrix: WebGLUniformLocation;
            modelViewMatrix: WebGLUniformLocation;
            uSampler: WebGLUniformLocation;
        };
    };

    get t(): TickerReturnData {
        return this.game.t;
    }

    constructor(public game: Game) {
        this.gl = this.game.renderer.domGl.getContext('webgl');
        this.programInfo = initShaderProgram(this.gl);
    }

    public resize() {
        this.gl.viewport(0, 0, (this.gl.canvas as HTMLCanvasElement).width, (this.gl.canvas as HTMLCanvasElement).height);
    }

    initGlElement(mesh: GLRendable) {
        this.objects.push(mesh);
    }

    setCamera() {

        const fieldOfView = (this.game.mode.camera.fov * Math.PI) / 180;

        const aspect = (this.gl.canvas as HTMLCanvasElement).clientWidth / (this.gl.canvas as HTMLCanvasElement).clientHeight;
        const zNear = 1;
        const zFar = 10000;
        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        mat4.translate(
            projectionMatrix,
            projectionMatrix,
            this.game.mode.camera.offset.multiply(1, 1, -1).vec
        );

        this.game.mode.camera.rotation.forEach((r, i) => {
            mat4.rotate(
                projectionMatrix,
                projectionMatrix,
                r,
                [Number(i === 0), Number(i === 1), Number(i === 2)],
            );
        });

        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.game.mode.camera.target.multiply(-1, 1, 1).vec
        );

        this.frameData.projectionMatrix = projectionMatrix;
        this.frameData.modelViewMatrix = modelViewMatrix;

    }

    clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 0.5);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw() {
        this.clear();
        this.setCamera();
        this.objects.forEach((o) => {
            this.drawObject(o);
        });
    }


    drawObject(mesh: GLRendable) {


        this.setPositionAttribute(mesh);
        this.setTextureAttribute(mesh);

        this.gl.useProgram(this.programInfo.program);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.buffer.indices);

        let currentModelview = mat4.clone(this.frameData.modelViewMatrix);


        mat4.translate(
            currentModelview,
            currentModelview,
            mesh.position3.multiply(new Vector3(1, 1, -1)).vec,
        );

        mat4.translate(
            currentModelview,
            currentModelview,
            mesh.anchorPoint.multiply(1,1,-1).vec,
        );

        mesh.rotation.multiply(new Vector3(1, -1, -1)).forEach((r, i) => {
            mat4.rotate(
                currentModelview,
                currentModelview,
                r,
                [Number(i === 0), Number(i === 1), Number(i === 2)],
            );
        });

        mat4.translate(
            currentModelview,
            currentModelview,
            mesh.anchorPoint.multiply(-1,-1,1).vec,
        );

        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.frameData.projectionMatrix,
        );
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            currentModelview,
        );

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, mesh.texture.texture);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);


        this.gl.drawElements(
            this.gl.TRIANGLES,
            mesh.verticesCount,
            this.gl.UNSIGNED_SHORT,
            0
        );
    }

    setPositionAttribute(mesh: GLRendable) {
        const numComponents = 3;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.positionBuffer);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    }

    setColorAttribute(mesh: GLRendable) {
        const numComponents = 4;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.colorBuffer);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
    }

    setTextureAttribute(mesh: GLRendable) {
        const num = 2; // every coordinate composed of 2 values
        const type = this.gl.FLOAT; // the data in the buffer is 32-bit float
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set to the next
        const offset = 0; // how many bytes inside the buffer to start from
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.textureCoord);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.textureCoord,
            num,
            type,
            normalize,
            stride,
            offset,
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
    }

}