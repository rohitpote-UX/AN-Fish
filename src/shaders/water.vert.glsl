uniform float uTime;
uniform float uDepth;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normal;

  vec3 pos = position;
  float wave = sin(pos.x * 2.0 + uTime * 1.5) * cos(pos.y * 2.0 + uTime * 1.2) * 0.15;
  pos.z += wave;
  vPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
