"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DURATION_MS = 1400;
const HOLD_MS = 250;

export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(100);
      setExiting(true);
      return;
    }

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setProgress(Math.round(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setExiting(true), HOLD_MS);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.body.style.overflow = exiting ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [exiting]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl font-semibold uppercase tracking-[-0.02em] text-ink-on-dark md:text-3xl"
          >
            NeeoGreen
          </motion.span>

          <div className="mt-7 h-px w-40 overflow-hidden bg-line-on-dark md:w-56">
            <div className="h-full accent-gradient" style={{ width: `${progress}%` }} />
          </div>

          <span className="fixed bottom-8 left-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-on-dark md:left-16">
            Loading&hellip;
          </span>
          <span className="fixed bottom-8 right-6 font-mono text-[11px] tabular-nums text-muted-on-dark md:right-16">
            {progress}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
