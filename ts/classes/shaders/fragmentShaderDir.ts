export default `
precision highp float;

varying vec3 o_v_normal;
varying vec3 o_v_surfaceToLight;
varying vec3 o_v_surfaceToView;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float o_u_shininess;
uniform vec3 o_u_lightColor;
uniform vec3 o_u_specularColor;
uniform vec3 o_u_lightDirection;
uniform float o_u_innerLimit;  
uniform float o_u_outerLimit;  
uniform float o_u_innerRange;  
uniform float o_u_outerRange;  
uniform int o_u_ignoreLighting;  

void main() {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  vec3 normal = normalize(o_v_normal);

  vec3 surfaceToLightDirection = normalize(o_v_surfaceToLight);

  float dotFromDirection = dot(surfaceToLightDirection,-o_u_lightDirection);

  float light = 0.2 + dot(normal, surfaceToLightDirection);
  gl_FragColor = texelColor;
  gl_FragColor.rgb *= light * o_u_lightColor*0.8;
  
}
`;