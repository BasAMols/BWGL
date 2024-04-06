import { bufferObject } from './gl';

export function squareBuffer(gl: WebGLRenderingContext): bufferObject {
    return {
        positionBuffer: initPositionBuffer(gl),
        indices: initIndexBuffer(gl),
        colorBuilder: squareColorBuffer
    };
}
function squareColorBuffer(gl: WebGLRenderingContext, faceColors: [number,number,number,number][]) {

    var colors: number[] = [];
    faceColors.forEach((f) => {
        colors = colors.concat(f,f,f,f)
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
        0,
        2,
        3,
        // front
        4,
        5,
        6,
        4,
        6,
        7,
        // back
        8,
        9,
        10,
        8,
        10,
        11,
        // top
        12,
        13,
        14,
        12,
        14,
        15,
        // bottom
        16,
        17,
        18,
        16,
        18,
        19,
        // right
        20,
        21,
        22,
        20,
        22,
        23,
        // left
    ];

    // Now send the element array to GL
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );

    return indexBuffer;
}
function initPositionBuffer(gl: WebGLRenderingContext) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [ // Front face
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,

        // Back face
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,

        // Top face
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,

        // Bottom face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,

        // Right face
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}