
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // [-1, 1] 坐标系归一化
    vec2 uv = (2. * gl_FragCoord.xy - u_resolution.xy)/u_resolution.y;
    // vec3 col = vec3(ceil(uv.x), ceil(uv.y), 0);
    gl_FragColor = vec4(abs(sin(u_time)), 1.0, 0.0, 1.0);

}







