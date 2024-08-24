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
uniform float o_u_ignoreLighting;  
uniform vec3 o_u_ambientLight;  

void main() {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

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
  gl_FragColor = texelColor;
  if (o_u_ignoreLighting == 0.0){
  vec3 totalLight = light * o_u_lightColor;
  totalLight += o_u_ambientLight;
  totalLight += specular * o_u_specularColor;
  totalLight *= 1.0 - o_u_ignoreLighting;
  gl_FragColor.rgb *= totalLight;
}

 
}
`;
