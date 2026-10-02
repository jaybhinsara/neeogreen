"use client";

import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { EMPHASIS_CLASS } from "./Emphasis";

type Word = { text: string; key?: boolean; after?: string };

const WORDS: Word[] = [
  { text: "We" },
  { text: "build" },
  { text: "for" },
  { text: "what" },
  { text: "comes" },
  { text: "next," },
  { text: "where" },
  { text: "design", key: true, after: "," },
  { text: "engineering", key: true, after: "," },
  { text: "and" },
  { text: "reliable" },
  { text: "IT", key: true },
  { text: "work" },
  { text: "as" },
  { text: "one." },
];

// Scroll choreography, as fractions of the pinned section's scroll range.
const ENTER_END = 0.2; // quote zooms out from huge and fades in
const SUCK_START = 0.48; // hole starts pulling words in
const SUCK_END = 0.84;
const WORD_DURATION = 0.2; // each word's own spiral, staggered across the suck
const SPIRAL_TURNS = 1.35;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

function ring(inner: number, outer: number): CSSProperties {
  const mask = `radial-gradient(circle closest-side, transparent ${inner - 4}%, #000 ${inner}%, #000 ${outer}%, transparent ${outer + 6}%)`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

// The disk is drawn twice, once behind the shadow and once in front. Each
// copy fades out across the middle with complementary soft masks, so the
// halves blend into one ring with no seam or doubled band where they meet.
const DISK_BACK_MASK: CSSProperties = {
  maskImage: "linear-gradient(to bottom, #000 40%, transparent 60%)",
  WebkitMaskImage: "linear-gradient(to bottom, #000 40%, transparent 60%)",
};
const DISK_FRONT_MASK: CSSProperties = {
  maskImage: "linear-gradient(to bottom, transparent 40%, #000 60%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, #000 60%)",
};

const DISK_GRADIENT =
  "conic-gradient(from 0deg, rgba(52,211,153,0) 0deg, rgba(52,211,153,0.85) 50deg, #effff8 95deg, rgba(52,211,153,0.7) 150deg, rgba(10,154,101,0.15) 220deg, rgba(34,211,238,0.55) 290deg, rgba(52,211,153,0) 360deg)";

function SpiralWord({
  word,
  index,
  progress,
  offsets,
  reduced,
  registerRef,
}: {
  word: Word;
  index: number;
  progress: MotionValue<number>;
  offsets: RefObject<{ x: number; y: number }[]>;
  reduced: boolean;
  registerRef: (el: HTMLSpanElement | null) => void;
}) {
  const stagger = ((SUCK_END - SUCK_START - WORD_DURATION) * index) / (WORDS.length - 1);
  const start = SUCK_START + stagger;
  const t = useTransform(progress, (v) => (reduced ? 0 : easeIn(range(v, start, start + WORD_DURATION))));

  // Spiral toward the quote's center, which sits on the hole: the angle
  // winds on while the radius collapses, so each word orbits as it falls.
  const pos = useTransform(t, (k) => {
    if (k === 0) return { x: 0, y: 0 };
    const o = offsets.current[index] ?? { x: 0, y: 0 };
    const r0 = Math.hypot(o.x, o.y);
    const a0 = Math.atan2(o.y, o.x);
    const r = r0 * Math.pow(1 - k, 1.6);
    const a = a0 + k * SPIRAL_TURNS * Math.PI * 2;
    return { x: r * Math.cos(a) - o.x, y: r * Math.sin(a) - o.y };
  });
  const x = useTransform(pos, (p) => p.x);
  const y = useTransform(pos, (p) => p.y);
  const rotate = useTransform(t, (k) => k * 240);
  const scale = useTransform(t, (k) => Math.max(0.02, 1 - k * 0.98));
  const opacity = useTransform(t, (k) => (k < 0.55 ? 1 : 1 - (k - 0.55) / 0.45));

  return (
    <>
      <motion.span
        ref={registerRef}
        style={{ x, y, rotate, scale, opacity }}
        className="inline-block whitespace-nowrap will-change-transform"
      >
        <span
          className={
            word.key
              ? EMPHASIS_CLASS
              : "font-heading font-normal text-white/90"
          }
        >
          {word.text}
        </span>
        {word.after && <span className="font-heading font-normal text-white/90">{word.after}</span>}
      </motion.span>{" "}
    </>
  );
}

function BlackHole({ glow }: { glow: MotionValue<number> }) {
  return (
    <div className="relative aspect-square w-[min(118vw,760px)]">
      <motion.div
        style={{ opacity: glow }}
        className="absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.16),transparent_58%)]"
      />

      {/* Photon ring: the lensed glow hugging the shadow. */}
      <motion.div style={{ opacity: glow }} className="absolute inset-[18%]">
        <div
          className="h-full w-full rounded-full blur-[4px] motion-safe:animate-[spin-slow_26s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(62, 76) }}
        />
      </motion.div>

      {/* Accretion disk, back half: tucked behind the shadow. */}
      <motion.div
        style={{ opacity: glow, ...DISK_BACK_MASK }}
        className="absolute inset-0 [transform:rotate(-9deg)_scaleY(0.24)]"
      >
        <div
          className="h-full w-full rounded-full blur-[3px] motion-safe:animate-[spin-slow_16s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(46, 86) }}
        />
      </motion.div>

      {/* Event horizon: solid black that feathers out over its outer edge. */}
      <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(circle_closest-side,#000_70%,rgba(0,0,0,0.85)_80%,rgba(0,0,0,0.4)_90%,transparent_100%)]" />

      {/* Accretion disk, front half: crosses in front of the shadow. */}
      <motion.div
        style={{ opacity: glow, ...DISK_FRONT_MASK }}
        className="absolute inset-0 [transform:rotate(-9deg)_scaleY(0.24)]"
      >
        <div
          className="h-full w-full rounded-full blur-[3px] motion-safe:animate-[spin-slow_16s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(46, 86) }}
        />
      </motion.div>
    </div>
  );
}

export function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const wordEls = useRef<(HTMLSpanElement | null)[]>([]);
  const offsets = useRef<{ x: number; y: number }[]>([]);
  const reduced = useReducedMotion() ?? false;

  // Each word's resting center relative to the quote's center, read from
  // layout offsets so the scroll transforms never skew the measurement.
  useLayoutEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    function measure() {
      const cx = quote!.offsetWidth / 2;
      const cy = quote!.offsetHeight / 2;
      offsets.current = wordEls.current.map((el) =>
        el
          ? { x: el.offsetLeft + el.offsetWidth / 2 - cx, y: el.offsetTop + el.offsetHeight / 2 - cy }
          : { x: 0, y: 0 }
      );
    }
    measure();
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(quote);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  // Enter: the quote starts huge and transparent and settles to reading size.
  const quoteScale = useTransform(scrollYProgress, (v) =>
    reduced ? 1 : 2.4 - 1.4 * easeOut(range(v, 0, ENTER_END))
  );
  const quoteOpacity = useTransform(scrollYProgress, (v) =>
    reduced ? 1 : easeOut(range(v, 0.02, ENTER_END))
  );
  const extrasOpacity = useTransform(scrollYProgress, (v) =>
    reduced ? 1 : range(v, ENTER_END - 0.06, ENTER_END) * (1 - range(v, SUCK_START, SUCK_START + 0.08))
  );

  // The hole waits small and quiet while the quote is read, zooms in as it
  // feeds, then swallows the screen into the black section that follows.
  const holeScale = useTransform(scrollYProgress, (v) => {
    if (reduced) return 0.8;
    if (v < SUCK_START) return 0.72;
    if (v < SUCK_END) return 0.72 + 0.68 * range(v, SUCK_START, SUCK_END);
    return 1.4 + 5.6 * easeIn(range(v, SUCK_END, 1));
  });
  const holeGlow = useTransform(scrollYProgress, (v) =>
    reduced ? 0.5 : 0.35 + 0.65 * range(v, SUCK_START, SUCK_START + 0.15)
  );
  // Opens fully black to continue the hero's fade, then the emerald blooms
  // in around the hole as the quote settles.
  const fadeFromBlack = useTransform(scrollYProgress, (v) =>
    reduced ? 0 : 1 - easeOut(range(v, 0.02, ENTER_END + 0.08))
  );
  const fadeToBlack = useTransform(scrollYProgress, (v) => (reduced ? 0 : range(v, 0.9, 1)));

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const holeX = useTransform(smoothX, (v) => v * 30);
  const holeY = useTransform(smoothY, (v) => v * 30);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section ref={sectionRef} className={reduced ? "relative bg-night" : "relative h-[380svh] bg-night"}>
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#000_0%,#010403_30%,#03160e_52%,#065a3b_78%,#0a9a65_100%)]"
      >
        <motion.div
          aria-hidden="true"
          style={{ opacity: fadeFromBlack }}
          className="pointer-events-none absolute inset-0 bg-night"
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ x: holeX, y: holeY, scale: holeScale }}
        >
          <BlackHole glow={holeGlow} />
        </motion.div>

        <motion.figure
          className="relative z-10 px-6 text-center will-change-transform"
          style={{ scale: quoteScale, opacity: quoteOpacity }}
        >
          <blockquote
            ref={quoteRef}
            className="relative mx-auto max-w-[17ch] text-[clamp(32px,4.6vw,76px)] leading-[1.16] tracking-[-0.03em] [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]"
          >
            <motion.span
              aria-hidden="true"
              style={{ opacity: extrasOpacity }}
              className="pointer-events-none absolute -top-[0.55em] left-0 select-none font-serif text-[2.6em] leading-none text-accent-1/60 md:-left-[0.7em]"
            >
              &ldquo;
            </motion.span>
            {WORDS.map((word, i) => (
              <SpiralWord
                key={word.text}
                word={word}
                index={i}
                progress={scrollYProgress}
                offsets={offsets}
                reduced={reduced}
                registerRef={(el) => {
                  wordEls.current[i] = el;
                }}
              />
            ))}
            <motion.span
              aria-hidden="true"
              style={{ opacity: extrasOpacity }}
              className="pointer-events-none absolute -bottom-[0.95em] right-0 select-none font-serif text-[2.6em] leading-none text-accent-1/60 md:-right-[0.6em]"
            >
              &rdquo;
            </motion.span>
          </blockquote>
          <motion.figcaption
            style={{ opacity: extrasOpacity }}
            className="label-mono absolute inset-x-0 top-full mt-14 text-white/60"
          >
            &mdash; The NeeoGreen belief
          </motion.figcaption>
        </motion.figure>

        <motion.div
          aria-hidden="true"
          style={{ opacity: fadeToBlack }}
          className="pointer-events-none absolute inset-0 bg-night"
        />
      </div>
    </section>
  );
}
