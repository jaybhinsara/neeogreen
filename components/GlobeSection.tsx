"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Container } from "./Container";
import { Emphasis } from "./Emphasis";
import { Reveal } from "./Reveal";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

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
const STARS = Array.from({ length: 140 }, () => {
  const bright = rand() > 0.9;
  return {
    left: rand() * 100,
    top: rand() * 100,
    size: bright ? 2 : 1 + rand() * 0.6,
    opacity: bright ? 0.9 : 0.2 + rand() * 0.5,
    twinkle: rand() < 0.2,
    duration: 2.5 + rand() * 4,
    delay: rand() * 6,
  };
});

let webgl: boolean | undefined;
function supportsWebGL() {
  if (webgl === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}
const noopSubscribe = () => () => {};

export function GlobeSection() {
  const globeRef = useRef<HTMLDivElement>(null);
  const canUseWebGL = useSyncExternalStore(noopSubscribe, supportsWebGL, () => false);
  // The globe builds its meshes on mount, so it waits until the section is
  // close to the viewport instead of competing with the hero on page load.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = globeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
        <div className="absolute right-[-10%] top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,154,101,0.22),transparent_62%)] max-md:bottom-[-200px] max-md:left-1/2 max-md:right-auto max-md:top-auto max-md:h-[600px] max-md:w-[600px] max-md:-translate-x-1/2 max-md:translate-y-0" />
      </div>

      <Container className="relative grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <Reveal>
            <span className="label-mono text-accent-1">Worldwide</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-[14ch] font-heading text-[clamp(36px,4.4vw,72px)] font-medium leading-[1.06] tracking-[-0.04em]">
              One studio. Every{" "}
              <span className="whitespace-nowrap">
                <Emphasis>time zone</Emphasis>.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-white/70">
              We design and engineer for businesses wherever they are, working
              async when it helps and live when it matters, always on your
              schedule.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-12 grid max-w-md gap-5 border-t border-white/15 pt-6 sm:grid-cols-3 sm:gap-6">
              {[
                { term: "Remote-first", desc: "Built to work across borders" },
                { term: "Your hours", desc: "Calls in your time zone" },
                { term: "One team", desc: "Design to support" },
              ].map((item) => (
                <div key={item.term}>
                  <dt className="label-mono text-white">{item.term}</dt>
                  <dd className="mt-2 text-sm leading-snug text-white/60">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={globeRef} className="relative mx-auto aspect-square w-full max-w-[640px]">
            {canUseWebGL && near ? (
              <GlobeScene className="absolute inset-0" />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#3fdca4,#0a8f5e_45%,#03241a_100%)] shadow-[0_0_80px_rgba(52,211,153,0.35)]"
              />
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
