"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

// ---------------------------------------------------------------------------
// Ashima Arts / Stefan Gustavson "webgl-noise" 3D simplex noise (MIT-style,
// ubiquitous reference implementation). Injected into the vertex shader below.
// ---------------------------------------------------------------------------
const SNOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

// ── Tune the leaf's scale here ──────────────────────────────────────────
// The model is authored at its own arbitrary size; scale it to roughly this
// tall (matches the footprint the procedural leaf used to occupy).
const LEAF_LENGTH = 2.75;
const LEAF_MODEL_URL = "/models/leaf.glb";
// The model has a long stem trailing below the main blade, so its bounding-
// box center (used to recenter it) sits well below the blade's own visual
// center of mass — centering on that box alone pushes the blade up near the
// header. Nudge the whole mesh down so the blade sits centered in frame and
// the stem trails off toward where the base-hugging dust particles already
// concentrate.
const LEAF_Y_OFFSET = -0.1;

// ---------------------------------------------------------------------------
// Glowing dust particles — fully GPU-driven drift and twinkle, no per-frame
// CPU attribute updates. Tune PARTICLE_COUNT and the drift/twinkle constants
// in the shaders below.
// ---------------------------------------------------------------------------
const PARTICLE_COUNT = 200;
const DUST_DRIFT_RANGE = 2.2;

function createDustGeometry() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const phases = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const tints = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Biased toward the leaf itself (pow > 1 clusters more near r=0) rather
    // than spread evenly across the whole frame — keep this tight so the
    // dust reads as hugging the leaf, not scattered across the section.
    // Centered at local origin — the Points object is repositioned to
    // follow the leaf instead of baking an x offset into the geometry.
    const r = Math.pow(Math.random(), 1.8) * 0.85;
    const theta = Math.random() * Math.PI * 2;
    // Biased toward the base (negative local Y, where the leaf's stem sits)
    // rather than spread evenly — reads as wisps of energy gathering at the
    // stem and rising/dissipating through the leaf, not ambient scatter.
    const yBias = Math.pow(Math.random(), 2.4);
    positions[i * 3 + 0] = Math.cos(theta) * r;
    positions[i * 3 + 1] = (yBias - 0.5) * DUST_DRIFT_RANGE;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.2 + Math.random() * 0.5;
    sizes[i] = 0.25 + Math.random() * 0.55;
    tints[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 1));
  return geometry;
}

const DUST_VERTEX_GLSL = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aPhase;
attribute float aSpeed;
attribute float aSize;
attribute float aTint;
varying float vTint;
varying float vTwinkle;
varying float vDepthFade;
varying float vDissipate;

void main() {
  vTint = aTint;

  vec3 pos = position;
  // Gentle orbiting drift — adjust the 0.07 amplitude to change how far
  // particles wander from their base position. Kept small so they stay
  // hugging the leaf instead of wandering across the section.
  pos.x += sin(uTime * aSpeed + aPhase * 6.2831853) * 0.07;
  pos.z += cos(uTime * aSpeed * 0.8 + aPhase * 6.2831853) * 0.07;

  // Rise and dissipate: each particle floats upward through its band, then
  // fades out before it loops back to the bottom — never an abrupt teleport.
  float range = ${DUST_DRIFT_RANGE.toFixed(2)};
  float halfRange = ${(DUST_DRIFT_RANGE / 2).toFixed(2)};
  float riseRaw = mod(position.y + uTime * aSpeed * 0.18 + halfRange, range);
  pos.y = riseRaw - halfRange;
  float riseFrac = riseRaw / range;
  vDissipate = pow(sin(riseFrac * 3.14159265), 0.7);

  vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * aSpeed * 2.2 + aPhase * 6.2831853));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  // Fade particles that drift toward/away from camera for a depth cue.
  vDepthFade = smoothstep(7.0, 3.0, -mvPosition.z);
  gl_PointSize = aSize * uPixelRatio * (60.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const DUST_FRAGMENT_GLSL = /* glsl */ `
varying float vTint;
varying float vTwinkle;
varying float vDepthFade;
varying float vDissipate;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float alpha = smoothstep(0.5, 0.0, d);
  vec3 colorA = vec3(0.204, 0.827, 0.6);   // emerald, matches --color-accent-1
  vec3 colorB = vec3(0.133, 0.827, 0.933); // cyan, matches --color-accent-2
  vec3 color = mix(colorA, colorB, vTint);
  gl_FragColor = vec4(color, alpha * vTwinkle * vDepthFade * vDissipate * 0.5);
}
`;

type ShaderRef = { uniforms: { [key: string]: THREE.IUniform } } | null;

export default function LeafScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // The leaf sits toward the right edge, but a FIXED x offset only works
    // for wide desktop aspect ratios: the camera's horizontal field of view
    // shrinks with a narrow (tall/mobile) aspect, so a fixed offset tuned
    // for desktop can land entirely outside the frustum on a phone — the
    // leaf renders, just off-screen. Scale the offset to the actual visible
    // width instead, so it stays on-screen (and reads as "near the edge")
    // at every viewport size.
    function computeLeafX(aspect: number) {
      const vFov = (camera.fov * Math.PI) / 180;
      const halfHeight = Math.tan(vFov / 2) * camera.position.z;
      const halfWidth = halfHeight * aspect;
      return Math.min(2.1, halfWidth * 0.62);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // The leaf is a user-supplied model (optimized from ~34MB down to ~1.8MB
    // via gltf-transform: meshopt-compressed geometry + 512px WebP textures —
    // see the git history for the original asset). Loading is async, so wrap
    // it in a persistent Group added to the scene immediately: rotation/tilt
    // below always targets this group, whether or not the model has finished
    // loading yet, instead of scattering null-checks through animate()/resize().
    const initialAspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const mesh = new THREE.Group();
    const BASE_POSITION = new THREE.Vector3(computeLeafX(initialAspect), LEAF_Y_OFFSET, 0);
    const BASE_ROTATION_Z = -0.15;
    mesh.position.copy(BASE_POSITION);
    mesh.rotation.z = BASE_ROTATION_Z;
    scene.add(mesh);

    // Populated once the model loads; animate()/cleanup guard on these being set.
    let shaderRef: ShaderRef = null;
    let activeMesh: THREE.Mesh | null = null;
    let loadedGeometry: THREE.BufferGeometry | null = null;
    let loadedMaterial: THREE.MeshPhysicalMaterial | null = null;
    let halfHeight = 1;

    const gltfLoader = new GLTFLoader();
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    gltfLoader.load(
      LEAF_MODEL_URL,
      (gltf) => {
        let found: THREE.Mesh | null = null;
        gltf.scene.traverse((child) => {
          if (!found && (child as THREE.Mesh).isMesh) found = child as THREE.Mesh;
        });
        if (!found) return;
        const loadedMesh = found as THREE.Mesh;

        const geometry = loadedMesh.geometry;
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
        halfHeight = Math.max(size.y / 2, 0.0001);

        loadedMesh.scale.setScalar(LEAF_LENGTH / Math.max(size.y, 0.0001));

        // Reuse the model's own normal map (if any) for its sculpted surface
        // detail, but replace the base material entirely with our own so the
        // color/glass/glow treatment matches the rest of the brand regardless
        // of whatever the source model was textured with.
        const sourceMaterial = Array.isArray(loadedMesh.material)
          ? loadedMesh.material[0]
          : loadedMesh.material;
        const normalMap =
          sourceMaterial && "normalMap" in sourceMaterial
            ? (sourceMaterial as THREE.MeshStandardMaterial).normalMap
            : null;

        const material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#1f6b4f"),
          normalMap: normalMap ?? undefined,
          metalness: 0.1,
          roughness: 0.3,
          clearcoat: 1.0,
          clearcoatRoughness: 0.15,
          transmission: 0.4,
          thickness: 0.5,
          iridescence: 0.5,
          iridescenceIOR: 1.3,
          ior: 1.4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });

        // Inject fluid noise + mouse-ripple displacement, plus a magical
        // fresnel/rim glow — into the built-in physical shader, so we keep
        // Three's PBR lighting for free. The glow uses view-angle (fresnel)
        // and local vertex position rather than UVs, since this is an
        // imported model whose UV layout we don't control (unlike the old
        // procedural leaf's own vein texture, which relied on knowing the
        // UV mapping exactly).
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 };
          shader.uniforms.uMouseLocal = { value: new THREE.Vector3(999, 999, 0) };
          shader.uniforms.uMouseStrength = { value: 0 };
          shader.uniforms.uGlowA = { value: new THREE.Color("#34d399") };
          shader.uniforms.uGlowB = { value: new THREE.Color("#22d3ee") };
          shader.uniforms.uHalfHeight = { value: halfHeight };

          shader.vertexShader =
            `
            uniform float uTime;
            uniform vec3 uMouseLocal;
            uniform float uMouseStrength;
            varying vec3 vLocalPos;
            ${SNOISE_GLSL}
            ` + shader.vertexShader;

          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>

            vLocalPos = position;

            // Ambient ripple: adjust 1.4 (spatial scale) and 0.18 (time speed)
            // to change how tight / fast the fluid ripples move.
            float ambientNoise = snoise(vec3(position.x * 1.4, position.y * 1.4, uTime * 0.18));

            // Localized ripple where the mouse recently moved fast.
            float mouseDist = distance(position.xy, uMouseLocal.xy);
            float mouseRipple = uMouseStrength * exp(-mouseDist * 3.2) *
              sin(mouseDist * 10.0 - uTime * 4.0);

            // Adjust 0.05 to change how strongly the surface bulges with the ripple.
            float displacement = ambientNoise * 0.05 + mouseRipple * 0.12;
            transformed += normal * displacement;
            `
          );

          shader.fragmentShader =
            `
            uniform float uTime;
            uniform vec3 uGlowA;
            uniform vec3 uGlowB;
            uniform float uHalfHeight;
            varying vec3 vLocalPos;
            ` + shader.fragmentShader;

          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_fragment>",
            `
            // Magical glow, two parts:
            // 1. A fresnel rim — brightest at grazing angles, like light
            //    catching the edge of glass — using the surface normal and
            //    view direction Three already provides, so it works
            //    regardless of this model's UV layout.
            // 2. A hot core gathered near the base (negative local Y, where
            //    this model's stem sits) fading toward white at its
            //    brightest point, using the mesh's own measured half-height
            //    rather than a guessed constant.
            vec3 viewDir = normalize(vViewPosition);
            vec3 glowNormal = normalize(vNormal);
            float fresnel = pow(1.0 - max(dot(glowNormal, viewDir), 0.0), 2.2);
            float pulse = sin(uTime * 1.6) * 0.5 + 0.5;
            vec3 rimGlow = mix(uGlowA, uGlowB, fresnel);

            float baseAmount = clamp(-vLocalPos.y / uHalfHeight, 0.0, 1.0);
            float core = smoothstep(0.0, 0.85, baseAmount);
            vec3 hotColor = mix(rimGlow, vec3(1.0), core * 0.7);

            gl_FragColor.rgb += rimGlow * fresnel * (0.6 + 0.6 * pulse) * 1.3;
            gl_FragColor.rgb += hotColor * core * (0.5 + 0.5 * pulse) * 0.9;

            #include <dithering_fragment>
            `
          );

          shaderRef = shader;
        };

        loadedMesh.material = material;
        loadedGeometry = geometry;
        loadedMaterial = material;
        activeMesh = loadedMesh;
        mesh.add(loadedMesh);
      },
      undefined,
      (error) => {
        console.error("Failed to load leaf model:", error);
      }
    );

    // ── Glowing dust particles around the leaf ─────────────────────────────
    const dustGeometry = createDustGeometry();
    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: DUST_VERTEX_GLSL,
      fragmentShader: DUST_FRAGMENT_GLSL,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.position.x = BASE_POSITION.x;
    scene.add(dust);

    const ambient = new THREE.AmbientLight(0x3a4a43, 1.1);
    scene.add(ambient);
    const key = new THREE.PointLight(0x34d399, 6, 12);
    key.position.set(2, 1.4, 2.5);
    scene.add(key);
    const rim = new THREE.PointLight(0x22d3ee, 5, 12);
    rim.position.set(-1.8, -1, 2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(0, 2, 4);
    scene.add(fill);

    // ── Mouse interaction: the leaf stays anchored in place and reacts by
    // tilting toward the cursor (like a held object catching the light),
    // not by translating across the section. A raycast onto the leaf's own
    // plane still feeds the localized vein/noise ripple below.
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0, 0);
    const hitPoint = new THREE.Vector3();
    const prevPointerPx = new THREE.Vector2();
    let mouseSpeed = 0;
    let hasPointer = false;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointerNdc.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);

      // Adjust 0.32 / 0.18 to make the tilt more or less pronounced.
      targetTiltY = pointerNdc.x * 0.32;
      targetTiltX = -pointerNdc.y * 0.18;

      if (hasPointer) {
        const dx = e.clientX - prevPointerPx.x;
        const dy = e.clientY - prevPointerPx.y;
        mouseSpeed = Math.min(Math.sqrt(dx * dx + dy * dy), 80);
      }
      prevPointerPx.set(e.clientX, e.clientY);
      hasPointer = true;
    }
    window.addEventListener("pointermove", onPointerMove);

    // ── Resize handling ─────────────────────────────────────────────────
    function resize() {
      if (!container) return;
      const { clientWidth: w, clientHeight: h } = container;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      BASE_POSITION.x = computeLeafX(camera.aspect);
      mesh.position.x = BASE_POSITION.x;
      dust.position.x = BASE_POSITION.x;
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ── Animation loop ──────────────────────────────────────────────────
    // Gated by both tab visibility and viewport intersection: this scene
    // renders every frame forever otherwise, burning CPU/GPU (and stealing
    // main-thread time from clicks elsewhere on the page) even while the
    // hero is scrolled far out of view.
    const startTime = performance.now();
    let rafId = 0;
    let mouseStrength = 0;
    let loopRunning = false;
    let isOnScreen = true;

    function animate() {
      if (!isOnScreen) {
        loopRunning = false;
        return;
      }
      rafId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      if (hasPointer) {
        raycaster.setFromCamera(pointerNdc, camera);
        raycaster.ray.intersectPlane(dragPlane, hitPoint);
      }

      // Ease/inertia on the tilt: adjust 0.05 to make it snappier (higher)
      // or lazier (lower). The leaf's position never moves — only rotation.
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      // Small continuous idle motion so it still reads as "alive" with the
      // cursor away, plus a gentle bob — never a full traversal of the section.
      mesh.rotation.x = tiltX + Math.sin(elapsed * 0.2) * 0.03;
      mesh.rotation.y = tiltY + Math.sin(elapsed * 0.15) * 0.05;
      mesh.rotation.z = BASE_ROTATION_Z + Math.sin(elapsed * 0.18) * 0.02;
      mesh.position.y = BASE_POSITION.y + Math.sin(elapsed * 0.3) * 0.03;

      // Decay the speed-triggered ripple strength back down each frame.
      mouseStrength += (mouseSpeed / 80 - mouseStrength) * 0.15;
      mouseSpeed *= 0.85;

      if (shaderRef && activeMesh) {
        shaderRef.uniforms.uTime.value = elapsed;
        shaderRef.uniforms.uMouseStrength.value = mouseStrength;
        // Mouse point in the loaded mesh's own local space (not the wrapping
        // group's — the shader's raw `position` attribute is pre-scale/offset,
        // in the mesh's own space) for the shader's ripple falloff.
        const localMouse = activeMesh.worldToLocal(hitPoint.clone());
        shaderRef.uniforms.uMouseLocal.value.set(localMouse.x, localMouse.y, 0);
      }
      dustMaterial.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    }

    function startLoop() {
      if (loopRunning || reduced) return;
      loopRunning = true;
      animate();
    }
    function stopLoop() {
      loopRunning = false;
      cancelAnimationFrame(rafId);
    }

    // Respect reduced motion: render one static frame instead of looping.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      resize();
      renderer.render(scene, camera);
    } else {
      startLoop();
    }

    // Pause the loop while the tab is hidden or the hero is scrolled out of view.
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
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      loadedGeometry?.dispose();
      loadedMaterial?.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}
