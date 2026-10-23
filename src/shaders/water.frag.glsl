uniform float uTime;
uniform float uDepth;
uniform vec3 uColorShallow;
uniform vec3 uColorDeep;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  float depthRatio = clamp(uDepth / 100.0, 0.0, 1.0);
  vec3 waterColor = mix(uColorShallow, uColorDeep, depthRatio);

  // Caustic simulation
  float caustic = sin(vUv.x * 30.0 + uTime * 2.0) * sin(vUv.y * 30.0 + uTime * 2.0);
  caustic = pow(max(0.0, caustic), 3.0) * 0.4;

  vec3 finalColor = waterColor + vec3(caustic);
  gl_FragColor = vec4(finalColor, 0.7);
}
