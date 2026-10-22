"use client";

import { useEffect, type RefObject } from "react";

// Looping CSS animations keep ticking (and repainting) while scrolled out of
// view, which keeps the browser busy on every frame. This marks the element
// data-offscreen while it's out of view; globals.css pauses every animation
// inside it until it comes back.
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete el.dataset.offscreen;
      else el.dataset.offscreen = "";
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
