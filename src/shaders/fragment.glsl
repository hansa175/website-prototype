precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

// iq hash
vec2 hash(vec2 p) {
    p = vec2(
        dot(p, vec2(2127.1, 81.17)),
        dot(p, vec2(1269.5, 283.37))
    );
    return fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i), f),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float ratio = uResolution.x / uResolution.y;

    vec2 tuv = uv - 0.5;

    float degree = noise(vec2(uTime * 0.1, tuv.x * tuv.y));

    tuv.y /= ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0));
    tuv.y *= ratio;

    float frequency = 5.0;
    float amplitude = 30.0;
    float speed = uTime * 2.0;

    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    // ===== BASE COLORS (unchanged palette) =====
// ===== TECH FLOW COLOR SYSTEM ===== 
vec3 midnight = vec3(0.03, 0.06, 0.14); 
vec3 cyan = vec3(0.18, 0.72, 0.85); 
vec3 indigo = vec3(0.36, 0.32, 0.78); 
vec3 amber = vec3(0.95, 0.62, 0.25);

// spatial masks 
float mx = S(-0.35, 0.25, (tuv * Rot(radians(-6.0))).x); 
float my = S(0.45, -0.4, tuv.y); 

// slow system-like time motion 
float tA = 0.5 + 0.5 * sin(uTime * 0.12); 
float tB = 0.5 + 0.5 * cos(uTime * 0.08); 

// base depth 
vec3 col = midnight;

// cyan data streams 
col = mix(col, cyan, mx); 

// indigo intelligence layer 
col = mix(col, indigo, my * tA); 

// amber = signal bursts (VERY controlled) 
col += amber * mx * my * tB * 0.45;

    // ===== CONTRAST & DEPTH (KEY PART) =====

    // directional depth shading
    float vignette = smoothstep(0.9, 0.2, length(uv - 0.5));
    col *= mix(0.85, 1.15, vignette);

    // perceptual contrast curve (NOT saturation)
    col = pow(col, vec3(0.85));

    // subtle luminance separation
    float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(col * 0.9, col * 1.1, luma);

    
/* ===== MOUSE INTERACTION: PASTEL PINK RING ===== */
vec2 m = uMouse; // normalized mouse [0,1]

// correct for screen aspect ratio for a perfect circle
vec2 aspectCorrectedUV = (uv - m) * vec2(uResolution.x / uResolution.y, 1.0);
float radius = 0.015;       // circle radius
float borderWidth = 0.002;  // ring thickness

// distance from pixel to mouse
float dist = length(aspectCorrectedUV);

// smooth ring mask
float ring = smoothstep(radius + borderWidth, radius, dist) 
           - smoothstep(radius, radius - borderWidth, dist);

// pastel pink color
vec3 pastelPink = vec3(1.0, 0.6, 0.8);

// apply only on the ring
col += pastelPink * ring * 1.0; // full brightness

    gl_FragColor = vec4(col, 1.0);
}
