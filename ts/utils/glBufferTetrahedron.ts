import { bufferDataInitilizers } from './gl';
import { Vector3 } from './vector3';

export function glTetrahedronData(gl: WebGLRenderingContext): bufferDataInitilizers {
    return {
        indices: initIndexBuffer(gl),
        initColor: colorBuffer,
        initSize: positionBuffer,
        verticesCount: 12
    }
}

function colorBuffer(gl: WebGLRenderingContext, faceColors: [number,number,number,number][]) {

    var colors: number[] = [];

    faceColors.forEach((f) => {
        colors = colors.concat(f,f,f)
    });

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return colorBuffer;
}

function initIndexBuffer(gl: WebGLRenderingContext) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
        0,
        1,
        2,

        3,
        4,
        5,

        6,
        7,
        8,

        9,
        10,
        11,
    ];

    // Now send the element array to GL
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );

    return indexBuffer;
}
function positionBuffer(gl: WebGLRenderingContext, size: Vector3) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        // Front face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        0.0, 0.73, 0.0,

        //left
        -1.0, -1.0, -1.0,
        0.0, -1.0, 0.73,
        0.0, 0.73, 0.0,

        //right
        1.0, -1.0, -1.0,
        0.0, -1.0, 0.73,
        0.0, 0.73, 0.0,

        //bottom
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        0.0, -1.0, 0.73,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}