import vs from './shaders/vertexShader';
import fs from './shaders/fragmentShader';

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export type uniforms = Record<string, {
    pointer: WebGLUniformLocation,
    type: 'matrix4' | 'float' | 'int';
}>
export type attributes = Record<string, {
    pointer: number,
    count: number;
}>

export function initShaderProgram(gl: WebGLRenderingContext): [WebGLProgram, uniforms, attributes] {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return;
    }

    return [
        shaderProgram, 
        {
            'projection':{
                pointer: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                type: 'matrix4'
            },
            'modelView':{
                pointer: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                type: 'matrix4'
            },
            'normal':{
                pointer: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                type: 'matrix4'
            },
            'opacity':{
                pointer: gl.getUniformLocation(shaderProgram, "uOpacity"),
                type: 'float'
            },
            'sampler':{
                pointer: gl.getUniformLocation(shaderProgram, "uSampler"),
                type: 'int'
            },
        },
        {
            'position':{
                pointer: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                count: 3,
            },
            'normal':{
                pointer: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                count: 3,
            },
            'texture':{
                pointer: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                count: 2,
            },
        }
    ]
}