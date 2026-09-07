import { Container } from "./Container";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    desc: "Menu, margins, and shipping realities — we learn the brand before we sketch a single die-line.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Concepts, material options, and a packaging system that carries the brand across every SKU.",
  },
  {
    n: "03",
    title: "Prototype & Sample",
    desc: "Physical samples in hand before commitment — structure, print, and material tested together.",
  },
  {
    n: "04",
    title: "Produce & Launch",
    desc: "Production handoff, quality checks, and launch-ready social assets shipped alongside the packaging.",
  },
];

export function Process() {
  return (
    <section className="bg-bg-inverse py-24 text-ink-on-light md:py-40">
      <Container>
        <Reveal>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-on-light">
            How we work
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(32px,5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-light">
            Four steps, no guesswork
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-line-on-light pt-10 md:grid-cols-4 md:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={0.08 * i}>
              <div className="flex flex-col gap-4">
                <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-semibold uppercase tracking-[-0.01em] text-ink-on-light">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-on-light">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
