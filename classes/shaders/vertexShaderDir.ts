export default `#version 300 es

// Use a uniform buffer object (UBO) for commonly shared uniforms
layout(std140) uniform TransformUniforms {
    mat4 uModelViewMatrix;
    mat4 uProjectionMatrix;
    mat4 uNormalMatrix;
    vec3 o_u_lightWorldPosition;
    vec3 o_u_viewWorldPosition;
    mat4 o_u_world;
    mat4 o_u_worldViewProjection;
    mat4 o_u_worldInverseTranspose;
};

in vec4 o_a_position;
in vec3 o_a_normal;
in vec2 aTextureCoord;
in vec3 aVertexNormal;

out vec3 o_v_normal;
out vec3 o_v_surfaceToLight;
out vec3 o_v_surfaceToView;
out highp vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * o_a_position;
    vTextureCoord = aTextureCoord;

    // Use built-in transpose function instead of pre-computing on CPU
    o_v_normal = mat3(transpose(inverse(uModelViewMatrix))) * aVertexNormal;
    vec3 surfaceWorldPosition = (uModelViewMatrix * o_a_position).xyz;
    o_v_surfaceToLight = o_u_lightWorldPosition - surfaceWorldPosition;
    o_v_surfaceToView = normalize(o_u_viewWorldPosition - surfaceWorldPosition);
}`;