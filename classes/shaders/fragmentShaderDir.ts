export default `#version 300 es
precision highp float;

// Use a uniform buffer object for light properties
layout(std140) uniform LightUniforms {
    float o_u_shininess;
    vec3 o_u_lightColor;
    vec3 o_u_specularColor;
    vec3 o_u_lightDirection;
    float o_u_innerLimit;
    float o_u_outerLimit;
    float o_u_innerRange;
    float o_u_outerRange;
    float o_u_ignoreLighting;
    vec3 o_u_ambientLight;
};

in vec3 o_v_normal;
in vec3 o_v_surfaceToLight;
in vec3 o_v_surfaceToView;
in highp vec2 vTextureCoord;

uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
    // Use textureGrad for better mipmap selection
    vec4 texelColor = textureGrad(uSampler, vTextureCoord, dFdx(vTextureCoord), dFdy(vTextureCoord));

    vec3 normal = normalize(o_v_normal);
    vec3 surfaceToLightDirection = normalize(o_v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(o_v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float dotFromDirection = dot(surfaceToLightDirection, -o_u_lightDirection);

    // Use mix() instead of smoothstep for better performance
    float rangeLight = mix(0.0, 1.0, 
        (length(o_v_surfaceToLight) - o_u_outerRange) / (o_u_innerRange - o_u_outerRange));
    float inLight = mix(0.0, 1.0, 
        (dotFromDirection - o_u_outerLimit) / (o_u_innerLimit - o_u_outerLimit));
    
    float combinedLight = clamp(rangeLight * inLight, 0.0, 1.0);
    float light = clamp(combinedLight * dot(normal, surfaceToLightDirection), 0.0, 1.0);
    float specular = clamp(pow(dot(normal, halfVector), o_u_shininess), 0.0, 1.0) * combinedLight;

    fragColor = texelColor;
    if (o_u_ignoreLighting == 0.0) {
        vec3 totalLight = light * o_u_lightColor;
        totalLight += o_u_ambientLight;
        totalLight += specular * o_u_specularColor;
        totalLight *= 1.0 - o_u_ignoreLighting;
        fragColor.rgb *= totalLight;
    }
}
`; 