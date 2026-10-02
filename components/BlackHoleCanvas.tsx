"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "framer-motion";

// A stylized, film-style black hole drawn in one full-screen fragment
// shader: a crisp black shadow, a hairline photon ring, the lensed far side
// of the disk arching over and under the shadow, and a flat, edge-on disk
// band crossing in front, all with streaky plasma flowing through them and
// the left side brighter (Doppler beaming). Colors run emerald → mint →
// white-hot. Not a physical simulation; a cheap 2D approximation of the look.

const VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScale;
uniform float uGlow;
uniform vec2 uOffset;
// Light streaks circling the edge: x = head angle (radians, y up),
// y = radius as a multiple of the shadow radius, z = arc length (radians),
// w = brightness. Unused slots have w = 0.
uniform vec4 uStreaks[16];

const vec3 NIGHT = vec3(0.012, 0.018, 0.015);
const vec3 EMERALD = vec3(0.039, 0.604, 0.396);
const vec3 MINT = vec3(0.557, 0.961, 0.804);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
// Smooth -1..1 curve (GLSL ES 1.0 has no tanh).
float softSign(float x) { return x / (1.0 + abs(x)); }
// Light intensity to color: emerald glow, mint body, white-hot peaks.
vec3 ramp(float i) {
  float t = 1.0 - exp(-i * 1.35);
  vec3 c = mix(EMERALD, MINT, smoothstep(0.08, 0.55, t));
  c = mix(c, vec3(1.0), smoothstep(0.55, 0.95, t));
  return c * t;
}

void main() {
  float m = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes - uOffset) / (0.5 * m);
  float R = 0.42 * uScale;
  float d = length(p);
  float ang = atan(p.y, p.x);
  float t = uTime;

  // Space around the hole: near-black, with emerald creeping in at the edges.
  vec3 col = mix(NIGHT, EMERALD * 0.55, smoothstep(1.05, 2.2, d));

  // Lensed far side of the disk: a halo hugging the shadow, thick over the
  // top and under the bottom, thin at the sides, streaming around the edge.
  float halo = 0.0;
  if (d > R) {
    float x = d - R;
    float s = abs(sin(ang));
    float w = R * (0.045 + 0.3 * pow(s, 1.5));
    float arch = exp(-x / w) * smoothstep(0.0, R * 0.02, x);
    // Low frequency around the ring, high across it: long streaks that
    // flow around the edge rather than an even grain.
    float n = fbm(vec2(ang * 2.4 - t * 0.3, x / R * 26.0));
    arch *= 0.5 + 0.95 * n;
    arch *= 1.0 - 0.45 * cos(ang);
    halo += arch * 1.15;
    // Hairline photon ring right at the edge of the shadow.
    float ring = (d - R * 1.012) / (R * 0.006 + 0.0015);
    halo += exp(-ring * ring) * 2.4;
  }
  // Streaks of matter caught by the hole: hairline arcs bending along the
  // edge, brightest at the head and fading along the tail.
  float streak = 0.0;
  if (d > R * 0.8 && d < R * 1.3) {
    float px = 2.0 / m;
    for (int i = 0; i < 16; i++) {
      vec4 s = uStreaks[i];
      if (s.w > 0.0) {
        float dr = (d - s.y * R) / (px * 2.1);
        float behind = mod(ang - s.x, 6.2831853);
        if (behind < s.z) {
          float along = 1.0 - behind / s.z;
          streak += exp(-dr * dr) * along * along * s.w;
        }
      }
    }
  }

  col += ramp(halo * uGlow + streak * 4.5);

  // The shadow: pure black with a crisp edge.
  float shadow = 1.0 - smoothstep(R * 0.996, R * 1.004, d);
  col = mix(col, vec3(0.0), shadow);

  // Front of the disk: a flat band crossing in front of the shadow, thin at
  // the center and thickening outward, brighter on the left, flowing.
  float bandH = R * (0.016 + 0.05 * smoothstep(0.0, 3.0 * R, abs(p.x)));
  float band = exp(-abs(p.y) / bandH);
  float reach = 1.0 / (1.0 + pow(abs(p.x) / (R * 3.2), 2.0));
  float bn = fbm(vec2(p.x / R * 2.2 + t * 0.5, p.y / bandH * 0.6));
  float bandI = band * reach * (0.45 + 0.95 * bn) * (1.0 - 0.4 * softSign(p.x / R)) * 1.5;
  col += ramp(bandI * uGlow);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

export default function BlackHoleCanvas({
  scale,
  glow,
  offsetX,
  offsetY,
  streaks,
  className,
}: {
  scale: MotionValue<number>;
  glow: MotionValue<number>;
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
  streaks: RefObject<Float32Array>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const lite = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones render at 1x and 30fps: the look is soft glow, so resolution
    // matters less than keeping the scroll smooth.
    const dpr = Math.min(window.devicePixelRatio, lite ? 1 : 1.5);
    const frameMs = lite ? 1000 / 30 : 0;

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uScale = gl.getUniformLocation(program, "uScale");
    const uGlow = gl.getUniformLocation(program, "uGlow");
    const uOffset = gl.getUniformLocation(program, "uOffset");
    const uStreaks = gl.getUniformLocation(program, "uStreaks");

    function resize() {
      const w = Math.max(1, Math.round(canvas!.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas!.clientHeight * dpr));
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
      gl!.viewport(0, 0, w, h);
    }

    const start = performance.now();
    function draw(now: number) {
      resize();
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, reduced ? 0 : (now - start) / 1000);
      gl!.uniform1f(uScale, scale.get());
      gl!.uniform1f(uGlow, glow.get());
      // CSS pixels (y down) to device pixels (y up).
      gl!.uniform2f(uOffset, offsetX.get() * dpr, -offsetY.get() * dpr);
      gl!.uniform4fv(uStreaks, streaks.current);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    let raf = 0;
    let running = false;
    let last = 0;
    function tick(now: number) {
      if (now - last >= frameMs) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(tick);
    }
    function startLoop() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }
    function stopLoop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    draw(start);
    const intersection = new IntersectionObserver(([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()));
    intersection.observe(canvas);
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopLoop();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [scale, glow, offsetX, offsetY, streaks]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
