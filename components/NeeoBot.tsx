"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { openBookCall } from "@/lib/book-call";

// Neeo, the studio's 3D AI bot. The render is one sprite; the parts that
// make it feel alive are layered over it: pupils that follow the cursor,
// blinks, a glowing tablet, speech bubbles, and a body that breathes, hops
// around its corner, and turns to face where it's going.

// Overlay positions as % of the sprite, measured from the artwork.
// The eyeballs are redrawn over the render so the pupils can move; boxes are
// % of the sprite, measured from the artwork.
const EYES = [
  { x: 26.9, y: 40.6, w: 15.5, h: 11.7 },
  { x: 56.2, y: 40.6, w: 14.9, h: 11.7 },
];
const TABLET = { x: 1, y: 60.5, w: 26.6, h: 22.2 };

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

export function NeeoBot({
  range = 300,
  avoidRef,
}: {
  range?: number;
  // Content Neeo must never walk over: it stops 24px short of its right edge.
  avoidRef?: RefObject<HTMLElement | null>;
}) {
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
      const px = (dx / len) * reach * w * 0.03 * facing;
      const py = (dy / len) * reach * w * 0.02;
      root.style.setProperty("--look-x", `${px.toFixed(2)}px`);
      root.style.setProperty("--look-y", `${py.toFixed(2)}px`);
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      look(e.clientX - (r.left + r.width * 0.49), e.clientY - (r.top + r.height * 0.45));
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
      let maxRange = range;
      const avoid = avoidRef?.current;
      if (avoid) {
        const homeLeft = root.getBoundingClientRect().left - x;
        maxRange = Math.min(range, homeLeft - avoid.getBoundingClientRect().right - 24);
      }
      if (maxRange < HOP) return;
      const target = -Math.round(rand(0, maxRange));
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
  }, [range, avoidRef]);

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
              className="pointer-events-none absolute right-[88%] top-[6%] w-max max-w-[180px] rounded-[14px_14px_4px_14px] bg-night px-3.5 py-2 text-left text-[13px] font-medium leading-snug text-white shadow-[0_10px_30px_-10px_rgba(5,7,6,0.5)] md:max-w-[220px]"
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
                width={450}
                height={560}
                draggable={false}
                className="block h-auto w-full select-none"
              />

              {EYES.map((eye, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute overflow-hidden rounded-[50%]"
                  style={{
                    left: `${eye.x}%`,
                    top: `${eye.y}%`,
                    width: `${eye.w}%`,
                    height: `${eye.h}%`,
                    background:
                      "radial-gradient(circle at 42% 34%, #ffffff 0%, #f5f7f6 42%, #dde3e1 78%, #c3cbc8 100%)",
                    boxShadow: "inset 0 -2px 5px rgba(0,0,0,0.18), 0 0 0 1px rgba(20,40,30,0.25)",
                  }}
                >
                  {/* Glossy oval pupil with the render's green floor reflection
                      and a top-right highlight; slides with --look-x/y. */}
                  <span
                    className="absolute left-1/2 top-1/2 h-[82%] w-[56%] rounded-[50%] transition-transform duration-150 ease-out"
                    style={{
                      transform:
                        "translate(calc(-50% + var(--look-x, 0px)), calc(-50% + var(--look-y, 0px)))",
                      background:
                        "radial-gradient(ellipse at 50% 92%, rgba(70,170,90,0.55) 0%, rgba(70,170,90,0) 45%), radial-gradient(circle at 40% 30%, #2a2a2a 0%, #0a0a0a 55%, #000 100%)",
                    }}
                  >
                    <span className="absolute left-[56%] top-[16%] h-[22%] w-[30%] rounded-full bg-white/95" />
                  </span>

                  {blink && (
                    <span
                      className="absolute inset-0 flex items-center justify-center rounded-[50%]"
                      style={{ background: "radial-gradient(circle at 50% 30%, #7bd65a, #4fbf45 70%, #3fae3c)" }}
                    >
                      <span className="mt-[12%] h-[34%] w-[70%] rounded-b-full border-b-[3px] border-[#123321]" />
                    </span>
                  )}

                  {/* Lens glare, as if behind the glasses. */}
                  <span className="pointer-events-none absolute -left-[10%] top-[6%] h-[30%] w-[60%] -rotate-[24deg] rounded-full bg-white/25 blur-[1px]" />
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
