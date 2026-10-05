"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { openBookCall } from "@/lib/book-call";

// Neeo, the studio's 3D AI bot. The render is one sprite; the parts that
// make it feel alive are layered over it: pupils that follow the cursor,
// blinks, a glowing tablet, speech bubbles, and a body that breathes and
// walks around its corner on its own two legs, facing where it's going.

// Overlay positions as % of the sprite, measured from the artwork.
// The eyeballs are redrawn over the render so the pupils can move; boxes are
// % of the sprite, measured from the artwork.
const EYES = [
  { x: 26.9, y: 40.6, w: 15.5, h: 11.7 },
  { x: 56.2, y: 40.6, w: 14.9, h: 11.7 },
];
const TABLET = { x: 1, y: 60.5, w: 26.6, h: 22.2 };
// The legs are cut out of the render and drawn behind the body, so they can
// swing from the hip (20% down each layer, where the leg meets the belly).
// Their tops are rounded caps tucked up under the belly.
const LEGS = [
  { src: "/mascot/neeo-leg-l.webp", x: 22.67, y: 85, w: 24, h: 13.57 },
  { src: "/mascot/neeo-leg-r.webp", x: 50.67, y: 85, w: 23.56, h: 13.57 },
];

const LINES = [
  "Hi, I'm Neeo.",
  "Need an AI chatbot?",
  "I answer customers around the clock.",
  "I can read your documents for you.",
  "Tap me to book a call.",
];
const TYPING_LINES = ["Training a model…", "Reading your docs…", "Drafting a reply…"];

// One stride (both legs) in seconds, the hip swing in degrees, and the walk
// speed as a share of Neeo's width per second, matched to the swing so the
// planted foot doesn't skate.
const STRIDE = 0.5;
const SWING = 11;
const SPEED = 0.22;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function NeeoBot({
  range = 300,
  avoidRef,
  bubbleClassName = "top-[6%]",
}: {
  range?: number;
  // Content Neeo must never walk over: it stops 24px short of its right edge.
  avoidRef?: RefObject<HTMLElement | null>;
  // Vertical placement of the speech bubble, which opens to Neeo's left.
  bubbleClassName?: string;
}) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const bobRef = useRef<HTMLDivElement>(null);
  const legRefs = useRef<(HTMLImageElement | null)[]>([]);
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
    const bob = bobRef.current;
    const [legL, legR] = legRefs.current;
    if (!root || !mover || !flip || !squash || !bob || !legL || !legR) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canWalk = window.matchMedia("(min-width: 1024px)").matches && !reduced;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let alive = true;
    let visible = false;
    let hovering = false;
    let x = 0;
    let facing = 1;
    let line = 0;
    let stopWalk: (() => void) | null = null;

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

    // A walk cycle: each leg swings forward from the hip while lifted, then
    // stays planted and sweeps back as the body glides over it. The body
    // bobs and sways onto whichever leg is down.
    const stride = () => {
      const lift = -legL.offsetHeight * 0.16;
      const bounce = root.offsetWidth * 0.012;
      const loop = { duration: STRIDE, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] };
      const step = (leg: HTMLElement, dir: 1 | -1) => [
        animate(leg, { rotate: [0, SWING * dir, 0, -SWING * dir, 0] }, { ...loop, ease: "linear" }),
        animate(
          leg,
          { y: dir === 1 ? [0, 0, lift, 0, 0] : [lift, 0, 0, 0, lift] },
          {
            ...loop,
            ease: dir === 1 ? ["linear", "easeOut", "easeIn", "linear"] : ["easeIn", "linear", "linear", "easeOut"],
          },
        ),
      ];
      const controls = [
        ...step(legL, 1),
        ...step(legR, -1),
        animate(bob, { y: [0, -bounce, 0, -bounce, 0], rotate: [0, -1.2, 0, 1.2, 0] }, { ...loop, ease: "easeInOut" }),
      ];
      return () => {
        controls.forEach((c) => c.stop());
        // Settle back to standing on both feet.
        for (const el of [legL, legR, bob]) void animate(el, { rotate: 0, y: 0 }, { duration: 0.2, ease: "easeOut" });
      };
    };

    const currentX = () => new DOMMatrixReadOnly(getComputedStyle(mover).transform).m41;

    const walk = async () => {
      let maxRange = range;
      const avoid = avoidRef?.current;
      if (avoid) {
        const homeLeft = root.getBoundingClientRect().left - x;
        maxRange = Math.min(range, homeLeft - avoid.getBoundingClientRect().right - 24);
      }
      const minWalk = root.offsetWidth * 0.3;
      if (maxRange < minWalk) return;
      const target = -Math.round(rand(0, maxRange));
      const dist = Math.abs(target - x);
      if (dist < minWalk) return;
      setFacing(target < x ? -1 : 1);
      // Let the turn land, then glide at walking pace while the legs step.
      await wait(180);
      if (!alive || hovering) return setFacing(1);
      const stopStride = stride();
      await new Promise<void>((resolve) => {
        const glide = animate(mover, { x: target }, { duration: dist / (root.offsetWidth * SPEED), ease: "linear" });
        void glide.then(() => resolve());
        stopWalk = () => {
          glide.stop();
          resolve();
        };
      });
      stopWalk = null;
      stopStride();
      x = currentX();
      await wait(220);
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
      stopWalk?.();
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
      stopWalk?.();
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
              className={`pointer-events-none absolute right-[88%] ${bubbleClassName} w-max max-w-[180px] rounded-[14px_14px_4px_14px] bg-night px-3.5 py-2 text-left text-[13px] font-medium leading-snug text-white shadow-[0_10px_30px_-10px_rgba(5,7,6,0.5)] md:max-w-[220px]`}
            >
              {bubble}
            </motion.span>
          )}
        </AnimatePresence>

        <div ref={flipRef} className="transition-transform duration-200">
          <div ref={squashRef} className="relative origin-bottom">
            {LEGS.map((leg, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- decorative sprite layer
              <img
                key={leg.src}
                ref={(el) => {
                  legRefs.current[i] = el;
                }}
                src={leg.src}
                alt=""
                draggable={false}
                className="absolute select-none"
                style={{
                  left: `${leg.x}%`,
                  top: `${leg.y}%`,
                  width: `${leg.w}%`,
                  height: `${leg.h}%`,
                  transformOrigin: "50% 20%",
                }}
              />
            ))}
            <div ref={bobRef} className="relative origin-bottom">
              <div className="relative origin-bottom motion-safe:animate-[neeo-breathe_2.6s_ease-in-out_infinite]">
                {/* eslint-disable-next-line @next/next/no-img-element -- small decorative sprite, sized by its container */}
                <img
                  src="/mascot/neeo-body.webp"
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
        </div>

        <div
          aria-hidden="true"
          className="mx-auto -mt-1 h-2.5 w-[58%] rounded-[50%] bg-ink/35 blur-[3px]"
        />
      </div>
    </button>
  );
}
