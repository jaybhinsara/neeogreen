"use client";

import { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

// Frame insets (fraction of the viewport) before the zoom starts. The frame
// leaves room below for the headline and opens to full-bleed on scroll.
const INSETS = {
  mobile: { t: 0.13, x: 0.05, b: 0.32 },
  desktop: { t: 0.12, x: 0.19, b: 0.25 },
};

const DESKTOP_QUERY = "(min-width: 768px)";
function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// The zoom is pure transform so it stays on the compositor: the frame scales
// non-uniformly from its inset size to full-bleed, and the video inside is
// counter-scaled so it never stretches. Animating clip-path instead forced a
// full repaint of the video every frame and stuttered on phones.
function HeroFrame({
  insets,
  progress,
  mediaScale,
}: {
  insets: { t: number; x: number; b: number };
  progress: MotionValue<number>;
  mediaScale: MotionValue<number>;
}) {
  const scaleX = useTransform(progress, (p) => 1 - 2 * insets.x * (1 - p));
  const scaleY = useTransform(progress, (p) => 1 - (insets.t + insets.b) * (1 - p));
  const y = useTransform(progress, (p) => `${((insets.t - insets.b) / 2) * (1 - p) * 100}%`);
  const videoScaleX = useTransform([scaleX, mediaScale], ([s, m]: number[]) => m / s);
  const videoScaleY = useTransform([scaleY, mediaScale], ([s, m]: number[]) => m / s);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-night will-change-transform"
      style={{ y, scaleX, scaleY }}
    >
      <motion.video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-leaf-poster.jpg"
        className="h-full w-full object-cover will-change-transform"
        style={{ scaleX: videoScaleX, scaleY: videoScaleY }}
      >
        <source src="/video/hero-leaf.mp4" type="video/mp4" />
      </motion.video>
    </motion.div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true
  );

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

  return (
    <section id="top" ref={sectionRef} className="relative h-[230svh] bg-page">
      <div className="sticky top-0 h-svh overflow-hidden">
        <HeroFrame
          key={isDesktop ? "desktop" : "mobile"}
          insets={isDesktop ? INSETS.desktop : INSETS.mobile}
          progress={progress}
          mediaScale={mediaScale}
        />

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
