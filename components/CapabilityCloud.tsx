"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

const WORDS: { text: string; big?: boolean }[] = [
  { text: "Managed IT Support", big: true },
  { text: "Help Desk" },
  { text: "Cloud Migration", big: true },
  { text: "Network Setup" },
  { text: "Data Backup" },
  { text: "Cybersecurity", big: true },
  { text: "Endpoint Protection" },
  { text: "IT Consulting" },
  { text: "Software Development", big: true },
  { text: "Disaster Recovery" },
  { text: "System Integration" },
  { text: "24/7 Monitoring" },
];

export function CapabilityCloud() {
  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-3 py-4 md:gap-x-7">
      {WORDS.map((w, i) => (
        <Reveal key={w.text} delay={0.03 * i}>
          <motion.span
            whileHover={{ scale: 1.22 }}
            transition={{ type: "spring", stiffness: 380, damping: 14 }}
            className={cn(
              "inline-block cursor-default font-display uppercase tracking-[-0.01em] text-muted-on-dark transition-colors duration-200 hover:text-ink-on-dark",
              w.big ? "text-2xl text-ink-on-dark md:text-4xl" : "text-base md:text-xl"
            )}
          >
            {w.text}
          </motion.span>
        </Reveal>
      ))}
    </div>
  );
}
