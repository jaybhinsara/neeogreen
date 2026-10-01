"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "framer-motion";

// Frame insets (as % of the viewport) before the zoom starts. The frame
// sits centered with room below for the headline, and opens to full-bleed
// as you scroll through the pinned section.
const FRAME_INSETS =
  "[--frame-t:13%] [--frame-x:5%] [--frame-b:32%] md:[--frame-t:12%] md:[--frame-x:19%] md:[--frame-b:25%]";

export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 0.8], [0, reduced ? 0 : 1]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 1.3]);
  // A function mapping, not a range: Framer Motion hands range-mapped
  // scroll opacity to a native ScrollTimeline, which measured against the
  // whole page instead of this pinned section and left the headline
  // visible over the fully zoomed media.
  const headlineOpacity = useTransform(scrollYProgress, (v) => 1 - Math.min(v / 0.18, 1));
  const headlineY = useTransform(scrollYProgress, [0, 0.18], [0, -32]);

  const frameStyle = {
    "--p": progress,
    clipPath:
      "inset(calc(var(--frame-t) * (1 - var(--p))) calc(var(--frame-x) * (1 - var(--p))) calc(var(--frame-b) * (1 - var(--p))) calc(var(--frame-x) * (1 - var(--p))) round calc(6px * (1 - var(--p))))",
  } as MotionStyle;

  return (
    <section id="top" ref={sectionRef} className="relative h-[230svh] bg-page">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className={`absolute inset-0 overflow-hidden bg-night ${FRAME_INSETS}`}
          style={frameStyle}
        >
          <motion.video
            aria-hidden="true"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video/hero-leaf-poster.jpg"
            className="h-full w-full object-cover"
            style={{ scale: mediaScale }}
          >
            <source src="/video/hero-leaf.mp4" type="video/mp4" />
          </motion.video>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-10 md:pb-12"
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="font-heading text-[clamp(30px,3.4vw,56px)] font-medium leading-[1.04] tracking-[-0.035em]">
              {[
                { text: "Web Development &", tone: "text-ink" },
                { text: "Software Engineering", tone: "text-ink" },
                { text: "for Growing Businesses.", tone: "text-muted" },
              ].map((line, i) => (
                <span key={line.text} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={ready ? { y: "0%" } : { y: "110%" }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className={`block ${line.tone}`}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="label-mono text-muted"
            >
              Design &middot; Engineering &middot; Software &mdash; Worldwide
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
