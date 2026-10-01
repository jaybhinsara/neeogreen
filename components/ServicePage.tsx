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
      <main>
        <section className="bg-page pb-24 pt-40 md:pb-32 md:pt-52">
          <Container>
            <Reveal>
              <span className="label-mono text-brand">
                {n} &mdash; {content.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 max-w-[14ch] font-heading text-[clamp(44px,7vw,112px)] font-medium leading-[0.98] tracking-[-0.045em]">
                {content.title}
              </h1>
            </Reveal>
            <div className="mt-12 flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <Reveal delay={0.1}>
                <p className="max-w-[46ch] text-lg leading-relaxed text-muted md:text-xl">{content.intro}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <Link
                  href="/contact"
                  className="label-mono inline-flex rounded-md bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep"
                >
                  Book a call
                </Link>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-paper py-24 md:py-32">
          <Container className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <Reveal>
              <span className="label-mono text-brand">What&rsquo;s included</span>
            </Reveal>
            <ul>
              {content.deliverables.map((d, i) => (
                <Reveal key={d} delay={0.05 * i}>
                  <li className="flex gap-6 border-t border-line py-6 text-lg leading-snug">
                    <span className="label-mono pt-1.5 text-faint">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </li>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>

        <section className="bg-brand py-28 text-white md:py-40">
          <Container className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <Reveal>
              <span className="label-mono text-white/70">Why it matters</span>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="max-w-[20ch] font-heading text-[clamp(30px,3.4vw,52px)] font-medium leading-[1.08] tracking-[-0.035em]">
                  {content.whyTitle}
                </h2>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-white/80">{content.whyBody}</p>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-page py-24 md:py-32">
          <Container>
            <Reveal>
              <span className="label-mono text-brand">How it runs</span>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-4 md:gap-8">
              {content.process.map((step, i) => (
                <Reveal key={step.title} delay={0.08 * i}>
                  <div className="flex flex-col gap-4 border-t border-line pt-6">
                    <span className="label-mono text-brand">0{i + 1}</span>
                    <h3 className="font-heading text-2xl font-medium tracking-[-0.03em]">{step.title}</h3>
                    <p className="text-[15px] leading-relaxed text-muted">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-paper py-24 md:py-32">
          <Container>
            <Reveal>
              <span className="label-mono text-brand">Also see</span>
            </Reveal>
            <div className="mt-8">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-center justify-between border-b border-line py-5"
                >
                  <span className="font-heading text-[clamp(26px,3.2vw,48px)] leading-none tracking-[-0.04em] text-faint transition-colors duration-300 group-hover:text-ink">
                    {s.title}
                  </span>
                  <span className="label-mono text-faint transition-colors duration-300 group-hover:text-ink">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
