import { vec4 } from 'gl-matrix';
import { Game } from '../../game';
import { TickerReturnData } from '../ticker';
import { Vector3, v3 } from '../math/vector3';
import { GLRendable } from '../rendable';
import { GlElement } from '../elementBase';
import { Vector2 } from '../math/vector2';
import { GLTranslator } from './glTranslator';
import { Matrix4, m4 } from '../math/matrix4';
import { Util } from '../util/utils';

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
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    getProjection() {
        return new Matrix4()
            .perspective(
                (this.game.mode.camera.fov * Math.PI) / 180,
                1,
                20000
            )
            .translate(this.game.mode.camera.offset.multiply(1, 1, -1))
            .rotate(this.game.mode.camera.rotation)
            .translate(this.game.mode.camera.target.multiply(-1, -1, 1))
    }

    draw() {
        this.clear();
        this.gl.useProgram(this.glt.program);
        this.glt.sendUniform('uSampler', 0);
        this.glt.sendUniform('uProjectionMatrix', this.getProjection().mat4);

        this.glt.sendUniform('o_u_lightColor', v3(1, 1, 1).vec);
        this.glt.sendUniform('o_u_specularColor', v3(0.6, 0.6, 0.6).scale(0.6).vec);
        this.glt.sendUniform('o_u_lightWorldPosition', v3(0,100,500).vec);
        this.glt.sendUniform('o_u_viewWorldPosition', this.game.mode.camera.target.vec);

        this.glt.sendUniform('o_u_lightDirection', Vector3.backwards.vec);
        this.glt.sendUniform('o_u_innerLimit',  Math.cos(Util.degToRad(10)));
        this.glt.sendUniform('o_u_outerLimit',  Math.cos(Util.degToRad(11)));

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
                this.renderMesh(mesh as GLRendable, mesh.globalMatrix);
            }
            this.drawChildren(mesh);
        }

    }

    renderMesh(mesh: GLRendable, currentModelview: Matrix4) {
        this.glt.sendBuffer(mesh.buffer.indices, 'element');

        // this.glt.sendAttribute('aVertexPosition', mesh.buffer.positionBuffer);
        // this.glt.sendAttribute('aVertexNormal', mesh.buffer.normalBuffer);

        this.glt.sendUniform('uModelViewMatrix', currentModelview.mat4);
        // this.glt.sendUniform('uOpacity', mesh.opacity);
        // this.glt.sendUniform('uIntensity', mesh.colorIntensity);
        // this.glt.sendUniform('uNormalMatrix', currentModelview.invert().transpose().mat4);
        this.glt.sendAttribute('aTextureCoord', mesh.buffer.textureCoord);
        this.glt.sendTexture(mesh.texture.texture);

        const projectionMatrix = this.getProjection();

        const cameraMatrix = m4();
        const viewMatrix = cameraMatrix.invert();
        const viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);

        const worldViewProjectionMatrix = viewProjectionMatrix.multiply(currentModelview);
        const worldInverseMatrix = currentModelview.invert();
        const worldInverseTransposeMatrix = worldInverseMatrix.transpose();

        this.glt.sendUniform('o_u_worldViewProjection', worldViewProjectionMatrix.mat4);
        this.glt.sendUniform('o_u_worldInverseTranspose', worldInverseTransposeMatrix.mat4);
        this.glt.sendUniform('o_u_shininess', 500);

        this.glt.sendAttribute('o_a_position', mesh.buffer.positionBuffer);
        this.glt.sendAttribute('o_a_normal', mesh.buffer.normalBuffer);
        this.glt.sendUniform('o_u_world', currentModelview.mat4);


        this.glt.drawElements(mesh.verticesCount);
    }
}
