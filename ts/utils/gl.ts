import { mat4, vec3, vec4 } from 'gl-matrix';
import { Game } from '../game';
import { initShaderProgram } from './glInit';
import { TickerReturnData } from './ticker';
import { squareBuffer } from './glBufferSquare';
import { pyramidBuffer } from './glBufferPyramid';

export interface bufferObject {
    positionBuffer: WebGLBuffer;
    indices: WebGLBuffer;
    colorBuilder: (gl: WebGLRenderingContext, colors: vec4[]) => WebGLBuffer;
    colorBuffer?: WebGLBuffer;
}

export interface objectData {
    type: 'square' | 'pyramid',
    colors: vec4[],
    position: vec3,
    buffer?: Omit<bufferObject, 'colorBuilder'>;
}

export class GLR {
    private objects: objectData[] = [];
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
        };
        uniformLocations: {
            projectionMatrix: WebGLUniformLocation;
            modelViewMatrix: WebGLUniformLocation;
        };
    };
    private buffers: Record<string, bufferObject> = {};

    get t(): TickerReturnData {
        return this.game.t;
    }

    constructor(public game: Game) {
        this.gl = this.game.gl;
        this.init();
    }

    init() {
        this.programInfo = initShaderProgram(this.gl);
        this.buffers.square = squareBuffer(this.gl);
        this.buffers.pyramid = pyramidBuffer(this.gl);

        for (let i = 0; i < 10; i+=1) {
            for (let j = 0; j < 29; j+=2) {
                this.objects.push({
                    type: 'square',
                    position: [i, j, 0],
                    colors: [
                        [1.0, 0.0, 0.0, 1.0],
                        [1.0, 0.0, 0.0, 1.0],
                        [0.0, 1.0, 0.0, 1.0],
                        [0.0, 0.0, 1.0, 1.0],
                        [1.0, 1.0, 0.0, 1.0],
                        [1.0, 0.0, 1.0, 1.0]
                    ]
                });
            }
        }

        this.objects.push({
            type: 'pyramid',
            position: [4, 6, -2],
            colors: [
                [5.0, 0.0, 0.0, 1.0],
                [1.0, 0.0, 0.0, 1.0],
                [3.0, 1.0, 0.0, 1.0],
                [0.0, 0.0, 1.0, 1.0]
            ]
        });

        this.initializeObjects();
    }

    initializeObjects() {
        this.objects.forEach((o) => {
            o.buffer = {
                positionBuffer: this.buffers[o.type].positionBuffer,
                indices: this.buffers[o.type].indices,
                colorBuffer: this.buffers[o.type].colorBuilder(this.gl, o.colors)
            };
        });
    }

    setCamera() {

        const fieldOfView = (60 * Math.PI) / 180;
        const aspect = (this.gl.canvas as HTMLCanvasElement).clientWidth / (this.gl.canvas as HTMLCanvasElement).clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        const modelViewMatrix = mat4.create();

        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            [(this.t.frame % 360 / 360) * 40-25, -10, -15],
        );
        // mat4.rotate(
        //     modelViewMatrix,
        //     modelViewMatrix,
        //     (this.t.frame % 720 / 720) * Math.PI * 2,
        //     [0, 1, 0],
        // );
        // mat4.rotate(
        //     modelViewMatrix,
        //     modelViewMatrix,
        //     (this.t.frame % 360 / 360) * Math.PI * 2,
        //     [0, 0, 1],
        // );

        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            1,
            [0, 0,0],
        );

        this.frameData.projectionMatrix = projectionMatrix;
        this.frameData.modelViewMatrix = modelViewMatrix;

    }

    clear(obj: TickerReturnData) {
        this.gl.clearColor(0.0, 0.0, 0.0, 0.5);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    draw(obj: TickerReturnData) {
        this.clear(obj);
        this.setCamera();
        this.objects.forEach((o) => {
            this.drawObject(o);
        });
        // this.drawObject('square');
        // this.drawObject('pyramid');
    }


    drawObject(o: objectData) {

        this.setPositionAttribute(o);
        this.setColorAttribute(o);

        this.gl.useProgram(this.programInfo.program);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[o.type].indices);

        let m = mat4.clone(this.frameData.modelViewMatrix);
        mat4.translate(
            m,
            m,
            o.position,
        );

        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.projectionMatrix,
            false,
            this.frameData.projectionMatrix,
        );
        this.gl.uniformMatrix4fv(
            this.programInfo.uniformLocations.modelViewMatrix,
            false,
            m,
        );
        this.gl.drawElements(
            this.gl.TRIANGLES,
            { square: 36, pyramid: 12 }[o.type] || 1,
            this.gl.UNSIGNED_SHORT,
            0
        );
    }

    setPositionAttribute(o: objectData) {
        const numComponents = 3;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.buffer.positionBuffer);
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

    setColorAttribute(o: objectData) {
        const numComponents = 4;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.buffer.colorBuffer);
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

}