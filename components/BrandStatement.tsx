"use client";

import {
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
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
import dynamic from "next/dynamic";
import { EMPHASIS_CLASS } from "./Emphasis";

const BlackHoleCanvas = dynamic(() => import("./BlackHoleCanvas"), { ssr: false });

let webgl: boolean | undefined;
function supportsWebGL() {
  if (webgl === undefined) {
    try {
      webgl = Boolean(document.createElement("canvas").getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}
const noopSubscribe = () => () => {};

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

// How a word is taken, as fractions of its own WORD_DURATION: it sinks onto
// the disk's line and thins into a streak, slides along the disk to the edge
// of the hole, where the shader takes over and draws it as a curved line of
// light circling the edge and spiralling in until the shadow swallows it.
const PULL_END = 0.25;
const SLIDE_END = 0.38;
const HANDOFF = 0.4; // last part of the slide, where the word fades into the arc
const ORBIT_TURNS = 1.4;
const STREAK_THICKNESS = 3; // px, so every streak is the same thin line
const RING_RADIUS = 1.13; // arcs start just outside the shadow (shader radius = 1)
// Must match BlackHoleCanvas: shadow radius is 0.42 * scale in units of
// half the canvas's shorter side.
const SHADER_RADIUS = 0.42;
export const MAX_STREAKS = 16;

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

type Pose = { x: number; y: number; scaleX: number; scaleY: number; opacity: number };
const REST: Pose = { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 };
// A streak as the shader draws it (see uStreaks in BlackHoleCanvas).
type Arc = { head: number; radius: number; length: number; alpha: number };
const NO_ARC: Arc = { head: 0, radius: 0, length: 0, alpha: 0 };

type WordBox = { x: number; y: number; w: number; h: number };
// The hole as it is on screen right now, relative to the quote's center.
type Hole = { cx: number; cy: number; radius: number };

const smooth = (t: number) => t * t * (3 - 2 * t);

function wordMotion(k: number, box: WordBox, hole: Hole): { pose: Pose; arc: Arc } {
  if (k <= 0) return { pose: REST, arc: NO_ARC };
  const thin = STREAK_THICKNESS / box.h;
  const bandX = box.x * 0.85;

  if (k < PULL_END) {
    // Pull: sinks onto the disk's line through the hole and thins out.
    const m = smooth(k / PULL_END);
    return {
      pose: {
        x: (bandX - box.x + hole.cx) * m,
        y: (hole.cy - box.y) * m,
        scaleX: 1 + 0.8 * m,
        scaleY: 1 + (thin - 1) * m,
        opacity: 1,
      },
      arc: NO_ARC,
    };
  }

  // Streaks are caught at the side of the hole they're on (screen angle 0 is
  // the right edge, PI the left) and all circle clockwise on screen. The
  // shader's y axis points up, so its angles are the negatives of these.
  const side = bandX >= 0 ? 0 : Math.PI;

  if (k < SLIDE_END) {
    // Slide: along the disk to the edge; near the end the word fades out as
    // its arc fades in at the same point and starts to bend along the ring.
    const c = smooth((k - PULL_END) / (SLIDE_END - PULL_END));
    const fromX = hole.cx + bandX;
    const edgeX = hole.cx + Math.cos(side) * hole.radius * RING_RADIUS;
    const handoff = Math.max(0, (c - (1 - HANDOFF)) / HANDOFF);
    return {
      pose: {
        x: fromX + (edgeX - fromX) * c - box.x,
        y: hole.cy - box.y,
        scaleX: 1.8 * (1 - 0.5 * c),
        scaleY: thin,
        opacity: 1 - handoff,
      },
      arc: { head: -side, radius: RING_RADIUS, length: 0.05 + 0.25 * handoff, alpha: handoff },
    };
  }

  // Orbit: the arc circles the edge, lengthening as it speeds up, and
  // spirals inward until the shadow covers it.
  const u = (k - SLIDE_END) / (1 - SLIDE_END);
  const angle = side + u * u * ORBIT_TURNS * Math.PI * 2;
  return {
    pose: { ...REST, opacity: 0 },
    arc: {
      head: -angle,
      radius: RING_RADIUS - 0.28 * u * u,
      length: 0.3 + 1.5 * u,
      alpha: 1,
    },
  };
}

function SpiralWord({
  word,
  index,
  progress,
  boxes,
  viewport,
  holeScale,
  holeX,
  holeY,
  streaks,
  reduced,
  registerRef,
}: {
  word: Word;
  index: number;
  progress: MotionValue<number>;
  boxes: RefObject<WordBox[]>;
  viewport: RefObject<{ w: number; h: number }>;
  holeScale: MotionValue<number>;
  holeX: MotionValue<number>;
  holeY: MotionValue<number>;
  streaks: RefObject<Float32Array>;
  reduced: boolean;
  registerRef: (el: HTMLSpanElement | null) => void;
}) {
  const stagger = ((SUCK_END - SUCK_START - WORD_DURATION) * index) / (WORDS.length - 1);
  const start = SUCK_START + stagger;

  const pose = useTransform(progress, (v) => {
    const box = boxes.current[index];
    let motion = { pose: REST, arc: NO_ARC };
    if (!reduced && box && box.w > 0) {
      const { w, h } = viewport.current;
      const hole: Hole = {
        cx: holeX.get(),
        cy: holeY.get(),
        radius: SHADER_RADIUS * holeScale.get() * 0.5 * Math.min(w, h),
      };
      motion = wordMotion(range(v, start, start + WORD_DURATION), box, hole);
    }
    // Hand this word's arc to the shader, which reads the array every frame.
    if (index < MAX_STREAKS) {
      streaks.current.set([motion.arc.head, motion.arc.radius, motion.arc.length, motion.arc.alpha], index * 4);
    }
    return motion.pose;
  });
  const x = useTransform(pose, (p) => p.x);
  const y = useTransform(pose, (p) => p.y);
  const scaleX = useTransform(pose, (p) => p.scaleX);
  const scaleY = useTransform(pose, (p) => p.scaleY);
  const opacity = useTransform(pose, (p) => p.opacity);

  return (
    <>
      <motion.span
        ref={registerRef}
        style={{ x, y, scaleX, scaleY, opacity }}
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
  const stickyRef = useRef<HTMLDivElement>(null);
  const boxes = useRef<WordBox[]>([]);
  const streaks = useRef(new Float32Array(MAX_STREAKS * 4));
  const viewport = useRef({ w: 1280, h: 800 });
  const canUseWebGL = useSyncExternalStore(noopSubscribe, supportsWebGL, () => false);
  const reduced = useReducedMotion() ?? false;

  // Each word's resting center relative to the quote's center, read from
  // layout offsets so the scroll transforms never skew the measurement.
  useLayoutEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    function measure() {
      const sticky = stickyRef.current;
      viewport.current = sticky
        ? { w: sticky.clientWidth, h: sticky.clientHeight }
        : { w: window.innerWidth, h: window.innerHeight };
      const cx = quote!.offsetWidth / 2;
      const cy = quote!.offsetHeight / 2;
      boxes.current = wordEls.current.map((el) =>
        el
          ? {
              x: el.offsetLeft + el.offsetWidth / 2 - cx,
              y: el.offsetTop + el.offsetHeight / 2 - cy,
              w: el.offsetWidth,
              h: el.offsetHeight,
            }
          : { x: 0, y: 0, w: 0, h: 0 }
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
        ref={stickyRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#000_0%,#010403_30%,#03160e_52%,#065a3b_78%,#0a9a65_100%)]"
      >
        {canUseWebGL ? (
          <BlackHoleCanvas
            scale={holeScale}
            glow={holeGlow}
            offsetX={holeX}
            offsetY={holeY}
            streaks={streaks}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        ) : (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute will-change-transform"
            style={{ x: holeX, y: holeY, scale: holeScale }}
          >
            <BlackHole glow={holeGlow} />
          </motion.div>
        )}

        <motion.div
          aria-hidden="true"
          style={{ opacity: fadeFromBlack }}
          className="pointer-events-none absolute inset-0 bg-night"
        />

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
                boxes={boxes}
                viewport={viewport}
                holeScale={holeScale}
                holeX={holeX}
                holeY={holeY}
                streaks={streaks}
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
