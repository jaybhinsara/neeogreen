"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "./Container";

export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

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
      <Image
        src="/hero/hero-workspace.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="pointer-events-none absolute inset-0 z-0 object-cover"
      />
      {/* Scrim: solid dark base + a stronger gradient low-left where the
          headline sits, so the photo stays legible without flattening it
          into a plain dark background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-bg-primary/55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent"
      />

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

      <Container className="relative z-10 flex flex-col gap-8 md:gap-10">
        <h1 className="font-display text-[clamp(26px,5vw,80px)] font-semibold uppercase leading-[0.96] tracking-[-0.03em] text-ink-on-dark [overflow-wrap:anywhere]">
          {["Web development.", "Software engineering.", "Built in Gujarat."].map((line, i) => (
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
          Web development, web design, and software engineering &mdash; plus
          managed IT, cloud, and cybersecurity &mdash; for businesses and
          individuals across Surat and Gujarat.
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
