export default `
attribute vec4 o_a_position;
attribute vec3 o_a_normal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec2 aTextureCoord;
uniform mat4 uNormalMatrix;

uniform vec3 o_u_lightWorldPosition;
uniform vec3 o_u_viewWorldPosition;

uniform mat4 o_u_world;
uniform mat4 o_u_worldViewProjection;
uniform mat4 o_u_worldInverseTranspose;

varying vec3 o_v_normal;

varying vec3 o_v_surfaceToLight;
varying vec3 o_v_surfaceToView;

varying highp vec2 vTextureCoord;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * o_a_position;
  vTextureCoord = aTextureCoord;

  o_v_normal = mat3(o_u_worldInverseTranspose) * o_a_normal;
  vec3 surfaceWorldPosition = (uModelViewMatrix * o_a_position).xyz;
  o_v_surfaceToLight = o_u_lightWorldPosition - surfaceWorldPosition;
  o_v_surfaceToView = o_u_viewWorldPosition - surfaceWorldPosition;
}`
