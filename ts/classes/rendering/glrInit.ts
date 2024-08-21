import vs from '../shaders/vertexShaderDir';
import fs from '../shaders/fragmentShaderDir';

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
    type: 'matrix4' | 'float' | 'int' | 'vector2' | 'vector3' | 'vector4';
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
            'uProjectionMatrix':{
                pointer: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                type: 'matrix4'
            },
            'uModelViewMatrix':{
                pointer: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                type: 'matrix4'
            },
            'uNormalMatrix':{
                pointer: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
                type: 'matrix4'
            },
            'uOpacity':{
                pointer: gl.getUniformLocation(shaderProgram, "uOpacity"),
                type: 'float'
            },
            'uIntensity':{
                pointer: gl.getUniformLocation(shaderProgram, "uIntensity"),
                type: 'float'
            },
            'uSampler':{
                pointer: gl.getUniformLocation(shaderProgram, "uSampler"),
                type: 'int'
            },
            'o_u_worldViewProjection':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_worldViewProjection"),
                type: 'matrix4'
            },
            'o_u_worldInverseTranspose':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_worldInverseTranspose"),
                type: 'matrix4'
            },
            'o_u_ambientLight':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_ambientLight"),
                type: 'vector3'
            },
            'o_u_lightColor':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_lightColor"),
                type: 'vector3'
            },
            'o_u_specularColor':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_specularColor"),
                type: 'vector3'
            },
            'o_u_shininess':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_shininess"),
                type: 'float'
            },
            'o_u_lightWorldPosition':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_lightWorldPosition"),
                type: 'vector3'
            },
            'o_u_viewWorldPosition':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_viewWorldPosition"),
                type: 'vector3'
            },
            'o_u_world':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_world"),
                type: 'matrix4'
            },
            'o_u_lightDirection':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_lightDirection"),
                type: 'vector3'
            },
            'o_u_innerLimit':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_innerLimit"),
                type: 'float'
            },
            'o_u_outerLimit':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_outerLimit"),
                type: 'float'
            },
            'o_u_innerRange':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_innerRange"),
                type: 'float'
            },
            'o_u_outerRange':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_outerRange"),
                type: 'float'
            },
            'o_u_ignoreLighting':{
                pointer: gl.getUniformLocation(shaderProgram, "o_u_ignoreLighting"),
                type: 'float'
            },
        },
        {
            'aVertexPosition':{
                pointer: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                count: 3,
            },
            'aVertexNormal':{
                pointer: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
                count: 3,
            },
            'aTextureCoord':{
                pointer: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
                count: 2,
            },
            'o_a_position':{
                pointer: gl.getAttribLocation(shaderProgram, "o_a_position"),
                count: 3,
            },
            'o_a_normal':{
                pointer: gl.getAttribLocation(shaderProgram, "o_a_normal"),
                count: 3,
            },
        }
    ]
}