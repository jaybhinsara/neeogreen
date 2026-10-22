"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const DEG = Math.PI / 180;
const TILT = 0.32;
const AUTO_SPIN = 0.08; // rad/s
const HQ = { lat: 21.17, lon: 72.83 };
const DESTINATIONS = [
  { lat: 51.51, lon: -0.13 },
  { lat: 40.71, lon: -74.01 },
  { lat: 25.2, lon: 55.27 },
  { lat: 1.35, lon: 103.82 },
  { lat: -33.87, lon: 151.21 },
  { lat: 52.52, lon: 13.4 },
  { lat: 43.65, lon: -79.38 },
];
const ARC_SAMPLES = 64;

// lon 0 faces +z (the camera), y is up.
function toVec(lat: number, lon: number, r = 1) {
  const phi = lat * DEG;
  const theta = lon * DEG;
  return new THREE.Vector3(r * Math.cos(phi) * Math.sin(theta), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(theta));
}

// The land/ocean wireframe never changes, so it's computed once at build
// time (scripts/build-globe-mesh.mjs) and shipped as a small binary instead
// of splitting ~44k triangles on the main thread, which froze scrolling.
type GlobeMesh = {
  verts: Int16Array;
  landTris: Uint16Array;
  landEdges: Uint16Array;
  oceanEdges: Int16Array;
  oceanDots: Int16Array;
};

// compileAsync polls each shader on a timer; if a check throws or a browser
// never reports ready, its promise never settles. Cap the wait so the globe
// always appears (at worst compiling on its first frame, as before).
const compiledOrTimeout = (compile: Promise<unknown>) =>
  Promise.race([compile.catch(() => {}), new Promise((r) => setTimeout(r, 1500))]);

async function loadGlobeMesh(detail: number, signal: AbortSignal): Promise<GlobeMesh> {
  const res = await fetch(`/globe/mesh-${detail}.bin`, { signal });
  if (!res.ok) throw new Error(`globe mesh ${res.status}`);
  const buffer = await res.arrayBuffer();
  const [vertCount, landTriCount, landEdgeCount, oceanEdgeCount, oceanDotCount] = new Uint32Array(buffer, 0, 5);
  let offset = 20;
  const take = <T extends Int16Array | Uint16Array>(Type: { new (b: ArrayBuffer, o: number, l: number): T }, length: number) => {
    const view = new Type(buffer, offset, length);
    offset += length * 2;
    return view;
  };
  return {
    verts: take(Int16Array, vertCount * 3),
    landTris: take(Uint16Array, landTriCount),
    landEdges: take(Uint16Array, landEdgeCount),
    oceanEdges: take(Int16Array, oceanEdgeCount * 3),
    oceanDots: take(Int16Array, oceanDotCount * 3),
  };
}

// Int16 positions are unit-sphere coordinates scaled by 32767; a normalized
// attribute lets the GPU read them as-is.
const unitPositions = (array: Int16Array) => new THREE.BufferAttribute(array, 3, true);

function dotTexture(soft: boolean) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  if (soft) {
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(180,255,225,0.85)");
    g.addColorStop(1, "rgba(52,211,153,0)");
  } else {
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.55, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function GlobeScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const label = labelRef.current;
    if (!container || !label) return;

    const lite = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = "pan-y";
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7ff0c4, 1.4);
    rim.position.set(3, -1.5, -3);
    scene.add(rim);

    const tilt = new THREE.Group();
    tilt.rotation.x = TILT;
    scene.add(tilt);
    const spin = new THREE.Group();
    tilt.add(spin);

    const disposables: { dispose(): void }[] = [];
    const track = <T extends { dispose(): void }>(d: T) => {
      disposables.push(d);
      return d;
    };

    // Satin finish: rough enough that the lights spread into a soft sheen
    // rather than tight specular hotspots, which read as stray markers.
    const sphere = new THREE.Mesh(
      track(new THREE.SphereGeometry(1, 96, 64)),
      track(new THREE.MeshStandardMaterial({ color: 0x0fa36b, roughness: 0.7, metalness: 0.05 }))
    );
    spin.add(sphere);

    // Atmosphere: a back-facing shell that glows toward the limb.
    const atmosphere = new THREE.Mesh(
      track(new THREE.SphereGeometry(1.12, 64, 48)),
      track(
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: { uColor: { value: new THREE.Color(0x34d399) } },
          vertexShader: /* glsl */ `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
          fragmentShader: /* glsl */ `
            uniform vec3 uColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.58 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
              gl_FragColor = vec4(uColor, 1.0) * intensity * 0.75;
            }`,
        })
      )
    );
    tilt.add(atmosphere);

    const dotMap = track(dotTexture(false));
    const glowMap = track(dotTexture(true));

    // Land: dense white mesh with a soft fill. Ocean: sparse mesh and dots.
    // They arrive from the network a moment after the globe itself, so they
    // fade in rather than pop.
    const wireframe = new THREE.Group();
    const fadeIns: { material: THREE.Material; opacity: number }[] = [];
    let wireframeShownAt = 0;
    const fading = <M extends THREE.Material>(material: M, opacity: number) => {
      material.opacity = 0;
      fadeIns.push({ material, opacity });
      return track(material);
    };
    const meshAbort = new AbortController();
    loadGlobeMesh(lite ? 34 : 46, meshAbort.signal)
      .then((mesh) => {
        const landGeometry = track(new THREE.BufferGeometry());
        landGeometry.setAttribute("position", unitPositions(mesh.verts));
        landGeometry.setIndex(new THREE.BufferAttribute(mesh.landTris, 1));
        const landFill = new THREE.Mesh(
          landGeometry,
          fading(new THREE.MeshBasicMaterial({ color: 0xe9fff5, transparent: true, depthWrite: false }), 0.16)
        );
        landFill.scale.setScalar(1.002);
        wireframe.add(landFill);

        const landEdgeGeometry = track(new THREE.BufferGeometry());
        landEdgeGeometry.setAttribute("position", unitPositions(mesh.verts));
        landEdgeGeometry.setIndex(new THREE.BufferAttribute(mesh.landEdges, 1));
        const landLines = new THREE.LineSegments(
          landEdgeGeometry,
          fading(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }), 0.5)
        );
        landLines.scale.setScalar(1.004);
        wireframe.add(landLines);

        const oceanEdgeGeometry = track(new THREE.BufferGeometry());
        oceanEdgeGeometry.setAttribute("position", unitPositions(mesh.oceanEdges));
        const oceanLines = new THREE.LineSegments(
          oceanEdgeGeometry,
          fading(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }), 0.26)
        );
        oceanLines.scale.setScalar(1.004);
        wireframe.add(oceanLines);

        const oceanDotsGeometry = track(new THREE.BufferGeometry());
        oceanDotsGeometry.setAttribute("position", unitPositions(mesh.oceanDots));
        const oceanDots = new THREE.Points(
          oceanDotsGeometry,
          fading(
            new THREE.PointsMaterial({ map: dotMap, color: 0xffffff, size: 0.026, transparent: true, depthWrite: false }),
            0.9
          )
        );
        oceanDots.scale.setScalar(1.005);
        wireframe.add(oceanDots);
        // Compile its shaders off the main thread before it's first drawn.
        return compiledOrTimeout(renderer.compileAsync(wireframe, camera, scene));
      })
      .then(() => {
        if (meshAbort.signal.aborted) return;
        spin.add(wireframe);
        wireframeShownAt = performance.now();
      })
      .catch(() => {});

    // Arcs from the HQ to cities worldwide, each with a traveling pulse.
    const hqVec = toVec(HQ.lat, HQ.lon);
    const arcMaterial = track(
      new THREE.LineBasicMaterial({ color: 0xb6ffe0, transparent: true, opacity: 0.75, depthWrite: false })
    );
    const arcPaths = DESTINATIONS.map((dest) => {
      const to = toVec(dest.lat, dest.lon);
      const omega = hqVec.angleTo(to);
      const altitude = 0.06 + 0.26 * (omega / Math.PI);
      const rotationToDest = new THREE.Quaternion().setFromUnitVectors(hqVec, to);
      const points = Array.from({ length: ARC_SAMPLES + 1 }, (_, s) => {
        const t = s / ARC_SAMPLES;
        const step = new THREE.Quaternion().slerp(rotationToDest, t);
        return hqVec
          .clone()
          .applyQuaternion(step)
          .multiplyScalar(1 + altitude * Math.sin(Math.PI * t));
      });
      const geometry = track(new THREE.BufferGeometry().setFromPoints(points));
      spin.add(new THREE.Line(geometry, arcMaterial));
      return points;
    });

    // Each pulse is a small comet (a head and two fading trail sprites)
    // that fades in leaving Surat and fades out arriving, so it reads as a
    // signal traveling its arc rather than a stray glow on the surface.
    const COMET = [
      { lag: 0, size: 0.055, alpha: 1 },
      { lag: 0.025, size: 0.04, alpha: 0.5 },
      { lag: 0.05, size: 0.03, alpha: 0.25 },
    ];
    const comets = arcPaths.map(() =>
      COMET.map((part) => {
        const sprite = new THREE.Sprite(
          track(
            new THREE.SpriteMaterial({
              map: glowMap,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          )
        );
        sprite.scale.setScalar(part.size);
        spin.add(sprite);
        return { sprite, ...part };
      })
    );

    const cityGeometry = track(
      new THREE.BufferGeometry().setFromPoints(DESTINATIONS.map((d) => toVec(d.lat, d.lon, 1.006)))
    );
    spin.add(
      new THREE.Points(
        cityGeometry,
        track(new THREE.PointsMaterial({ map: dotMap, color: 0xb6ffe0, size: 0.045, transparent: true, depthWrite: false }))
      )
    );

    const hqGlow = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: glowMap, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    );
    hqGlow.position.copy(toVec(HQ.lat, HQ.lon, 1.01));
    spin.add(hqGlow);

    // Drag to spin, with inertia; auto-spin resumes after release.
    let rotation = -HQ.lon * DEG + 0.45;
    let velocity = 0;
    let tiltOffset = 0;
    let drag: { x: number; y: number; t: number } | null = null;

    function onPointerDown(e: PointerEvent) {
      drag = { x: e.clientX, y: e.clientY, t: performance.now() };
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    }
    function onPointerMove(e: PointerEvent) {
      if (!drag) return;
      const now = performance.now();
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      const dt = Math.max(now - drag.t, 1) / 1000;
      rotation += dx * 0.006;
      velocity = (dx * 0.006) / dt;
      tiltOffset = THREE.MathUtils.clamp(tiltOffset + dy * 0.004, -0.4, 0.4);
      drag = { x: e.clientX, y: e.clientY, t: now };
    }
    function onPointerUp(e: PointerEvent) {
      if (!drag) return;
      drag = null;
      renderer.domElement.releasePointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grab";
    }
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);

    function resize() {
      const { clientWidth: w, clientHeight: h } = container!;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const hqWorld = new THREE.Vector3();
    const hqNormal = new THREE.Vector3();
    let raf = 0;
    let running = false;
    let last = performance.now();
    const start = last;

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const seconds = (now - start) / 1000;

      if (!drag) {
        rotation += ((reduced ? 0 : AUTO_SPIN) + velocity) * dt;
        velocity *= Math.pow(0.04, dt);
        tiltOffset *= Math.pow(0.2, dt);
      }
      spin.rotation.y = rotation;
      tilt.rotation.x = TILT + tiltOffset;

      if (wireframeShownAt && fadeIns.length) {
        const k = reduced ? 1 : Math.min((now - wireframeShownAt) / 700, 1);
        for (const f of fadeIns) f.material.opacity = f.opacity * k;
        if (k === 1) fadeIns.length = 0;
      }

      if (!reduced) {
        arcPaths.forEach((points, i) => {
          const head = (seconds * 0.22 + i / arcPaths.length) % 1;
          for (const part of comets[i]) {
            const t = head - part.lag;
            if (t < 0) {
              part.sprite.material.opacity = 0;
              continue;
            }
            part.sprite.position.copy(points[Math.round(t * ARC_SAMPLES)]);
            part.sprite.material.opacity = part.alpha * Math.sin(Math.PI * t);
          }
        });
        hqGlow.scale.setScalar(0.16 + 0.05 * Math.sin(seconds * 3));
      } else {
        hqGlow.scale.setScalar(0.18);
      }

      renderer.render(scene, camera);

      // Pin the HTML label to the HQ marker, hidden when it rotates away.
      hqWorld.copy(hqGlow.position).applyMatrix4(spin.matrixWorld);
      hqNormal.copy(hqWorld).normalize();
      const facing = hqNormal.dot(camera.position.clone().sub(hqWorld).normalize());
      const screen = hqWorld.clone().project(camera);
      const x = ((screen.x + 1) / 2) * container!.clientWidth;
      const y = ((1 - screen.y) / 2) * container!.clientHeight;
      label!.style.transform = `translate(${x + 12}px, ${y - 28}px)`;
      label!.style.opacity = facing > 0.15 ? "1" : "0";

      raf = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stopLoop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // Drawing the first frame used to compile every shader right then, on
    // the main thread, freezing the scroll for a few hundred ms. Compile in
    // the background first and only start drawing once that's done.
    let ready = false;
    let inView = false;
    const maybeStart = () => {
      if (meshAbort.signal.aborted) return; // unmounted while compiling
      if (ready && inView && !document.hidden) startLoop();
      else stopLoop();
    };
    compiledOrTimeout(renderer.compileAsync(scene, camera)).then(() => {
      ready = true;
      maybeStart();
    });

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      maybeStart();
    });
    intersection.observe(container);
    const onVisibility = () => maybeStart();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopLoop();
      meshAbort.abort();
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div
        ref={labelRef}
        className="label-mono pointer-events-none absolute left-0 top-0 whitespace-nowrap text-white opacity-0 transition-opacity duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]"
      >
        Surat &middot; HQ
      </div>
    </div>
  );
}
