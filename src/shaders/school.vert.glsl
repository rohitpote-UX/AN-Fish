uniform float uTime;
attribute vec3 aOffset;
attribute float aPhase;
varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;
  // Sinusoidal fish swimming wiggle
  float wiggle = sin(uTime * 5.0 + aPhase + pos.x * 3.0) * 0.1;
  pos.y += wiggle;

  vec4 worldPos = instanceMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
