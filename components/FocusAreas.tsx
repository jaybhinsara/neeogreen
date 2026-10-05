"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";
import { SERVICES } from "@/lib/site";

const TAGS: Record<(typeof SERVICES)[number]["slug"], [string, string, string]> = {
  "ai-engineering": ["AI chatbots", "LLM integration", "AI agents"],
  "web-development": ["Business websites", "Web apps", "Customer portals"],
  "web-design": ["UI/UX design", "Design systems", "Prototypes"],
  "software-engineering": ["Custom software", "Internal tools", "Integrations"],
  "managed-it-support": ["Help desk", "24/7 monitoring", "On-site support"],
  cybersecurity: ["Endpoint security", "Backups", "Disaster recovery"],
  "cloud-solutions": ["Microsoft 365", "AWS & Azure", "Cost control"],
};

export function FocusAreas() {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardX = useSpring(x, { stiffness: 260, damping: 28 });
  const cardY = useSpring(y, { stiffness: 260, damping: 28 });

  // Places the card at a screen point, in the list's coordinates. `glue`
  // skips the spring so the card stays locked to a cursor that isn't moving
  // while the page scrolls underneath it.
  function place(clientX: number, clientY: number, glue: boolean) {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = clientX - rect.left;
    const ny = clientY - rect.top;
    x.set(nx);
    y.set(ny);
    // While the card is hidden, keep it glued to the cursor so it appears in
    // place instead of springing in from the list's top-left corner.
    if (glue || active === null) {
      cardX.jump(nx);
      cardY.jump(ny);
    }
  }

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    place(e.clientX, e.clientY, false);
  }

  // Scrolling moves the list under a still cursor without firing any mouse
  // events, so on scroll re-place the card under the last known cursor
  // position and re-pick the row beneath it (or hide the card if the cursor
  // is no longer over the list).
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let pointer: { x: number; y: number } | null = null;
    const onPointerMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
    };
    const onScroll = () => {
      const list = listRef.current;
      if (!pointer || !list) return;
      const rect = list.getBoundingClientRect();
      const inside =
        pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom;
      if (!inside) {
        if (activeRef.current !== null) setActive(null);
        return;
      }
      const row = document.elementFromPoint(pointer.x, pointer.y)?.closest<HTMLElement>("[data-focus-index]");
      const index = row ? Number(row.dataset.focusIndex) : null;
      if (index !== activeRef.current) setActive(index);
      place(pointer.x, pointer.y, true);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
    // place/setters are stable for this component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeService = active === null ? null : SERVICES[active];

  return (
    <section id="services" className="bg-paper py-28 md:py-40">
      <Container>
        <Reveal>
          <span className="label-mono text-brand">Focus areas</span>
        </Reveal>

        <div
          ref={listRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setActive(null)}
          className="relative mt-10"
        >
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={0.04 * i}>
              <Link
                href={`/services/${s.slug}`}
                data-focus-index={i}
                onMouseEnter={() => setActive(i)}
                className="grid gap-4 border-b border-line py-5 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:py-6"
              >
                <h3
                  className={cn(
                    "font-heading text-[clamp(32px,4.6vw,72px)] font-normal leading-none tracking-[-0.04em] text-ink transition-colors duration-300",
                    active === i ? "md:text-ink" : "md:text-faint"
                  )}
                >
                  {s.title}
                </h3>
                <ul
                  className={cn(
                    "flex flex-wrap gap-x-8 gap-y-2 text-muted transition-colors duration-300",
                    active === i ? "md:text-ink" : "md:text-faint"
                  )}
                >
                  {TAGS[s.slug].map((tag) => (
                    <li key={tag} className="label-mono md:w-28">
                      {tag}
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}

          <AnimatePresence>
            {activeService && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.2 }}
                style={{ x: cardX, y: cardY }}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden w-80 -translate-x-1/2 -translate-y-[calc(100%+24px)] rounded-lg bg-brand p-6 text-white shadow-[0_24px_60px_rgba(11,15,13,0.25)] md:block"
              >
                <span className="label-mono text-white/70">{activeService.eyebrow}</span>
                <p className="mt-3 text-[15px] leading-relaxed">{activeService.short}</p>
                <span className="label-mono mt-5 inline-block">View service &rarr;</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
