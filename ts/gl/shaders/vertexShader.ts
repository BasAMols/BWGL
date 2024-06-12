export default `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp vec3 vCloudLighting;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;

  highp vec3 ambientLight = vec3(1, 1, 1) *0.3;
  highp vec3 directionalLightColor = vec3(1, 1, 1)*1.0;
  highp vec3 directionalVector = normalize(vec3(-0.7, .7, 0.3));

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  lowp vec3 vCloudLighting = vec3(1, 1, 1)*0.4 + (vec3(1, 1, 1) * max(dot(transformedNormal.xyz, normalize(vec3(-0.7, -1, 0.3))), 0.0)*0.6);

  if ((uModelViewMatrix * aVertexPosition).y > 100.0) {
    vLighting = vCloudLighting;
  } else {
    vLighting = ambientLight + (directionalLightColor * directional);
  }
}`