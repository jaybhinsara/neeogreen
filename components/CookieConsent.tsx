"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Emphasis } from "./Emphasis";
import { OPEN_SETTINGS_EVENT, readConsent, writeConsent, type Consent } from "@/lib/consent";

// Waits for the intro loader to clear before appearing to a first-time visitor.
const FIRST_VISIT_DELAY_MS = 2600;

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = readConsent() ? undefined : window.setTimeout(() => setOpen(true), FIRST_VISIT_DELAY_MS);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
    };
  }, []);

  function choose(value: Consent) {
    writeConsent(value);
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[90] rounded-[20px_5px_20px_5px] bg-[#06140e]/90 p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(52,211,153,0.16),0_24px_60px_-20px_rgba(5,7,6,0.7)] backdrop-blur-xl md:inset-x-auto md:bottom-6 md:left-6 md:w-[400px]"
        >
          <p className="font-heading text-2xl font-medium tracking-[-0.03em]">
            Cookies, <Emphasis>briefly</Emphasis>.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">
            We only use what the site needs to work. With your OK we also use
            Google tools to measure which of our ads bring enquiries. We never
            sell your data. Read our{" "}
            <Link href="/cookies" className="underline decoration-accent-1/60 underline-offset-2 hover:text-white">
              cookie policy
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => choose("all")}
              className="label-mono rounded-[12px_3px_12px_3px] bg-brand px-5 py-3 text-white transition-colors hover:bg-brand-deep"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => choose("essential")}
              className="label-mono rounded-[12px_3px_12px_3px] px-5 py-3 text-white/85 ring-1 ring-white/25 transition-colors hover:text-white hover:ring-white/50"
            >
              Essential only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
