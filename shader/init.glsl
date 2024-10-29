

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (2. * fragCoord - iResolution.xy) / iResolution.y;

    float a = abs(sin(iTime));

    fragColor = vec4(a, 1.0, 1.0, 1.);
}