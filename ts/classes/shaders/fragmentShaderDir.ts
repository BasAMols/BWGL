export default `#version 300 es
precision highp float;

in vec3 o_v_normal;
in vec3 o_v_surfaceToLight;
in vec3 o_v_surfaceToView;
in highp vec2 vTextureCoord;

uniform sampler2D uSampler;

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

// Light uniforms block with std140 layout
layout(std140) uniform LightUniforms {
    vec3 o_u_lightColor;
    vec3 o_u_specularColor;
    vec3 o_u_lightDirection;
    vec3 o_u_ambientLight;
    float o_u_shininess;
    float o_u_innerLimit;
    float o_u_outerLimit;
    float o_u_innerRange;
    float o_u_outerRange;
    float o_u_ignoreLighting;
};

out vec4 fragColor;

void main() {
    highp vec4 texelColor = texture(uSampler, vTextureCoord);

    vec3 normal = normalize(o_v_normal);
    vec3 surfaceToLightDirection = normalize(o_v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(o_v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float dotFromDirection = dot(surfaceToLightDirection,-o_u_lightDirection);

    float rangeLight = smoothstep(o_u_outerRange, o_u_innerRange, length(o_v_surfaceToLight));
    float inLight = smoothstep(o_u_outerLimit, o_u_innerLimit, dotFromDirection);
    float combinedLight = clamp(rangeLight * inLight, 0.0,1.0);
    float light = clamp(combinedLight*dot(normal, surfaceToLightDirection),0.0,1.0);
    float specular = clamp(pow(dot(normal, halfVector), o_u_shininess),0.0,1.0)*combinedLight;

    fragColor = texelColor;
    if (o_u_ignoreLighting == 0.0) {
        vec3 totalLight = light * o_u_lightColor;
        totalLight += o_u_ambientLight;
        totalLight += specular * o_u_specularColor;
        fragColor.rgb *= totalLight;
    }
}`;