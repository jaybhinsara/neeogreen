"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

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

const REVEAL_START = 0.08;
const REVEAL_END = 0.72;
const DIM = 0.14;

function ring(inner: number, outer: number): CSSProperties {
  const mask = `radial-gradient(circle closest-side, transparent ${inner - 4}%, #000 ${inner}%, #000 ${outer}%, transparent ${outer + 6}%)`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

const DISK_GRADIENT =
  "conic-gradient(from 0deg, rgba(52,211,153,0) 0deg, rgba(52,211,153,0.85) 50deg, #effff8 95deg, rgba(52,211,153,0.7) 150deg, rgba(10,154,101,0.15) 220deg, rgba(34,211,238,0.55) 290deg, rgba(52,211,153,0) 360deg)";

function AnimatedWord({
  word,
  progress,
  range,
  reduced,
}: {
  word: Word;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
}) {
  const peak = word.key ? 1 : 0.72;
  const amount = useTransform(progress, (v) =>
    reduced ? 1 : Math.min(Math.max((v - range[0]) / (range[1] - range[0]), 0), 1)
  );
  const opacity = useTransform(amount, (k) => DIM + (peak - DIM) * k);
  // Keywords pull into focus, from soft blur to sharp, as they light up.
  const filter = useTransform(amount, (k) =>
    word.key
      ? `blur(${((1 - k) * 8).toFixed(2)}px) drop-shadow(0 0 22px rgba(52,211,153,${(0.45 * k).toFixed(2)}))`
      : "none"
  );

  return (
    <>
      <motion.span
        style={{ opacity, filter }}
        className={
          word.key
            ? "inline-block bg-[linear-gradient(100deg,#ffffff_0%,#f0fff8_35%,#8ef5cd_58%,#ffffff_88%)] bg-[length:220%_100%] bg-clip-text px-[0.04em] font-serif text-[1.18em] italic leading-none tracking-[-0.01em] text-transparent motion-safe:animate-[shimmer-text_7s_ease-in-out_infinite]"
            : "inline-block font-heading font-light"
        }
      >
        {word.text}
      </motion.span>
      {word.after && (
        <motion.span style={{ opacity }} className="font-heading font-light">
          {word.after}
        </motion.span>
      )}{" "}
    </>
  );
}

function BlackHole({ children }: { children?: ReactNode }) {
  return (
    <div className="relative aspect-square w-[min(118vw,760px)]">
      <div className="absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.16),transparent_58%)]" />

      {/* Photon ring: the lensed glow hugging the shadow. */}
      <div className="absolute inset-[18%]">
        <div
          className="h-full w-full rounded-full blur-[4px] motion-safe:animate-[spin-slow_26s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(62, 76) }}
        />
      </div>

      {/* Accretion disk, back half: tucked behind the shadow. */}
      <div className="absolute inset-0 opacity-55 [transform:rotate(-9deg)_scaleY(0.24)]">
        <div
          className="h-full w-full rounded-full blur-[3px] motion-safe:animate-[spin-slow_16s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(46, 86) }}
        />
      </div>

      {/* Event horizon. */}
      <div className="absolute inset-[30%] rounded-full bg-black shadow-[0_0_60px_18px_rgba(0,0,0,0.85),inset_0_0_40px_rgba(52,211,153,0.12)]" />

      {/* Accretion disk, front half: crosses in front of the shadow. */}
      <div className="absolute inset-0 opacity-55 [clip-path:inset(50%_0_0_0)] [transform:rotate(-9deg)_scaleY(0.24)]">
        <div
          className="h-full w-full rounded-full blur-[3px] motion-safe:animate-[spin-slow_16s_linear_infinite]"
          style={{ background: DISK_GRADIENT, ...ring(46, 86) }}
        />
      </div>
      {children}
    </div>
  );
}

export function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const holeScale = useTransform(scrollYProgress, (v) => (reduced ? 1 : 0.86 + v * 0.3));

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const holeX = useTransform(smoothX, (v) => v * 36);
  const holeY = useTransform(smoothY, (v) => v * 36);
  const textX = useTransform(smoothX, (v) => v * -10);
  const textY = useTransform(smoothY, (v) => v * -10);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const step = (REVEAL_END - REVEAL_START) / WORDS.length;

  return (
    <section ref={sectionRef} className="relative h-[220svh] bg-brand">
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#000_0%,#020805_20%,#05261a_38%,#07714b_64%,#0a9a65_90%)]"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ x: holeX, y: holeY, scale: holeScale }}
        >
          <BlackHole />
        </motion.div>

        <motion.figure className="relative z-10 px-6 text-center text-white" style={{ x: textX, y: textY }}>
          <blockquote className="relative mx-auto max-w-[17ch] text-[clamp(32px,4.6vw,76px)] leading-[1.14] tracking-[-0.03em] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[0.55em] left-0 select-none font-serif text-[2.6em] leading-none text-accent-1/50 md:-left-[0.7em]"
            >
              &ldquo;
            </span>
            {WORDS.map((word, i) => (
              <AnimatedWord
                key={word.text}
                word={word}
                progress={scrollYProgress}
                range={[REVEAL_START + i * step, REVEAL_START + (i + 2.5) * step]}
                reduced={reduced}
              />
            ))}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[0.95em] right-0 select-none font-serif text-[2.6em] leading-none text-accent-1/50 md:-right-[0.6em]"
            >
              &rdquo;
            </span>
          </blockquote>
          <figcaption className="label-mono mt-14 text-white/55">&mdash; The NeeoGreen belief</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
