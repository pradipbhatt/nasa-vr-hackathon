uniform float atmOpacity;
uniform float atmPowFactor;
uniform float atmMultiplier;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDirection, vNormal), atmPowFactor);
  vec3 atmosphereColor = vec3(0.6, 0.8, 1.0);
  gl_FragColor = vec4(atmosphereColor * atmMultiplier * fresnel * atmOpacity, 1.0);
}
