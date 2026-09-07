"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let targetScale = 1;
    let scale = 1;
    let raf: number;

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (dot) dot.style.opacity = "1";
    }

    function tick() {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      scale += (targetScale - scale) * 0.25;
      if (dot) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf = requestAnimationFrame(tick);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, label");
      targetScale = interactive ? 2.6 : 1;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-3 w-3 rounded-full bg-ink-on-dark opacity-0 mix-blend-difference transition-opacity duration-150 ease-out pointer-fine:block"
    />
  );
}
