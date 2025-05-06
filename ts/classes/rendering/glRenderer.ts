import { vec3, vec4 } from 'gl-matrix';
import { Game } from '../../game';
import { TickerReturnData } from '../ticker';
import { Vector3 } from '../math/vector3';
import { GLRendable } from '../rendable';
import { GlElement } from '../elementBase';
import { Vector2 } from '../math/vector2';
import { GLTranslator } from './glTranslator';
import { Matrix4, m4 } from '../math/matrix4';
import { Util } from '../util/utils';
import { SpotLight } from '../lights/spot';
import { AmbientLight } from '../lights/ambient';
import { LightUniforms } from './glrInit';

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
    public gl: WebGL2RenderingContext;
    public glt: GLTranslator;
    private lightData: LightUniforms;

    get t(): TickerReturnData {
        return this.game.t;
    }

    constructor(public game: Game) {
        this.gl = this.game.renderer.dom.getContext('webgl2');
        if (!this.gl) {
            throw new Error('WebGL 2 not supported');
        }

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
        this.gl.cullFace(this.gl.BACK);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    getProjection() {
        return new Matrix4()
            .perspective(
                (this.game.mode.camera.fov * Math.PI) / 180,
                1,
                200000
            )
            .translate(this.game.mode.camera.offset.multiply(1, 1, -1))
            .rotate(this.game.mode.camera.rotation)
            .translate(this.game.mode.camera.target.multiply(-1, -1, 1));
    }

    draw() {
        this.clear();
        this.gl.useProgram(this.glt.program);
        
        const camera = m4()
            .translate(this.game.mode.camera.offset.multiply(1, 1, -1))
            .rotate(this.game.mode.camera.rotation)
            .translate(this.game.mode.camera.target.multiply(-1, -1, 1));

        const light = this.game.level.lights.find((l) => l.lightType === 'spot') as SpotLight;

        const transformData = {
            uProjectionMatrix: this.getProjection().mat4,
            uModelViewMatrix: camera.mat4,
            o_u_viewWorldPosition: camera.invert().position.vec,
            uNormalMatrix: camera.invert().transpose().mat4,
            o_u_lightWorldPosition: light.globalPosition.multiply(1, 1, -1).vec,
            o_u_world: camera.mat4,
            o_u_worldViewProjection: this.getProjection().multiply(camera).mat4,
            o_u_worldInverseTranspose: camera.invert().transpose().mat4
        };
        this.glt.updateTransformUBO(transformData);

        this.lightData = {
            o_u_lightDirection: light.direction.vec,
            o_u_innerLimit: Math.cos(Util.degToRad(light.limit[0])),
            o_u_outerLimit: Math.cos(Util.degToRad(light.limit[1])),
            o_u_innerRange: light.range[0],
            o_u_outerRange: light.range[1],
            o_u_lightColor: vec3.fromValues(...(light.color.slice(0, 3) as [number, number, number])),
            o_u_specularColor: vec3.fromValues(...(light.specular.slice(0, 3) as [number, number, number])),
            o_u_ambientLight: vec3.fromValues(...(((this.game.level.lights.find((l) => l.lightType === 'ambient') as AmbientLight)?.color || [0, 0, 0]) as [number, number, number])),
            o_u_shininess: 600,
            o_u_ignoreLighting: 0
        };
        this.glt.updateLightUBO(this.lightData);

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
        this.glt.sendAttribute('aVertexNormal', mesh.buffer.normalBuffer);
        this.glt.sendAttribute('aTextureCoord', mesh.buffer.textureCoord);
        this.glt.sendAttribute('o_a_position', mesh.buffer.positionBuffer);
        this.glt.sendTexture(mesh.texture.texture);

        const projectionMatrix = this.getProjection();
        const cameraMatrix = m4();
        const viewMatrix = cameraMatrix.invert();
        const viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);
        const worldViewProjectionMatrix = viewProjectionMatrix.multiply(currentModelview);

        const transformData = {
            uModelViewMatrix: currentModelview.mat4,
            uProjectionMatrix: projectionMatrix.mat4,
            uNormalMatrix: currentModelview.invert().transpose().mat4,
            o_u_lightWorldPosition: this.game.level.lights.find(l => l.lightType === 'spot').globalPosition.multiply(1, 1, -1).vec,
            o_u_viewWorldPosition: cameraMatrix.invert().position.vec,
            o_u_world: currentModelview.mat4,
            o_u_worldViewProjection: worldViewProjectionMatrix.mat4,
            o_u_worldInverseTranspose: currentModelview.invert().transpose().mat4
        };
        this.glt.updateTransformUBO(transformData);

        const lightData = {
            ...this.lightData,
            o_u_ignoreLighting: Number(mesh.ignoreLighting)
        };
        this.glt.updateLightUBO(lightData);

        this.glt.drawElements(mesh.verticesCount);
    }
}
