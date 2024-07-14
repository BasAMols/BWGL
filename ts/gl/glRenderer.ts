import { vec4 } from 'gl-matrix';
import { Game } from '../game';
import { TickerReturnData } from '../utils/ticker';
import { Vector3 } from '../utils/vector3';
import { GLRendable } from './rendable';
import { GlElement } from './elementBase';
import { Vector2 } from '../utils/vector2';
import { GLTranslator } from './glTranslator';
import { Matrix4 } from '../utils/matrix4';

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

export class GLRenderer {
    private objects: (GLRendable)[] = [];
    public gl: WebGLRenderingContext;
    public glt: GLTranslator;

    get t(): TickerReturnData {
        return this.game.t;
    }

    constructor(public game: Game) {
        this.gl = this.game.renderer.dom.getContext('webgl');
        this.gl.getExtension("OES_element_index_uint");
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.glt = new GLTranslator(this.game, this);

        this.game.renderer.getEvent('resize').subscribe('glr', (size: Vector2) => {
            this.gl.viewport(0, 0, size.x, size.y);
        });

    }

    initGlElement(mesh: GLRendable) {
        this.objects.push(mesh);
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

        this.gl.useProgram(this.glt.program);
        this.glt.sendUniform('uSampler', 0);
        this.glt.sendUniform('uProjectionMatrix', new Matrix4()
            .perspective(
                (this.game.mode.camera.fov * Math.PI) / 180,
                1,
                20000
            )
            .translate(this.game.mode.camera.offset.multiply(1, 1, -1))
            .rotate(this.game.mode.camera.rotation)
            .translate(this.game.mode.camera.target.multiply(-1, -1, 1))
            .mat4
        );

        this.drawChildren(this.game.level);
    }

    drawChildren(element: GlElement) {
        element.children.forEach((o) => {
            this.drawObject(o);
        });
    }

    drawObject(mesh: GlElement) {
        if (mesh.visible) {
            if ((mesh as GLRendable).buffer) {
                this.renderMesh(mesh as GLRendable, mesh.worldMatrix);
            }
            this.drawChildren(mesh);
        }

    }

    renderMesh(mesh: GLRendable, currentModelview: Matrix4) {
        this.glt.sendBuffer(mesh.buffer.indices, 'element');

        this.glt.sendAttribute('aVertexPosition', mesh.buffer.positionBuffer);
        this.glt.sendAttribute('aVertexNormal', mesh.buffer.normalBuffer);
        this.glt.sendAttribute('aTextureCoord', mesh.buffer.textureCoord);

        this.glt.sendUniform('uModelViewMatrix', currentModelview.mat4);
        this.glt.sendUniform('uOpacity', mesh.opacity);
        this.glt.sendUniform('uIntensity', mesh.colorIntensity);
        this.glt.sendUniform('uNormalMatrix', currentModelview.invert().transpose().mat4);

        this.glt.sendTexture(mesh.texture.texture);
        this.glt.drawElements(mesh.verticesCount);
    }
}