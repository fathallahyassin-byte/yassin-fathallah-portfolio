"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

/**
 * A single full-screen fragment shader: domain-warped noise ("molten ink")
 * tinted with the accent, a lens bulge + chromatic split around the pointer,
 * and film grain. Raw WebGL — no Three.js needed for one quad.
 */
const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = (octaves: number) => `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uIntro;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < ${octaves}; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 m = uMouse * vec2(aspect, 1.0) * 0.5;
  float d = length(p - m);
  float lens = exp(-d * d * 5.0);
  p -= (p - m) * 0.22 * lens;

  vec2 sp = p * 1.5 + vec2(0.0, uScroll * 0.6);
  float t = uTime;
  vec2 q = vec2(fbm(sp + vec2(0.0, t * 0.05)), fbm(sp + vec2(5.2, 1.3) - t * 0.04));
  vec2 r = vec2(fbm(sp + 3.0 * q + vec2(1.7, 9.2) + t * 0.03), fbm(sp + 3.0 * q + vec2(8.3, 2.8) - t * 0.02));
  vec2 w = sp + 3.2 * r;

  float ca = 0.015 + 0.05 * lens;
  vec3 f = vec3(fbm(w + vec2(ca, 0.0)), fbm(w), fbm(w - vec2(ca, 0.0)));

  vec3 accent = vec3(1.0, 0.30, 0.09);
  vec3 col = accent * pow(smoothstep(0.3, 0.9, f), vec3(2.0)) * 2.2;
  col += vec3(1.0, 0.94, 0.88) * pow(smoothstep(0.66, 1.0, f), vec3(3.0)) * 1.1;

  // Light pools bottom-right and follows the pointer.
  float pool = 1.0 - smoothstep(0.0, 1.6, length(p - vec2(0.42 * aspect, -0.32)));
  float mask = max(pool, lens * 0.9) + 0.1;
  col *= mask;

  // Vignette, grain, intro + scroll fade.
  col *= 1.0 - smoothstep(0.25, 1.5, length((vUv - 0.5) * vec2(aspect * 0.85, 1.0)));
  col += (hash(vUv * uRes + fract(t * 7.0) * 100.0) - 0.5) * 0.06;
  col *= uIntro * (1.0 - uScroll * 0.85);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function HeroCanvas({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return; // CSS fallback stays visible

    const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The image is soft by nature; render it small and let CSS upscale.
    const scale = mobile ? 0.35 : 0.5;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG(mobile ? 3 : 5));
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      time: gl.getUniformLocation(prog, "uTime"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      scroll: gl.getUniformLocation(prog, "uScroll"),
      intro: gl.getUniformLocation(prog, "uIntro"),
    };

    const state = { intro: 0, mx: 0.35, my: -0.2, tx: 0.35, ty: -0.2, scroll: 0 };

    const resize = () => {
      const w = Math.max(1, Math.round(el.clientWidth * scale));
      const h = Math.max(1, Math.round(el.clientHeight * scale));
      el.width = w;
      el.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.res, w, h);
    };

    const draw = (time: number) => {
      state.mx += (state.tx - state.mx) * 0.05;
      state.my += (state.ty - state.my) * 0.05;
      gl.uniform1f(u.time, time);
      gl.uniform2f(u.mouse, state.mx, state.my);
      gl.uniform1f(u.scroll, state.scroll);
      gl.uniform1f(u.intro, state.intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let visible = true;
    const t0 = performance.now();
    const tick = () => {
      if (visible && !document.hidden) draw((performance.now() - t0) / 1000 + 20);
    };

    const onMove = (e: PointerEvent) => {
      state.tx = (e.clientX / window.innerWidth) * 2 - 1;
      state.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      state.scroll = Math.min(1, window.scrollY / window.innerHeight);
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(24);
    });
    ro.observe(el);
    resize();

    const off = onIntroDone(() => {
      gsap.to(state, {
        intro: 1,
        duration: reduced ? 0 : 2.4,
        ease: "power2.inOut",
        onUpdate: () => reduced && draw(24),
      });
    });

    if (reduced) {
      state.intro = 1;
      draw(24);
    } else {
      gsap.ticker.add(tick);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      off();
      io.disconnect();
      ro.disconnect();
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      // Free GPU resources but keep the context: a remount reuses the same canvas.
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
