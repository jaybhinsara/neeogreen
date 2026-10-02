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
const WORD_DURATION = 0.26; // each word's own fall, staggered across the suck

// How a word falls in, as fractions of its own WORD_DURATION: it melts and
// drifts out to the glowing ring, orbits along the tilted disk while being
// stretched thin, then drops through the edge into the center.
const MELT_END = 0.22;
const ORBIT_END = 0.8;
const ORBIT_TURNS = 1.15;
const ORBIT_RADIUS = 0.34; // fraction of the hole's width: just outside the photon ring
const ORBIT_SQUASH = 0.42; // how flat the orbit looks (the disk itself is 0.24)
const DISK_TILT = (-9 * Math.PI) / 180; // matches the disk's rotate(-9deg)

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

type Pose = { x: number; y: number; rotate: number; scaleX: number; scaleY: number; opacity: number };
const REST: Pose = { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, opacity: 1 };

const smooth = (t: number) => t * t * (3 - 2 * t);

// A point on the words' orbit: an ellipse squashed and tilted like the disk.
function orbitPoint(angle: number, radius: number) {
  const lx = radius * Math.cos(angle);
  const ly = radius * Math.sin(angle) * ORBIT_SQUASH;
  return {
    x: lx * Math.cos(DISK_TILT) - ly * Math.sin(DISK_TILT),
    y: lx * Math.sin(DISK_TILT) + ly * Math.cos(DISK_TILT),
  };
}

// Direction of travel along the orbit, in degrees, so words face along it.
function orbitTangent(angle: number) {
  const dx = -Math.sin(angle);
  const dy = Math.cos(angle) * ORBIT_SQUASH;
  const tx = dx * Math.cos(DISK_TILT) - dy * Math.sin(DISK_TILT);
  const ty = dx * Math.sin(DISK_TILT) + dy * Math.cos(DISK_TILT);
  return (Math.atan2(ty, tx) * 180) / Math.PI;
}

// The far half of the orbit (upper half before tilting) passes behind the
// hole, so words there dim as if the shadow is covering them.
const behindDim = (angle: number) => 1 - 0.7 * Math.max(0, -Math.sin(angle));

function wordPose(k: number, offset: { x: number; y: number }, orbitRadius: number): Pose {
  if (k <= 0) return REST;
  const a0 = Math.atan2(offset.y, offset.x);

  if (k < MELT_END) {
    // Melt: the word sags and drips (taller, narrower, dropping slightly)
    // while drifting out to the ring at its own angle from the center.
    const m = smooth(k / MELT_END);
    const target = orbitPoint(a0, orbitRadius);
    return {
      x: (target.x - offset.x) * m,
      y: (target.y - offset.y) * m + 14 * Math.sin(Math.PI * m),
      rotate: orbitTangent(a0) * m,
      scaleX: 1 - 0.15 * m,
      scaleY: 1 + 0.45 * m,
      opacity: 1,
    };
  }

  if (k < ORBIT_END) {
    // Orbit: carried around the disk, tightening, and stretched thin along
    // the direction of travel as tidal forces take hold.
    const u = (k - MELT_END) / (ORBIT_END - MELT_END);
    const angle = a0 + u * ORBIT_TURNS * Math.PI * 2;
    const p = orbitPoint(angle, orbitRadius * (1 - 0.45 * u));
    const shrink = 1 - 0.45 * u;
    return {
      x: p.x - offset.x,
      y: p.y - offset.y,
      rotate: orbitTangent(angle),
      scaleX: (0.85 + 1.2 * u) * shrink,
      scaleY: (1.45 - 1.05 * u) * shrink,
      opacity: behindDim(angle) * (1 - 0.25 * u),
    };
  }

  // Plunge: the last loop collapses into the center and the word is gone.
  const w = (k - ORBIT_END) / (1 - ORBIT_END);
  const angle = a0 + (ORBIT_TURNS + 0.6 * w) * Math.PI * 2;
  const p = orbitPoint(angle, orbitRadius * 0.55 * Math.pow(1 - w, 1.5));
  const shrink = 0.55 * (1 - w);
  return {
    x: p.x - offset.x,
    y: p.y - offset.y,
    rotate: orbitTangent(angle),
    scaleX: Math.max(0.02, 2.05 * shrink),
    scaleY: Math.max(0.02, 0.4 * shrink),
    opacity: behindDim(angle) * 0.75 * (1 - w),
  };
}

function SpiralWord({
  word,
  index,
  progress,
  offsets,
  holeWidth,
  holeScale,
  reduced,
  registerRef,
}: {
  word: Word;
  index: number;
  progress: MotionValue<number>;
  offsets: RefObject<{ x: number; y: number }[]>;
  holeWidth: RefObject<number>;
  holeScale: MotionValue<number>;
  reduced: boolean;
  registerRef: (el: HTMLSpanElement | null) => void;
}) {
  const stagger = ((SUCK_END - SUCK_START - WORD_DURATION) * index) / (WORDS.length - 1);
  const start = SUCK_START + stagger;

  const pose = useTransform(progress, (v) => {
    if (reduced) return REST;
    const k = range(v, start, start + WORD_DURATION);
    const orbitRadius = ORBIT_RADIUS * holeWidth.current * holeScale.get();
    return wordPose(k, offsets.current[index] ?? { x: 0, y: 0 }, orbitRadius);
  });
  const x = useTransform(pose, (p) => p.x);
  const y = useTransform(pose, (p) => p.y);
  const rotate = useTransform(pose, (p) => p.rotate);
  const scaleX = useTransform(pose, (p) => p.scaleX);
  const scaleY = useTransform(pose, (p) => p.scaleY);
  const opacity = useTransform(pose, (p) => p.opacity);

  return (
    <>
      <motion.span
        ref={registerRef}
        style={{ x, y, rotate, scaleX, scaleY, opacity }}
        className="inline-block whitespace-nowrap will-change-transform"
      >
        <span className={word.key ? EMPHASIS_CLASS : "font-heading font-normal text-white/90"}>
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
          className="h-full w-full rounded-full motion-safe:animate-[spin-slow_26s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(62, 76) }}
        />
      </motion.div>

      {/* Accretion disk, back half: tucked behind the shadow. */}
      <motion.div
        style={{ opacity: glow, ...DISK_BACK_MASK }}
        className="absolute inset-0 [transform:rotate(-9deg)_scaleY(0.24)]"
      >
        <div
          className="h-full w-full rounded-full motion-safe:animate-[spin-slow_16s_linear_infinite]"
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
          className="h-full w-full rounded-full motion-safe:animate-[spin-slow_16s_linear_infinite]"
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
  // Unscaled width of the hole, matching BlackHole's w-[min(118vw,760px)].
  const holeWidth = useRef(760);
  const reduced = useReducedMotion() ?? false;

  // Each word's resting center relative to the quote's center, read from
  // layout offsets so the scroll transforms never skew the measurement.
  useLayoutEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    function measure() {
      holeWidth.current = Math.min(window.innerWidth * 1.18, 760);
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
    return 1.4 + 3.2 * easeIn(range(v, SUCK_END, 1));
  });
  // The glow fades out as the final zoom begins, so only the plain black
  // core is scaled up to fill the screen; scaling the masked, spinning
  // rings to several times the viewport was what made the collapse stutter.
  const holeGlow = useTransform(scrollYProgress, (v) =>
    reduced
      ? 0.5
      : (0.35 + 0.65 * range(v, SUCK_START, SUCK_START + 0.15)) * (1 - range(v, SUCK_END, SUCK_END + 0.07))
  );
  // Opens fully black to continue the hero's fade, then the emerald blooms
  // in around the hole as the quote settles.
  const fadeFromBlack = useTransform(scrollYProgress, (v) =>
    reduced ? 0 : 1 - easeOut(range(v, 0.02, ENTER_END + 0.08))
  );
  const fadeToBlack = useTransform(scrollYProgress, (v) => (reduced ? 0 : range(v, 0.88, 0.98)));

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
          className="pointer-events-none absolute will-change-transform"
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
                holeWidth={holeWidth}
                holeScale={holeScale}
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
