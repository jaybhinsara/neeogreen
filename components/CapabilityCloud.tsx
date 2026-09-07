import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

const WORDS: { text: string; big?: boolean }[] = [
  { text: "Brand Strategy", big: true },
  { text: "Logo Design" },
  { text: "Packaging Design", big: true },
  { text: "Dielines" },
  { text: "Brand Guidelines" },
  { text: "Social Media Marketing", big: true },
  { text: "Material Sourcing" },
  { text: "Content Design" },
  { text: "Campaign Assets", big: true },
  { text: "Compostable Stock" },
  { text: "Launch Strategy" },
  { text: "Digital Presence", big: true },
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
