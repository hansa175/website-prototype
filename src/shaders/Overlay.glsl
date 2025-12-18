precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

const float PI = 3.14159265359;

void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    // fragment position in 3d space
    vec3 pos = vec3(fragCoord.xy, uResolution.y / 2.0);

    // normalized direction from center
    vec3 p = normalize(pos * 2.0 - vec3(uResolution.xy, 0.0));

    /* ===== MOUSE INTERACTION (SDF / STRUCTURE) ===== */
    vec2 m = uMouse * uResolution;
    vec2 dir = fragCoord - m;
    float md = length(dir) / uResolution.y;

    // localized angular distortion
    float mouseField = exp(-md * 6.0);
    p.xy += normalize(vec2(dir.y, -dir.x)) * mouseField * 0.04;
    /* ============================================= */

    float sdf = length(p.xy);
    sdf -= 0.4;

    float anim = (sin(uTime * 1.5) + 1.0) / 2.0;
    float freq = 8.0;

    float angle = atan(p.x, p.y);
    float amp = 0.03;

    sdf -= sin((angle * freq * anim) + PI / 2.0) * amp;

    // absolute distance to edge
    sdf = abs(sdf);

    // ===== HARD EDGE MASK =====
    float edge = smoothstep(0.006, 0.0, sdf);

    // ===== SATURATED COLOR =====
    vec3 color = vec3(
        sin(angle) + cos(angle),
        -cos(angle),
        -sin(angle)
    );

    color = abs(normalize(color));
    color = pow(color, vec3(0.7));

    gl_FragColor = vec4(color * edge, edge);
}
