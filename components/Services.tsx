import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { MicroTag } from "./MicroTag";
import { CapabilityCloud } from "./CapabilityCloud";

const SERVICES = [
  {
    n: "01",
    title: "Packaging Design",
    desc: "Custom paper cups, food boxes, mailers and bags — from concept sketches to print-ready dielines, plus guidance on eco material sourcing (PLA-lined, kraft, compostable stock).",
    tags: [{ glyph: "design", label: "Concept" }, { glyph: "build", label: "Dielines" }] as const,
  },
  {
    n: "02",
    title: "Brand Identity",
    desc: "Logo, brand guidelines, and a packaging system that carries across every SKU and touchpoint — so packaging and brand are designed together, not bolted on after.",
    tags: [{ glyph: "design", label: "Identity" }, { glyph: "build", label: "Guidelines" }] as const,
  },
  {
    n: "03",
    title: "Social & Digital Presence",
    desc: "Content design, social templates, and launch assets that show the packaging in the real world — product photography direction, reels/post templates, and a launch-ready presence.",
    tags: [{ glyph: "design", label: "Content" }, { glyph: "ship", label: "Launch" }] as const,
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 md:py-40">
      <Container>
        <Reveal>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
            What we do
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(32px,5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark">
            Three disciplines, one studio
          </h2>
        </Reveal>

        <div className="mt-16 border-y border-line-on-dark">
          <CapabilityCloud />
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={0.1 * i}>
              <div className="flex h-full flex-col gap-6 border-b border-line-on-dark py-10 md:border-b-0 md:border-r md:py-14 md:pr-10 [&:last-child]:md:border-r-0">
                <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                  {s.n}
                </span>
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em] text-ink-on-dark md:text-3xl">
                  {s.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-on-dark md:text-base">
                  {s.desc}
                </p>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-2">
                  {s.tags.map((t) => (
                    <MicroTag key={t.label} glyph={t.glyph}>
                      {t.label}
                    </MicroTag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
