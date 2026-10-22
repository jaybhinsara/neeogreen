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
    let raf = 0;

    function wake() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (dot) dot.style.opacity = "1";
      wake();
    }

    function tick() {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      scale += (targetScale - scale) * 0.25;
      const settled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 && Math.abs(targetScale - scale) < 0.005;
      if (settled) {
        x = tx;
        y = ty;
        scale = targetScale;
      }
      if (dot) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      raf = settled ? 0 : requestAnimationFrame(tick);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, textarea, label");
      targetScale = interactive ? 2.6 : 1;
      wake();
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

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
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-3 w-3 rounded-full bg-white opacity-0 mix-blend-difference transition-opacity duration-150 ease-out pointer-fine:block"
    />
  );
}
