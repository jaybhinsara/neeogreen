"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LAND_MASK_BASE64, LAND_MASK_HEIGHT, LAND_MASK_WIDTH } from "@/lib/land-mask";

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

function decodeMask() {
  const bin = atob(LAND_MASK_BASE64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function isLand(mask: Uint8Array, lat: number, lon: number) {
  const x = Math.min(LAND_MASK_WIDTH - 1, Math.floor(((lon + 180) / 360) * LAND_MASK_WIDTH));
  const y = Math.min(LAND_MASK_HEIGHT - 1, Math.max(0, Math.floor(((90 - lat) / 180) * LAND_MASK_HEIGHT)));
  const i = y * LAND_MASK_WIDTH + x;
  return ((mask[i >> 3] >> (i & 7)) & 1) === 1;
}

// lon 0 faces +z (the camera), y is up.
function toVec(lat: number, lon: number, r = 1) {
  const phi = lat * DEG;
  const theta = lon * DEG;
  return new THREE.Vector3(r * Math.cos(phi) * Math.sin(theta), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(theta));
}

function latLonOf(x: number, y: number, z: number) {
  const len = Math.hypot(x, y, z);
  return { lat: Math.asin(y / len) / DEG, lon: Math.atan2(x, z) / DEG };
}

// Splits an icosphere's triangles into land and ocean by testing each
// triangle's center against the mask, and returns deduplicated edges (so
// shared edges aren't drawn twice) plus the land triangles for a soft fill.
function partition(detail: number, mask: Uint8Array) {
  const geometry = new THREE.IcosahedronGeometry(1, detail);
  const pos = geometry.getAttribute("position").array as Float32Array;
  const landEdges = new Map<string, number[]>();
  const oceanEdges = new Map<string, number[]>();
  const oceanVertices = new Map<string, number[]>();
  const landTriangles: number[] = [];
  const key = (x: number, y: number, z: number) => `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;

  for (let i = 0; i < pos.length; i += 9) {
    const cx = pos[i] + pos[i + 3] + pos[i + 6];
    const cy = pos[i + 1] + pos[i + 4] + pos[i + 7];
    const cz = pos[i + 2] + pos[i + 5] + pos[i + 8];
    const { lat, lon } = latLonOf(cx, cy, cz);
    const land = isLand(mask, lat, lon);
    if (land) for (let k = 0; k < 9; k++) landTriangles.push(pos[i + k]);
    const edges = land ? landEdges : oceanEdges;
    for (const [a, b] of [
      [0, 1],
      [1, 2],
      [2, 0],
    ]) {
      const ia = i + a * 3;
      const ib = i + b * 3;
      const ka = key(pos[ia], pos[ia + 1], pos[ia + 2]);
      const kb = key(pos[ib], pos[ib + 1], pos[ib + 2]);
      const k = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      if (!edges.has(k)) edges.set(k, [pos[ia], pos[ia + 1], pos[ia + 2], pos[ib], pos[ib + 1], pos[ib + 2]]);
      if (!land) {
        oceanVertices.set(ka, [pos[ia], pos[ia + 1], pos[ia + 2]]);
      }
    }
  }
  geometry.dispose();
  const flat = (m: Map<string, number[]>) => new Float32Array([...m.values()].flat());
  return {
    landEdges: flat(landEdges),
    oceanEdges: flat(oceanEdges),
    oceanVertices: flat(oceanVertices),
    landTriangles: new Float32Array(landTriangles),
  };
}

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

    // Land: dense white mesh with a soft fill. Ocean: sparse mesh and dots.
    const mask = decodeMask();
    const dense = partition(lite ? 34 : 46, mask);
    const sparse = partition(7, mask);

    const landFillGeometry = track(new THREE.BufferGeometry());
    landFillGeometry.setAttribute("position", new THREE.BufferAttribute(dense.landTriangles, 3));
    const landFill = new THREE.Mesh(
      landFillGeometry,
      track(new THREE.MeshBasicMaterial({ color: 0xe9fff5, transparent: true, opacity: 0.16, depthWrite: false }))
    );
    landFill.scale.setScalar(1.002);
    spin.add(landFill);

    const lines = (array: Float32Array, opacity: number, radius: number) => {
      const geometry = track(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.BufferAttribute(array, 3));
      const segments = new THREE.LineSegments(
        geometry,
        track(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity, depthWrite: false }))
      );
      segments.scale.setScalar(radius);
      spin.add(segments);
    };
    lines(dense.landEdges, 0.5, 1.004);
    lines(sparse.oceanEdges, 0.26, 1.004);

    const dotMap = track(dotTexture(false));
    const glowMap = track(dotTexture(true));

    const oceanDotsGeometry = track(new THREE.BufferGeometry());
    oceanDotsGeometry.setAttribute("position", new THREE.BufferAttribute(sparse.oceanVertices, 3));
    const oceanDots = new THREE.Points(
      oceanDotsGeometry,
      track(
        new THREE.PointsMaterial({
          map: dotMap,
          color: 0xffffff,
          size: 0.026,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
        })
      )
    );
    oceanDots.scale.setScalar(1.005);
    spin.add(oceanDots);

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

    const intersection = new IntersectionObserver(([entry]) => (entry.isIntersecting ? startLoop() : stopLoop()));
    intersection.observe(container);
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopLoop();
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
