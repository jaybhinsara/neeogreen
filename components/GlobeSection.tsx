"use client";

import { useEffect, useRef } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

const R = 300;
const TILT = 0.38;
const MERIDIANS = 18;
const LATITUDES = [-60, -30, 0, 30, 60];
const SAMPLES = 64;
const ARC_SAMPLES = 48;
const SPIN = 0.07;
const DEG = Math.PI / 180;

type Vec = [number, number, number];

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

function toVec(latDeg: number, lonDeg: number): Vec {
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

// Spins the point around the polar axis, tilts the globe toward the viewer,
// and projects orthographically. A point lifted off the surface (h > 1)
// stays visible past the limb, so arcs curve over the horizon.
function project(v: Vec, rot: number, h = 1) {
  const x = v[0] * Math.cos(rot) + v[2] * Math.sin(rot);
  const z1 = v[2] * Math.cos(rot) - v[0] * Math.sin(rot);
  const y = v[1] * Math.cos(TILT) - z1 * Math.sin(TILT);
  const z = v[1] * Math.sin(TILT) + z1 * Math.cos(TILT);
  const visible = z >= 0 || (x * x + y * y) * h * h > 1;
  return { x: x * R * h, y: -y * R * h, visible };
}

function slerp(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  const s = Math.sin(omega);
  const ka = Math.sin((1 - t) * omega) / s;
  const kb = Math.sin(t * omega) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

function visiblePath(points: { x: number; y: number; visible: boolean }[]) {
  let d = "";
  let drawing = false;
  for (const p of points) {
    if (p.visible) {
      d += `${drawing ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      drawing = true;
    } else {
      drawing = false;
    }
  }
  return d;
}

const HQ_VEC = toVec(HQ.lat, HQ.lon);

const ARCS = DESTINATIONS.map((dest, i) => {
  const to = toVec(dest.lat, dest.lon);
  const omega = Math.acos(HQ_VEC[0] * to[0] + HQ_VEC[1] * to[1] + HQ_VEC[2] * to[2]);
  const altitude = 0.08 + 0.22 * (omega / Math.PI);
  const points = Array.from({ length: ARC_SAMPLES + 1 }, (_, s) => {
    const t = s / ARC_SAMPLES;
    return { v: slerp(HQ_VEC, to, t), h: 1 + altitude * Math.sin(Math.PI * t) };
  });
  return { to, points, offset: i / DESTINATIONS.length };
});

const MERIDIAN_VECS = Array.from({ length: MERIDIANS }, (_, m) =>
  Array.from({ length: SAMPLES + 1 }, (_, s) => toVec(-90 + (180 * s) / SAMPLES, (360 * m) / MERIDIANS))
);

// Latitude rings are unchanged by spinning, so they're drawn once.
const LATITUDE_PATHS = LATITUDES.map((lat) =>
  visiblePath(
    Array.from({ length: SAMPLES * 2 + 1 }, (_, s) => project(toVec(lat, (360 * s) / (SAMPLES * 2)), 0))
  )
);

// Deterministic so server and client render the same starfield.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seeded(2026);
const STARS = Array.from({ length: 170 }, () => {
  const bright = rand() > 0.9;
  return {
    left: rand() * 100,
    top: rand() * 100,
    size: bright ? 2 : 1 + rand() * 0.6,
    opacity: bright ? 0.9 : 0.2 + rand() * 0.5,
    twinkle: rand() < 0.35,
    duration: 2.5 + rand() * 4,
    delay: rand() * 6,
  };
});

export function GlobeSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const meridianRefs = useRef<(SVGPathElement | null)[]>([]);
  const arcRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const cityRefs = useRef<(SVGCircleElement | null)[]>([]);
  const hqRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const startRot = -HQ.lon * DEG + 0.35;
    const start = performance.now();
    let raf = 0;
    let running = false;

    function draw(now: number) {
      const seconds = (now - start) / 1000;
      const rot = startRot + seconds * SPIN;

      MERIDIAN_VECS.forEach((vecs, m) => {
        meridianRefs.current[m]?.setAttribute("d", visiblePath(vecs.map((v) => project(v, rot))));
      });

      ARCS.forEach((arc, i) => {
        const projected = arc.points.map((p) => project(p.v, rot, p.h));
        arcRefs.current[i]?.setAttribute("d", visiblePath(projected));

        const t = (seconds * 0.22 + arc.offset) % 1;
        const p = projected[Math.round(t * ARC_SAMPLES)];
        const pulse = pulseRefs.current[i];
        if (pulse) {
          pulse.setAttribute("cx", p.x.toFixed(1));
          pulse.setAttribute("cy", p.y.toFixed(1));
          pulse.style.opacity = p.visible ? String(Math.sin(Math.PI * t)) : "0";
        }

        const city = project(arc.to, rot);
        const dot = cityRefs.current[i];
        if (dot) {
          dot.setAttribute("cx", city.x.toFixed(1));
          dot.setAttribute("cy", city.y.toFixed(1));
          dot.style.opacity = city.visible ? "1" : "0";
        }
      });

      const hq = project(HQ_VEC, rot);
      if (hqRef.current) {
        hqRef.current.setAttribute("transform", `translate(${hq.x.toFixed(1)} ${hq.y.toFixed(1)})`);
        hqRef.current.style.opacity = hq.visible ? "1" : "0";
      }
    }

    function tick(now: number) {
      draw(now);
      raf = requestAnimationFrame(tick);
    }

    draw(start);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    observer.observe(svg);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-night py-28 text-white md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left.toFixed(2)}%`,
              top: `${star.top.toFixed(2)}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animation: star.twinkle
                ? `twinkle ${star.duration.toFixed(2)}s ease-in-out ${star.delay.toFixed(2)}s infinite`
                : undefined,
            }}
          />
        ))}
        <div className="absolute right-[-10%] top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,154,101,0.22),transparent_62%)] max-md:left-1/2 max-md:right-auto max-md:top-auto max-md:bottom-[-200px] max-md:h-[600px] max-md:w-[600px] max-md:-translate-x-1/2 max-md:translate-y-0" />
      </div>

      <Container className="relative grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <Reveal>
            <span className="label-mono text-accent-1">Worldwide</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-[14ch] font-heading text-[clamp(36px,4.4vw,72px)] font-medium leading-[1.02] tracking-[-0.04em]">
              One studio. Every time zone.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-white/60">
              We design and engineer for businesses wherever they are, working
              async when it helps and live when it matters, always on your
              schedule.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-12 grid max-w-md gap-5 sm:grid-cols-3 sm:gap-6 border-t border-white/15 pt-6">
              {[
                { term: "Remote-first", desc: "Built to work across borders" },
                { term: "Your hours", desc: "Calls in your time zone" },
                { term: "One team", desc: "Design to support" },
              ].map((item) => (
                <div key={item.term}>
                  <dt className="label-mono text-white">{item.term}</dt>
                  <dd className="mt-2 text-sm leading-snug text-white/50">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <svg
            ref={svgRef}
            viewBox="-380 -380 760 760"
            aria-hidden="true"
            className="mx-auto block h-auto w-full max-w-[640px]"
          >
            <defs>
              <radialGradient id="globe-sphere" cx="38%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#0f3a29" />
                <stop offset="55%" stopColor="#06170f" />
                <stop offset="100%" stopColor="#020604" />
              </radialGradient>
              <radialGradient id="globe-atmosphere" gradientUnits="userSpaceOnUse" cx="0" cy="0" r={R * 1.24}>
                <stop offset="0.79" stopColor="#34d399" stopOpacity="0" />
                <stop offset="0.81" stopColor="#34d399" stopOpacity="0.35" />
                <stop offset="0.9" stopColor="#0a9a65" stopOpacity="0.12" />
                <stop offset="1" stopColor="#0a9a65" stopOpacity="0" />
              </radialGradient>
              <filter id="globe-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle r={R * 1.24} fill="url(#globe-atmosphere)" />
            <circle r={R} fill="url(#globe-sphere)" />

            <g fill="none" stroke="#0a9a65" strokeWidth="1" strokeOpacity="0.75">
              {LATITUDE_PATHS.map((d, i) => (
                <path
                  key={LATITUDES[i]}
                  d={d}
                  stroke={LATITUDES[i] === 0 ? "#34d399" : undefined}
                  strokeOpacity={LATITUDES[i] === 0 ? 0.6 : undefined}
                />
              ))}
              {MERIDIAN_VECS.map((_, m) => (
                <path
                  key={m}
                  ref={(el) => {
                    meridianRefs.current[m] = el;
                  }}
                />
              ))}
            </g>
            <circle r={R} fill="none" stroke="#34d399" strokeOpacity="0.45" strokeWidth="1.25" />

            <g filter="url(#globe-glow)">
              {ARCS.map((_, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    arcRefs.current[i] = el;
                  }}
                  fill="none"
                  stroke="#34d399"
                  strokeOpacity="0.55"
                  strokeWidth="1.25"
                />
              ))}
              {ARCS.map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    pulseRefs.current[i] = el;
                  }}
                  r="3"
                  fill="#ffffff"
                  style={{ opacity: 0 }}
                />
              ))}
              {ARCS.map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => {
                    cityRefs.current[i] = el;
                  }}
                  r="3.5"
                  fill="#34d399"
                  style={{ opacity: 0 }}
                />
              ))}
              <g ref={hqRef} style={{ opacity: 0 }}>
                <circle
                  r="6"
                  fill="#34d399"
                  className="origin-center [transform-box:fill-box] motion-safe:animate-ping"
                />
                <circle r="6" fill="#34d399" />
                <circle r="2.5" fill="#ffffff" />
                <text
                  x="14"
                  y="-12"
                  fontSize="14"
                  fill="#ffffff"
                  className="font-mono uppercase tracking-[0.08em]"
                >
                  Surat · HQ
                </text>
              </g>
            </g>
          </svg>
        </Reveal>
      </Container>
    </section>
  );
}
