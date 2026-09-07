"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/cn";
import { LeafIcon } from "./LeafIcon";

const SEGMENTS = [
  "Restaurants",
  "Cafés",
  "Cloud Kitchens",
  "QSR Chains",
  "D2C Food Brands",
  "Export Orders",
];

const SIM_RES = 256;
const SCROLL_PX_PER_SEC = 46;
const BG_COLOR = "#0b0f0d";
const TEXT_COLOR = "#9ca9a3";
const HIGHLIGHT_COLOR = "#5eead4";

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const QUAD_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SIM_FRAGMENT = `
  varying vec2 vUv;
  uniform sampler2D uState;
  uniform vec2 uTexel;
  uniform vec2 uDropUv;
  uniform float uDropStrength;
  uniform float uDropRadius;

  void main() {
    vec4 state = texture2D(uState, vUv);
    float height = state.r;
    float velocity = state.g;

    float sum =
      texture2D(uState, vUv + vec2(uTexel.x, 0.0)).r +
      texture2D(uState, vUv - vec2(uTexel.x, 0.0)).r +
      texture2D(uState, vUv + vec2(0.0, uTexel.y)).r +
      texture2D(uState, vUv - vec2(0.0, uTexel.y)).r;

    velocity += (sum * 0.25 - height) * 2.0;
    velocity *= 0.985;
    height += velocity;

    if (uDropStrength > 0.0) {
      float dist = length(vUv - uDropUv);
      float drop = 1.0 - smoothstep(0.0, uDropRadius, dist);
      height += drop * uDropStrength;
    }

    gl_FragColor = vec4(height, velocity, 0.0, 1.0);
  }
`;

const COMPOSE_FRAGMENT = `
  varying vec2 vUv;
  uniform sampler2D uState;
  uniform sampler2D uText;
  uniform vec2 uTexel;
  uniform float uOffsetX;
  uniform vec3 uBgColor;
  uniform vec3 uTextColor;
  uniform vec3 uHighlightColor;

  void main() {
    float hL = texture2D(uState, vUv - vec2(uTexel.x, 0.0)).r;
    float hR = texture2D(uState, vUv + vec2(uTexel.x, 0.0)).r;
    float hD = texture2D(uState, vUv - vec2(0.0, uTexel.y)).r;
    float hU = texture2D(uState, vUv + vec2(0.0, uTexel.y)).r;

    vec3 normal = normalize(vec3(hL - hR, hD - hU, 1.0));
    vec2 distortion = normal.xy * 0.07;

    vec2 textUv = vec2(vUv.x + uOffsetX, vUv.y) + distortion;
    float glyph = texture2D(uText, textUv).a;

    vec3 color = mix(uBgColor, uTextColor, glyph);

    float specular = pow(max(dot(normal, normalize(vec3(0.3, 0.4, 0.85))), 0.0), 26.0);
    color += uHighlightColor * specular * 1.3;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {SEGMENTS.map((s) => (
        <span key={s} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-2xl uppercase tracking-[-0.01em] text-muted-on-dark md:px-10 md:text-4xl">
            {s}
          </span>
          <LeafIcon className="h-4 w-auto shrink-0 opacity-50 md:h-5" />
        </span>
      ))}
    </div>
  );
}

function RippleMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsWebGL()) {
      setUseFallback(true);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let rafId = 0;
    let loopWidth = 1;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader: SIM_FRAGMENT,
      uniforms: {
        uState: { value: null as THREE.Texture | null },
        uTexel: { value: new THREE.Vector2(1 / SIM_RES, 1 / SIM_RES) },
        uDropUv: { value: new THREE.Vector2(0.5, 0.5) },
        uDropStrength: { value: 0 },
        uDropRadius: { value: 0.045 },
      },
    });
    const simScene = new THREE.Scene();
    simScene.add(new THREE.Mesh(quadGeo, simMaterial));

    const rtOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(SIM_RES, SIM_RES, rtOptions);
    renderer.setRenderTarget(rtA);
    renderer.clear();
    renderer.setRenderTarget(rtB);
    renderer.clear();
    renderer.setRenderTarget(null);

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d")!;
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.wrapS = THREE.RepeatWrapping;
    textTexture.wrapT = THREE.ClampToEdgeWrapping;
    textTexture.generateMipmaps = false;
    textTexture.minFilter = THREE.LinearFilter;

    let leafLoaded = false;
    const leafImg = new Image();
    leafImg.onload = () => {
      leafLoaded = true;
      drawText();
    };
    leafImg.src = "/logo/icon-mono-white.svg";

    function fontFamily() {
      const probe = document.createElement("span");
      probe.className = "font-display";
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      document.body.appendChild(probe);
      const family = getComputedStyle(probe).fontFamily;
      document.body.removeChild(probe);
      return family;
    }

    function drawText() {
      const cssHeight = canvas!.clientHeight || 56;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const fontSize = Math.round(cssHeight * 0.44);
      const gap = Math.round(fontSize * 1.1);
      const leafSize = Math.round(fontSize * 0.9);
      const font = `600 ${fontSize}px ${fontFamily()}`;

      textCtx.font = font;
      const widths = SEGMENTS.map((s) => textCtx.measureText(s.toUpperCase()).width);
      const totalWidth = widths.reduce((sum, w) => sum + w + gap * 2 + leafSize, 0);

      const cssWidth = Math.max(1, Math.round(totalWidth));
      textCanvas.width = Math.round(cssWidth * dpr);
      textCanvas.height = Math.round(cssHeight * dpr);
      textCtx.scale(dpr, dpr);
      textCtx.font = font;
      textCtx.textBaseline = "middle";
      textCtx.fillStyle = "#ffffff";
      textCtx.clearRect(0, 0, cssWidth, cssHeight);

      let x = 0;
      for (let i = 0; i < SEGMENTS.length; i++) {
        const label = SEGMENTS[i].toUpperCase();
        textCtx.fillText(label, x, cssHeight / 2);
        x += widths[i] + gap;
        if (leafLoaded) {
          textCtx.globalAlpha = 0.6;
          textCtx.drawImage(leafImg, x, cssHeight / 2 - leafSize / 2, leafSize, leafSize);
          textCtx.globalAlpha = 1;
        }
        x += leafSize + gap;
      }

      textTexture.needsUpdate = true;
      loopWidth = cssWidth;
    }

    drawText();

    const composeMaterial = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader: COMPOSE_FRAGMENT,
      uniforms: {
        uState: { value: rtA.texture as THREE.Texture },
        uText: { value: textTexture },
        uTexel: { value: new THREE.Vector2(1 / SIM_RES, 1 / SIM_RES) },
        uOffsetX: { value: 0 },
        uBgColor: { value: new THREE.Color(BG_COLOR) },
        uTextColor: { value: new THREE.Color(TEXT_COLOR) },
        uHighlightColor: { value: new THREE.Color(HIGHLIGHT_COLOR) },
      },
    });
    const composeScene = new THREE.Scene();
    composeScene.add(new THREE.Mesh(quadGeo, composeMaterial));

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      drawText();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const pointer = { x: 0.5, y: 0.5, lastX: 0.5, lastY: 0.5, active: false };
    let clickDrop = false;

    function setPointerFromEvent(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = 1 - (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    }

    function onPointerMove(e: PointerEvent) {
      setPointerFromEvent(e);
    }
    function onPointerDown(e: PointerEvent) {
      setPointerFromEvent(e);
      clickDrop = true;
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onPointerLeave);

    function animate(now: number) {
      if (disposed) return;

      composeMaterial.uniforms.uOffsetX.value = ((now / 1000) * SCROLL_PX_PER_SEC) / Math.max(loopWidth, 1) % 1;

      const moved =
        pointer.active &&
        (Math.abs(pointer.x - pointer.lastX) > 0.0008 || Math.abs(pointer.y - pointer.lastY) > 0.0008);
      simMaterial.uniforms.uDropStrength.value = clickDrop ? 1.1 : moved ? 0.55 : 0;
      simMaterial.uniforms.uDropUv.value.set(pointer.x, pointer.y);
      pointer.lastX = pointer.x;
      pointer.lastY = pointer.y;
      clickDrop = false;

      simMaterial.uniforms.uState.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);
      renderer.setRenderTarget(null);

      const tmp = rtA;
      rtA = rtB;
      rtB = tmp;

      composeMaterial.uniforms.uState.value = rtA.texture;
      renderer.render(composeScene, camera);

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      rtA.dispose();
      rtB.dispose();
      textTexture.dispose();
      quadGeo.dispose();
      simMaterial.dispose();
      composeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden border-y border-line-on-dark py-6 md:py-8">
      <canvas
        ref={canvasRef}
        className={cn("block h-10 w-full touch-none md:h-14", useFallback && "hidden")}
      />
      {useFallback && (
        <div className="-my-6 flex w-max animate-marquee md:-my-8">
          <Row />
          <Row />
        </div>
      )}
    </div>
  );
}

export function TrustedBy() {
  return <RippleMarquee />;
}
