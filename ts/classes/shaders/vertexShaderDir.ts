export default `#version 300 es

in vec4 o_a_position;
in vec3 o_a_normal;
in vec2 aTextureCoord;
in vec3 aVertexNormal;

// Transform uniforms block with std140 layout
layout(std140) uniform TransformUniforms {
    mat4 uModelViewMatrix;
    mat4 uProjectionMatrix;
    mat4 uNormalMatrix;
    mat4 o_u_world;
    mat4 o_u_worldViewProjection;
    mat4 o_u_worldInverseTranspose;
    vec3 o_u_lightWorldPosition;
    vec3 o_u_viewWorldPosition;
};

out vec3 o_v_normal;
out vec3 o_v_surfaceToLight;
out vec3 o_v_surfaceToView;
out highp vec2 vTextureCoord;

void main() {
    // Use world matrix for proper object positioning
    vec4 worldPosition = o_u_world * o_a_position;
    gl_Position = o_u_worldViewProjection * o_a_position;
    vTextureCoord = aTextureCoord;

    // Transform normal to world space
    o_v_normal = mat3(o_u_worldInverseTranspose) * aVertexNormal;
    
    // Calculate vectors in world space
    vec3 surfaceWorldPosition = worldPosition.xyz;
    o_v_surfaceToLight = o_u_lightWorldPosition - surfaceWorldPosition;
    o_v_surfaceToView = o_u_viewWorldPosition - surfaceWorldPosition;
}`;