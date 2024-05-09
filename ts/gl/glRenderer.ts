import { mat4, vec4 } from 'gl-matrix';
import { Game } from '../game';
import { TickerReturnData } from '../utils/ticker';
import { Vector3 } from '../utils/vector3';
import { GLRendable } from './rendable';
import { GlElement } from './elementBase';
import { Vector2 } from '../utils/vector2';
import { GLTranslator } from './glTranslator';

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

    private GLT: GLTranslator;

    get t(): TickerReturnData {
        return this.game.t;
    }

    private frameData: {
        projectionMatrix?: mat4;
        modelViewMatrix?: mat4;
        normalMatrix?: mat4;
    } = {};

    constructor(public game: Game) {
        this.gl = this.game.renderer.dom.getContext('webgl');
        this.gl.getExtension("OES_element_index_uint");
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.GLT = new GLTranslator(this.game, this);

        this.game.renderer.getEvent('resize').subscribe('glr', this.resize.bind(this));
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
    }

    draw() {
        this.clear();
        this.gl.useProgram(this.GLT.programInfo.program);
        this.GLT.sendUniform('sampler', 0);
        this.setCamera();
        this.drawChildren(this.game.level);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

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
        this.GLT.sendUniform('normal', normalMatrix);
    }

    renderMesh(mesh: GLRendable, currentModelview: mat4) {
        this.GLT.sendBuffer(mesh.buffer.indices, 'element');

        this.GLT.sendAttribute('position', mesh.buffer.positionBuffer);
        this.GLT.sendAttribute('texture', mesh.buffer.textureCoord);
        this.GLT.sendAttribute('normal', mesh.buffer.normalBuffer);

        this.GLT.sendUniform('projection', this.frameData.projectionMatrix);
        this.GLT.sendUniform('modelView', currentModelview);
        this.GLT.sendUniform('opacity', mesh.opacity);

        this.GLT.sendTexture(mesh.texture.texture);
        this.GLT.drawElements(mesh.verticesCount);
    }

}