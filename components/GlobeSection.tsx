"use client";

import { useEffect, useRef } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SITE } from "@/lib/site";

const R = 480;
const TILT = (10 * Math.PI) / 180;
const MERIDIANS = 12;
const LATITUDES = [-60, -40, -20, 0, 20, 40, 60, 75];
const SAMPLES = 48;
// The globe sways around Surat rather than spinning a full turn, so the
// marker never disappears around the back.
const SWAY_RAD = 0.55;
const SWAY_SPEED = 0.12;
const SURAT = { lat: 21.17, lon: 72.83 };
const DEG = Math.PI / 180;

// Orthographic projection of a point on the sphere, tilted toward the
// viewer so the north pole is visible. Returns screen x/y and whether the
// point faces the viewer.
function project(lat: number, lon: number) {
  const x = R * Math.cos(lat) * Math.sin(lon);
  const y0 = R * Math.sin(lat);
  const z0 = R * Math.cos(lat) * Math.cos(lon);
  const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
  const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
  return { x, y: -y, front: z >= 0 };
}

// Builds an SVG path through the front-facing samples only, breaking the
// line wherever it passes behind the globe.
function frontPath(points: { x: number; y: number; front: boolean }[]) {
  let d = "";
  let drawing = false;
  for (const p of points) {
    if (p.front) {
      d += `${drawing ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      drawing = true;
    } else {
      drawing = false;
    }
  }
  return d;
}

function meridianPath(lon: number) {
  const points = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const lat = -Math.PI / 2 + (Math.PI * i) / SAMPLES;
    points.push(project(lat, lon));
  }
  return frontPath(points);
}

function latitudePath(latDeg: number) {
  const points = [];
  for (let i = 0; i <= SAMPLES * 2; i++) {
    points.push(project(latDeg * DEG, (2 * Math.PI * i) / (SAMPLES * 2)));
  }
  return frontPath(points);
}

export function GlobeSection() {
  const svgRef = useRef<SVGSVGElement>(null);
  const meridianRefs = useRef<(SVGPathElement | null)[]>([]);
  const markerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const center = -SURAT.lon * DEG;
    let rotation = center;
    const start = performance.now();
    let raf = 0;
    let running = false;

    function draw() {
      meridianRefs.current.forEach((el, i) => {
        el?.setAttribute("d", meridianPath((Math.PI * i) / MERIDIANS + rotation));
      });
      const surat = project(SURAT.lat * DEG, SURAT.lon * DEG + rotation);
      if (markerRef.current) {
        markerRef.current.setAttribute("transform", `translate(${surat.x} ${surat.y})`);
        markerRef.current.style.opacity = surat.front ? "1" : "0";
      }
    }

    function tick(now: number) {
      rotation = center + SWAY_RAD * Math.sin(((now - start) / 1000) * SWAY_SPEED);
      draw();
      raf = requestAnimationFrame(tick);
    }

    draw();
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
    <section className="overflow-hidden bg-paper pt-12 md:pt-20">
      <Container>
        <Reveal>
          <span className="label-mono text-brand">Where we work</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[20ch] font-heading text-[clamp(32px,4vw,64px)] font-medium leading-[1.05] tracking-[-0.035em]">
            Based in Surat. Building for businesses across Gujarat.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-muted">
            {SITE.serviceCities.map((city) => (
              <li key={city} className="label-mono">
                {city}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <div className="relative mx-auto mt-8 h-[60svh] max-w-[1600px] overflow-hidden md:-mt-24 md:h-[85svh]">
        <svg
          ref={svgRef}
          viewBox={`${-R - 10} ${-R - 10} ${2 * R + 20} ${2 * R + 20}`}
          aria-hidden="true"
          className="absolute left-1/2 top-0 w-[170%] max-w-none -translate-x-1/2 md:w-[110%]"
        >
          <g fill="none" stroke="rgba(11,15,13,0.32)" strokeWidth="1" vectorEffect="non-scaling-stroke">
            <circle r={R} vectorEffect="non-scaling-stroke" />
            {LATITUDES.map((lat) => (
              <path key={lat} d={latitudePath(lat)} vectorEffect="non-scaling-stroke" />
            ))}
            {Array.from({ length: MERIDIANS }).map((_, i) => (
              <path
                key={i}
                ref={(el) => {
                  meridianRefs.current[i] = el;
                }}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          <g ref={markerRef} className="transition-opacity duration-500">
            <circle r="16" fill="var(--color-brand)" opacity="0.18" />
            <circle r="5" fill="var(--color-brand)" />
            <text x="14" y="-12" fontSize="16" className="fill-ink font-mono uppercase tracking-[0.08em]">
              Surat
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
