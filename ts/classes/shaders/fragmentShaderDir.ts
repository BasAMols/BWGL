export default `
precision mediump float;

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
  vec3 surfaceToViewDirection = normalize(o_v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float dotFromDirection = dot(surfaceToLightDirection,-o_u_lightDirection);

  float rangeLight = smoothstep(o_u_outerRange, o_u_innerRange, length(o_v_surfaceToLight));
  float inLight = smoothstep(o_u_outerLimit, o_u_innerLimit, dotFromDirection);
  float light = 0.2 + rangeLight*inLight*dot(normal, surfaceToLightDirection);
  float specular = rangeLight*(inLight*pow(dot(normal, halfVector), o_u_shininess));
  gl_FragColor = texelColor;
  if (o_u_ignoreLighting == 0){
    gl_FragColor.rgb *= light * o_u_lightColor;
    gl_FragColor.rgb += specular * o_u_specularColor;
  }
}
`;