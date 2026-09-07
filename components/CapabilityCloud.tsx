import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

const WORDS: { text: string; big?: boolean }[] = [
  { text: "Packaging Design", big: true },
  { text: "Dielines" },
  { text: "Brand Identity", big: true },
  { text: "Material Sourcing" },
  { text: "Guidelines" },
  { text: "Print Production", big: true },
  { text: "Kraft & PLA" },
  { text: "Social Templates" },
  { text: "Launch Assets", big: true },
  { text: "Compostable Stock" },
  { text: "Content Direction" },
  { text: "Packaging Systems", big: true },
];

export function CapabilityCloud() {
  return (
    <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-3 py-4 md:gap-x-7">
      {WORDS.map((w, i) => (
        <Reveal key={w.text} delay={0.03 * i}>
          <span
            className={cn(
              "font-display uppercase tracking-[-0.01em] text-muted-on-dark",
              w.big ? "text-2xl text-ink-on-dark md:text-4xl" : "text-base md:text-xl"
            )}
          >
            {w.text}
          </span>
        </Reveal>
      ))}
    </div>
  );
}
