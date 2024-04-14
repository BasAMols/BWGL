import { mat4, vec4 } from 'gl-matrix';
import { Game } from '../game';
import { initShaderProgram } from './glrInit';
import { TickerReturnData } from '../utils/ticker';
import { Vector3 } from '../utils/vector3';
import { GLRendable } from './rendable';
import { GlElement } from './elementBase';
import { Vector2 } from '../utils/vector2';

export interface bufferDataInitilizers {
    indices: WebGLBuffer;
    initColor: (gl: WebGLRenderingContext, colors: vec4[]) => WebGLBuffer;
    initSize: (gl: WebGLRenderingContext, size: Vector3) => WebGLBuffer;
    verticesCount: number;
}
export interface buffers {
    indices: WebGLBuffer;
    positionBuffer: WebGLBuffer;
    textureCoord: WebGLBuffer,
    normalBuffer: WebGLBuffer,
}

export type GlElementType = 'controller' | 'obj' | 'mesh' | 'collider' | 'group';

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
        normalMatrix?: mat4;
    } = {};
    private programInfo: {
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

    get t(): TickerReturnData {
        return this.game.t;
    }

    constructor(public game: Game) {
        this.gl = this.game.renderer.dom.getContext('webgl');
        this.gl.getExtension("OES_element_index_uint");
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.programInfo = initShaderProgram(this.gl);
        this.game.renderer.getEvent('resize').subscribe('glr', this.resize.bind(this))
    }

    public resize(size: Vector2) {
        this.gl.viewport(0, 0, size.x, size.y);
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
        this.gl.clearColor(...this.game.level.background);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    draw() {
        this.clear();
        this.gl.useProgram(this.programInfo.program);
        this.gl.uniform1i(this.programInfo.uniformLocations.uSampler, 0);
        this.setCamera();
        this.drawChildren(this.game.level);
    }

    drawChildren(element: GlElement, currentModelview?: mat4) {
        element.children.forEach((o) => {
            this.drawObject(o, currentModelview ? mat4.clone(currentModelview) : undefined);
        });
    }

    drawObject(mesh: GlElement, currentModelview: mat4 = mat4.clone(this.frameData.modelViewMatrix)) {

        this.positionObject(currentModelview, mesh);
        this.rotateObject(currentModelview, mesh);
        this.setObjectNormals(currentModelview);

        if ((mesh as GLRendable).buffer) {
            this.renderMesh(mesh as GLRendable, currentModelview);
        }

        this.drawChildren(mesh, currentModelview);

    }

    private positionObject(currentModelview: mat4, mesh: GlElement) {
        mat4.translate(
            currentModelview,
            currentModelview,
            mesh.position.multiply(new Vector3(1, 1, -1)).vec
        );
    }

    private rotateObject(currentModelview: mat4, mesh: GlElement) {
        mat4.translate(
            currentModelview,
            currentModelview,
            mesh.anchorPoint.multiply(1, 1, -1).vec
        );

        mesh.rotation.multiply(new Vector3(1, -1, -1)).forEach((r, i) => {
            mat4.rotate(
                currentModelview,
                currentModelview,
                r,
                [Number(i === 0), Number(i === 1), Number(i === 2)]
            );
        });

        mat4.translate(
            currentModelview,
            currentModelview,
            mesh.anchorPoint.multiply(-1, -1, 1).vec
        );
    }

    private setObjectNormals(currentModelview: mat4) {
        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, currentModelview);
        mat4.transpose(normalMatrix, normalMatrix);

        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix
        );
    }

    renderMesh(mesh: GLRendable, currentModelview: mat4) {

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.buffer.indices);

        this.setPositionAttribute(mesh);
        this.setTextureAttribute(mesh);
        this.setNormalAttribute(mesh);

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

        this.gl.drawElements(
            this.gl.TRIANGLES,
            mesh.verticesCount,
            this.gl.UNSIGNED_INT,
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

    setNormalAttribute(mesh: GLRendable) {
        const numComponents = 3;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer.normalBuffer);
        this.gl.vertexAttribPointer(
            this.programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset,
        );
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexNormal);
    }

}