"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Container } from "./Container";

const LeafScene = dynamic(() => import("./LeafScene"), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Mobile GPUs generally support WebGL fine, but MeshPhysicalMaterial's
    // transmission forces Three.js to render the whole scene a second time
    // (an extra pass for the refraction buffer) every frame — combined with
    // clearcoat + iridescence this is heavy enough to hang or crash the tab
    // on throttled/low-end mobile hardware (confirmed via Lighthouse mobile
    // reporting "the page stopped responding"). Use the plain SVG fallback
    // on coarse-pointer (touch) devices instead of gambling on GPU headroom.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (!reduced && !coarsePointer && supportsWebGL()) setUse3d(true);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!glowRef.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    glowRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    glowRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
    glowRef.current.style.opacity = "1";
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => glowRef.current && (glowRef.current.style.opacity = "0")}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden pb-20 pt-32"
    >
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-0 hidden h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[70px] transition-opacity duration-300 md:block"
        style={{
          left: "var(--x, 50%)",
          top: "var(--y, 50%)",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.22) 0%, rgba(34,211,238,0.10) 55%, transparent 72%)",
        }}
      />

      {use3d ? (
        <LeafScene className="pointer-events-none absolute inset-0 z-0 opacity-85" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- decorative brand mark, bleeds off-canvas
        <img
          src="/logo/icon.svg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="pointer-events-none absolute -right-16 top-1/2 z-0 h-[130%] w-auto -translate-y-1/2 opacity-[0.07] md:-right-10 md:opacity-[0.09]"
        />
      )}

      <Container className="relative z-10 flex flex-col gap-8 md:gap-10">
        <h1 className="font-display text-[clamp(30px,6.4vw,104px)] font-semibold uppercase leading-[0.96] tracking-[-0.03em] text-ink-on-dark [overflow-wrap:anywhere]">
          {["One studio.", "Every touchpoint.", "No guesswork."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={ready ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={i === 2 ? "block accent-gradient-text" : "block text-ink-on-dark"}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="max-w-xl text-lg text-muted-on-dark md:text-xl"
        >
          One studio for identity, eco-friendly packaging, and the digital
          push to launch them &mdash; built for restaurants and food brands
          who want to be remembered.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-on-dark"
        >
          <span className="inline-block h-px w-8 bg-muted-on-dark" />
          Scroll to explore
        </motion.div>
      </Container>
    </section>
  );
}
