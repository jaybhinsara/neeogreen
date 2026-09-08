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

const SCROLL_PX_PER_SEC = 46;
const BG_COLOR = "#0b0f0d";
const TEXT_COLOR = "#9ca9a3";
const HIGHLIGHT_COLOR = "#5eead4";

const SPRING_STIFFNESS = 260;
const SPRING_DAMPING = 16;

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

const COMPOSE_FRAGMENT = `
  varying vec2 vUv;
  uniform sampler2D uText;
  uniform vec2 uResolution;
  uniform float uOffsetX;
  uniform vec3 uBgColor;
  uniform vec3 uTextColor;
  uniform vec3 uHighlightColor;
  uniform vec2 uMouseUv;
  uniform float uBubble;
  uniform float uRadiusPx;

  void main() {
    vec2 fragPx = vUv * uResolution;
    vec2 mousePx = uMouseUv * uResolution;
    vec2 delta = fragPx - mousePx;
    float dist = length(delta);

    float t = clamp(dist / uRadiusPx, 0.0, 1.0);
    float dome = smoothstep(1.0, 0.0, t) * uBubble;

    float mag = 1.0 - 0.55 * dome;
    vec2 sampleUv = (mousePx + delta * mag) / uResolution;

    vec2 wrappedUv = vec2(fract(sampleUv.x + uOffsetX), clamp(sampleUv.y, 0.0, 1.0));
    float glyph = texture2D(uText, wrappedUv).a;
    vec3 color = mix(uBgColor, uTextColor, glyph);

    vec2 n = delta / uRadiusPx;
    float z = sqrt(max(0.0, 1.0 - dot(n, n)));
    vec3 normal = normalize(vec3(n, z));
    vec3 lightDir = normalize(vec3(-0.35, 0.5, 0.8));

    float specular = pow(max(dot(normal, lightDir), 0.0), 10.0);
    float ring = smoothstep(0.55, 0.82, t) * smoothstep(1.0, 0.82, t) * uBubble;

    color = mix(color, uHighlightColor, dome * 0.14);
    color += uHighlightColor * specular * 0.9 * dome;
    color += uHighlightColor * ring * 0.8;

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
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarsePointer || !supportsWebGL()) {
      setUseFallback(true);
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let rafId = 0;
    let loopWidth = 1;
    let radiusPx = 60;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d")!;
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.wrapS = THREE.ClampToEdgeWrapping;
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
      radiusPx = fontSize * 1.9;
    }

    drawText();

    const composeMaterial = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX,
      fragmentShader: COMPOSE_FRAGMENT,
      uniforms: {
        uText: { value: textTexture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uOffsetX: { value: 0 },
        uBgColor: { value: new THREE.Color(BG_COLOR) },
        uTextColor: { value: new THREE.Color(TEXT_COLOR) },
        uHighlightColor: { value: new THREE.Color(HIGHLIGHT_COLOR) },
        uMouseUv: { value: new THREE.Vector2(0.5, 0.5) },
        uBubble: { value: 0 },
        uRadiusPx: { value: radiusPx },
      },
    });
    const composeScene = new THREE.Scene();
    composeScene.add(new THREE.Mesh(quadGeo, composeMaterial));

    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      drawText();
      composeMaterial.uniforms.uResolution.value.set(w, h);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const pointer = { x: 0.5, y: 0.5, active: false };
    let bubbleValue = 0;
    let bubbleVelocity = 0;

    function setPointerFromEvent(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = 1 - (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    }

    function onPointerMove(e: PointerEvent) {
      setPointerFromEvent(e);
    }
    function onPointerEnter(e: PointerEvent) {
      setPointerFromEvent(e);
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);

    let last = performance.now();
    let loopRunning = false;
    let isOnScreen = true;

    function animate(now: number) {
      if (disposed || !isOnScreen) {
        loopRunning = false;
        return;
      }
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      composeMaterial.uniforms.uOffsetX.value = (((now / 1000) * SCROLL_PX_PER_SEC) / Math.max(loopWidth, 1)) % 1;

      const target = pointer.active ? 1 : 0;
      const force = (target - bubbleValue) * SPRING_STIFFNESS - bubbleVelocity * SPRING_DAMPING;
      bubbleVelocity += force * dt;
      bubbleValue += bubbleVelocity * dt;

      composeMaterial.uniforms.uBubble.value = Math.max(0, bubbleValue);
      composeMaterial.uniforms.uMouseUv.value.set(pointer.x, pointer.y);
      composeMaterial.uniforms.uRadiusPx.value = radiusPx;

      renderer.render(composeScene, camera);

      rafId = requestAnimationFrame(animate);
    }

    function startLoop() {
      if (loopRunning) return;
      loopRunning = true;
      last = performance.now();
      rafId = requestAnimationFrame(animate);
    }
    function stopLoop() {
      loopRunning = false;
      cancelAnimationFrame(rafId);
    }

    startLoop();

    // Pause the loop while the tab is hidden or the strip is scrolled out of
    // view — otherwise this renders every frame forever, even when nobody
    // can see it, stealing main-thread time from clicks elsewhere.
    function onVisibility() {
      if (document.hidden) stopLoop();
      else if (isOnScreen) startLoop();
    }
    document.addEventListener("visibilitychange", onVisibility);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
        if (isOnScreen && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      textTexture.dispose();
      quadGeo.dispose();
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
