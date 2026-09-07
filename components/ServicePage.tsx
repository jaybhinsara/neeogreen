import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SERVICES } from "@/lib/site";

export type ServiceContent = {
  slug: (typeof SERVICES)[number]["slug"];
  title: string;
  eyebrow: string;
  intro: string;
  deliverables: string[];
  process: { title: string; desc: string }[];
  whyTitle: string;
  whyBody: string;
};

export function ServicePage({ content }: { content: ServiceContent }) {
  const n = SERVICES.find((s) => s.slug === content.slug)?.n ?? "01";
  const others = SERVICES.filter((s) => s.slug !== content.slug);

  return (
    <>
      <Header />
      <main className="pb-24 pt-40 md:pb-40 md:pt-48">
        <Container>
          <Reveal>
            <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
              {n}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="mt-4 block text-xs uppercase tracking-[0.14em] text-muted-on-dark">
              {content.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(36px,7vw,96px)] font-semibold uppercase leading-[0.96] tracking-[-0.02em] text-ink-on-dark">
              {content.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl text-lg text-muted-on-dark md:text-xl">
              {content.intro}
            </p>
          </Reveal>

          <div className="mt-20 grid gap-16 border-t border-line-on-dark pt-16 md:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em] text-ink-on-dark md:text-3xl">
                What&rsquo;s included
              </h2>
              <ul className="mt-8 flex flex-col gap-4">
                {content.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-on-dark md:text-base">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full accent-gradient" />
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em] text-ink-on-dark md:text-3xl">
                {content.whyTitle}
              </h2>
              <p className="mt-8 text-[15px] leading-relaxed text-muted-on-dark md:text-base">
                {content.whyBody}
              </p>
            </Reveal>
          </div>

          <div className="mt-20 border-t border-line-on-dark pt-16">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold uppercase tracking-[-0.01em] text-ink-on-dark md:text-3xl">
                How it runs
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-4 md:gap-8">
              {content.process.map((step, i) => (
                <Reveal key={step.title} delay={0.08 * i}>
                  <div className="flex flex-col gap-3">
                    <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-lg font-semibold uppercase tracking-[-0.01em] text-ink-on-dark">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-start gap-8 border-t border-line-on-dark pt-16 md:flex-row md:items-center md:justify-between">
            <Reveal>
              <h2 className="max-w-lg font-display text-[clamp(26px,3.6vw,44px)] font-semibold uppercase leading-[1.05] tracking-[-0.01em] text-ink-on-dark">
                Let&rsquo;s talk about your {content.title.toLowerCase()}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full accent-gradient px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
              >
                Start a project
              </Link>
            </Reveal>
          </div>

          <div className="mt-16 border-t border-line-on-dark pt-10">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
              Also see
            </span>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="font-display text-lg uppercase tracking-[-0.01em] text-ink-on-dark transition-colors hover:accent-gradient-text"
                >
                  {s.title} &rarr;
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
