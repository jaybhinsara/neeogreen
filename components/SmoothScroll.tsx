"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis, scrollToHash } from "@/lib/lenis-singleton";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
    setLenis(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // land correctly on a hash the page was loaded/navigated to (e.g. /#services)
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
