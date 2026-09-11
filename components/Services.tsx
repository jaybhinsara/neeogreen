import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { MicroTag } from "./MicroTag";
import { CapabilityCloud } from "./CapabilityCloud";
import { SERVICES } from "@/lib/site";

const TAGS: Record<string, { glyph: "design" | "build" | "ship"; label: string }[]> = {
  "brand-identity": [
    { glyph: "design", label: "Strategy" },
    { glyph: "build", label: "Guidelines" },
  ],
  "packaging-design": [
    { glyph: "design", label: "Concept" },
    { glyph: "build", label: "Dielines" },
  ],
  "digital-marketing": [
    { glyph: "design", label: "Content" },
    { glyph: "ship", label: "Launch" },
  ],
};

export function Services() {
  return (
    <section id="services" className="py-24 md:py-40">
      <Container>
        <Reveal>
          <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
            What we do
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(32px,5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark">
            Three disciplines, one studio
            <span className="accent-gradient-text">.</span>
          </h2>
        </Reveal>

        <div className="mt-16 border-y border-line-on-dark">
          <CapabilityCloud />
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={0.1 * i}>
              <div className="flex h-full flex-col gap-6 border-b border-line-on-dark py-10 md:border-b-0 md:border-r md:py-14 md:pr-10 [&:last-child]:md:border-r-0">
                <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                  {s.n}
                </span>
                <h3 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em] text-ink-on-dark md:text-3xl">
                  {s.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-on-dark md:text-base">
                  {s.short}
                </p>
                <div className="mt-auto flex flex-col gap-4 pt-2">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {TAGS[s.slug].map((t) => (
                      <MicroTag key={t.label} glyph={t.glyph}>
                        {t.label}
                      </MicroTag>
                    ))}
                  </div>
                  <Link
                    href={`/services/${s.slug}`}
                    className="inline-flex w-fit items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-ink-on-dark transition-colors hover:accent-gradient-text"
                  >
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
