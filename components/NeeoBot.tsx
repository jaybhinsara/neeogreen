"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { openBookCall } from "@/lib/book-call";

// Neeo, the studio's pixel-art AI bot. The artwork is one sprite; the parts
// that make it feel alive are layered over it: pupils that follow the cursor,
// blinks, a glowing tablet, speech bubbles, and a body that breathes, hops
// around its corner, and turns to face where it's going.

// Overlay positions as % of the sprite, measured from the artwork.
const EYES = [
  { white: { x: 24.3, y: 43.4, w: 18.6, h: 15.8 }, pupil: { x: 33.2, y: 47.8, w: 5.7, h: 7.8 } },
  { white: { x: 53.7, y: 43.4, w: 18.5, h: 15.8 }, pupil: { x: 58.6, y: 47.8, w: 5.7, h: 7.8 } },
];
const EYE_WHITE = "#b9eee7";
const PUPIL = "#01092d";
const TABLET = { x: 66, y: 66, w: 30, h: 33 };

const LINES = [
  "Hi, I'm Neeo.",
  "Need an AI chatbot?",
  "I answer customers around the clock.",
  "I can read your documents for you.",
  "Tap me to book a call.",
];
const TYPING_LINES = ["Training a model…", "Reading your docs…", "Drafting a reply…"];

const HOP = 34; // px per hop
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function NeeoBot({ range = 300 }: { range?: number }) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [bubbleText, setBubble] = useState<string | null>(null);
  // With reduced motion Neeo stays put and simply introduces itself.
  const prefersReduced = useReducedMotion();
  const bubble = prefersReduced ? LINES[0] : bubbleText;
  const [blink, setBlink] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const mover = moverRef.current;
    const flip = flipRef.current;
    const squash = squashRef.current;
    const shadow = shadowRef.current;
    if (!root || !mover || !flip || !squash || !shadow) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canWalk = window.matchMedia("(min-width: 1024px)").matches && !reduced;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let alive = true;
    let visible = false;
    let hovering = false;
    let x = 0;
    let facing = 1;
    let line = 0;

    const setFacing = (f: number) => {
      facing = f;
      flip.style.transform = `scaleX(${f})`;
    };

    // Pupils look toward a point, in px relative to the bot's eye line.
    const look = (dx: number, dy: number) => {
      const w = root.offsetWidth;
      const len = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, len / 240);
      const px = (dx / len) * reach * w * 0.026 * facing;
      const py = (dy / len) * reach * w * 0.024;
      root.style.setProperty("--look-x", `${px.toFixed(2)}px`);
      root.style.setProperty("--look-y", `${py.toFixed(2)}px`);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      look(e.clientX - (r.left + r.width * 0.48), e.clientY - (r.top + r.height * 0.52));
    };
    if (fine) window.addEventListener("pointermove", onPointerMove, { passive: true });

    const say = async (text: string, ms = 2600) => {
      setBubble(text);
      await wait(ms);
      if (!hovering) setBubble(null);
    };

    const hop = async (to: number) => {
      await Promise.all([
        animate(mover, { x: to, y: [0, -16, 0] }, { duration: 0.38, ease: "easeOut" }),
        animate(shadow, { scale: [1, 0.7, 1], opacity: [0.35, 0.18, 0.35] }, { duration: 0.38 }),
      ]);
      await animate(squash, { scaleY: [1, 0.88, 1], scaleX: [1, 1.08, 1] }, { duration: 0.2 });
    };

    const walk = async () => {
      const target = -Math.round(rand(0, range));
      if (Math.abs(target - x) < HOP) return;
      setFacing(target < x ? -1 : 1);
      while (alive && !hovering && Math.abs(target - x) >= HOP / 2) {
        x += Math.sign(target - x) * Math.min(HOP, Math.abs(target - x));
        await hop(x);
      }
      setFacing(1);
    };

    const tapTablet = async () => {
      setTyping(true);
      void say(TYPING_LINES[Math.floor(Math.random() * TYPING_LINES.length)], 2000);
      await wait(2000);
      setTyping(false);
    };

    // Idle behaviour: pause, then walk, work, or talk.
    const behave = async () => {
      await wait(1200);
      if (!alive) return;
      if (visible) await say(LINES[line++ % LINES.length]);
      while (alive) {
        await wait(rand(1800, 3800));
        if (!alive || !visible || hovering) continue;
        const roll = Math.random();
        if (canWalk && roll < 0.45) await walk();
        else if (roll < 0.7) await tapTablet();
        else await say(LINES[line++ % LINES.length]);
      }
    };
    if (!reduced) void behave();

    // Blinks on their own clock, and an idle glance around without a mouse.
    let blinkTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(async () => {
        setBlink(true);
        await wait(130);
        setBlink(false);
        if (alive) scheduleBlink();
      }, rand(2200, 5200));
    };
    if (!reduced) scheduleBlink();
    let glanceTimer = 0;
    if (!fine && !reduced) {
      glanceTimer = window.setInterval(() => look(rand(-1, 1) * 200, rand(-0.6, 0.6) * 200), 2600);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(root);

    const onEnter = () => {
      hovering = true;
      setBubble("Tap me to book a call.");
      void animate(squash, { rotate: [0, -6, 6, -4, 0] }, { duration: 0.6 });
    };
    const onLeave = () => {
      hovering = false;
      setBubble(null);
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      alive = false;
      io.disconnect();
      window.clearTimeout(blinkTimer);
      window.clearInterval(glanceTimer);
      window.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [range]);

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={openBookCall}
      aria-label="Neeo, our AI assistant. Book a call"
      className="group relative block w-full cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div ref={moverRef} className="relative will-change-transform">
        <AnimatePresence>
          {bubble && (
            <motion.span
              key={bubble}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute bottom-[104%] left-1/2 w-max max-w-[220px] -translate-x-1/2 rounded-[14px_14px_14px_4px] bg-night px-3.5 py-2 text-left text-[13px] font-medium leading-snug text-white shadow-[0_10px_30px_-10px_rgba(5,7,6,0.5)]"
            >
              {bubble}
            </motion.span>
          )}
        </AnimatePresence>

        <div ref={flipRef} className="transition-transform duration-200">
          <div ref={squashRef} className="origin-bottom">
            <div className="relative origin-bottom motion-safe:animate-[neeo-breathe_2.6s_ease-in-out_infinite]">
              {/* eslint-disable-next-line @next/next/no-img-element -- small decorative sprite, sized by its container */}
              <img
                src="/mascot/neeo.webp"
                alt=""
                width={285}
                height={320}
                draggable={false}
                className="block h-auto w-full select-none"
              />

              {EYES.map((eye, i) => (
                <span key={i} aria-hidden="true">
                  {/* Paint over the drawn pupil so ours can move. */}
                  <span
                    className="absolute"
                    style={{
                      left: `${eye.pupil.x - 0.6}%`,
                      top: `${eye.pupil.y - 0.6}%`,
                      width: `${eye.pupil.w + 1.2}%`,
                      height: `${eye.pupil.h + 1.2}%`,
                      background: EYE_WHITE,
                    }}
                  />
                  <span
                    className="absolute transition-transform duration-150 ease-out"
                    style={{
                      left: `${eye.pupil.x}%`,
                      top: `${eye.pupil.y}%`,
                      width: `${eye.pupil.w}%`,
                      height: `${eye.pupil.h}%`,
                      background: PUPIL,
                      transform: "translate(var(--look-x, 0px), var(--look-y, 0px))",
                      opacity: blink ? 0 : 1,
                    }}
                  >
                    <span className="absolute left-[18%] top-[14%] h-[26%] w-[30%] bg-white/90" />
                  </span>
                  {blink && (
                    <span
                      className="absolute flex items-center justify-center rounded-full"
                      style={{
                        left: `${eye.white.x + eye.white.w * 0.12}%`,
                        top: `${eye.white.y + eye.white.h * 0.12}%`,
                        width: `${eye.white.w * 0.76}%`,
                        height: `${eye.white.h * 0.76}%`,
                        background: EYE_WHITE,
                      }}
                    >
                      <span className="h-[12%] w-[60%] rounded-full" style={{ background: PUPIL }} />
                    </span>
                  )}
                </span>
              ))}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-md mix-blend-screen transition-opacity duration-300"
                style={{
                  left: `${TABLET.x}%`,
                  top: `${TABLET.y}%`,
                  width: `${TABLET.w}%`,
                  height: `${TABLET.h}%`,
                  background: "radial-gradient(circle at 50% 45%, rgba(142,245,205,0.95), rgba(52,211,153,0.35) 55%, transparent 75%)",
                  opacity: typing ? 1 : 0,
                  animation: typing ? "neeo-glow 0.45s ease-in-out infinite alternate" : undefined,
                }}
              />
            </div>
          </div>
        </div>

        <div
          ref={shadowRef}
          aria-hidden="true"
          className="mx-auto -mt-1 h-2.5 w-[58%] rounded-[50%] bg-ink/35 blur-[3px]"
        />
      </div>
    </button>
  );
}
