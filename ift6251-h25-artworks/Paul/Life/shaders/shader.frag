#ifdef GL_ES
precision mediump float;
#endif

uniform float threshold;
uniform vec2 resolution;
uniform float texelSize;
uniform sampler2D tex;
varying vec2 vTexCoord;

void main() {
    vec4 color = vec4(0.0);
    float texelSizeX = texelSize/resolution.x;
    float texelSizeY = texelSize/resolution.y;
    


    // Gaussian kernel weights
    float kernel[5];
    kernel[0] = 0.06136;
    kernel[1] = 0.24477;
    kernel[2] = 0.38774;
    kernel[3] = 0.24477;
    kernel[4] = 0.06136;
    // Perform the Gaussian blur
    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            vec2 offset = vec2(float(x)*texelSizeX, float(y)*texelSizeY);
            float weight = kernel[int(abs(float(x)))] * kernel[int(abs(float(y)))]; // 2D Gaussian weight
            color += texture2D(tex, vTexCoord + offset) * weight;
        }
    }


    float intensity = color.r;
    if (intensity < threshold) {
        color.rgb = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 0.0), pow(intensity / threshold,pow(2.7,2.)));
    } else {
        color.rgb = mix(vec3(0.0784, 0.8706, 0.8706), vec3(0.2314, 0.8078, 1.0), (intensity - threshold) / (1.-threshold));
    }

    gl_FragColor = color;
}
