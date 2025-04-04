import vs from '../shaders/vertexShaderDir';
import fs from '../shaders/fragmentShaderDir';
import { mat4, vec3 } from 'gl-matrix';

function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
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

export interface TransformUniforms {
    uModelViewMatrix: mat4;
    uProjectionMatrix: mat4;
    uNormalMatrix: mat4;
    o_u_lightWorldPosition: vec3;
    o_u_viewWorldPosition: vec3;
    o_u_world: mat4;
    o_u_worldViewProjection: mat4;
    o_u_worldInverseTranspose: mat4;
}

export interface LightUniforms {
    o_u_shininess: number;
    o_u_lightColor: vec3;
    o_u_specularColor: vec3;
    o_u_lightDirection: vec3;
    o_u_innerLimit: number;
    o_u_outerLimit: number;
    o_u_innerRange: number;
    o_u_outerRange: number;
    o_u_ignoreLighting: number;
    o_u_ambientLight: vec3;
}

export function initShaderProgram(gl: WebGL2RenderingContext): [WebGLProgram, uniforms, attributes] {

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

    // Create and bind uniform buffer objects
    const transformUBO = gl.createBuffer();
    const lightUBO = gl.createBuffer();

    // Bind UBOs to binding points
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, transformUBO);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, lightUBO);

    // Get UBO indices
    const transformBlockIndex = gl.getUniformBlockIndex(shaderProgram, 'TransformUniforms');
    const lightBlockIndex = gl.getUniformBlockIndex(shaderProgram, 'LightUniforms');

    // Bind UBO indices to binding points
    gl.uniformBlockBinding(shaderProgram, transformBlockIndex, 0);
    gl.uniformBlockBinding(shaderProgram, lightBlockIndex, 1);

    return [
        shaderProgram, 
        {
            'uOpacity':{
                pointer: gl.getUniformLocation(shaderProgram, "uOpacity"),
                type: 'float'
            },
            'uIntensity':{
                pointer: gl.getUniformLocation(shaderProgram, "uIntensity"),
                type: 'float'
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