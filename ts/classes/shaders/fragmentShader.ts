export default `
varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;
uniform lowp float uOpacity;
uniform lowp float uIntensity;

void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4((texelColor.rgb+texelColor.rgb * (uIntensity-1.0)) * vLighting, texelColor.a*uOpacity);
}
`;