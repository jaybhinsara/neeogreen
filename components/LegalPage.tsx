import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

export type LegalSection = { id: string; heading: string; body: ReactNode };

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: ReactNode;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <Header />
      <main>
        <section className="bg-page pb-16 pt-40 md:pb-24 md:pt-52">
          <Container>
            <Reveal>
              <span className="label-mono text-brand">{eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 max-w-[14ch] font-heading text-[clamp(44px,6.4vw,104px)] font-medium leading-[0.98] tracking-[-0.045em]">
                {title}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="label-mono mt-10 text-muted">Last updated {updated}</p>
              <div className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted md:text-xl">{intro}</div>
            </Reveal>
          </Container>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <Container className="grid gap-12 md:grid-cols-[220px_1fr] md:gap-20">
            <nav aria-label="On this page" className="hidden md:block">
              <div className="sticky top-36 flex flex-col gap-3">
                <span className="label-mono text-muted">On this page</span>
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="text-[15px] text-ink/70 transition-colors hover:text-brand">
                    {s.heading}
                  </a>
                ))}
              </div>
            </nav>

            <div className="max-w-[68ch]">
              {sections.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-32 border-t border-line py-10 first:border-t-0 first:pt-0"
                >
                  <h2 className="flex items-baseline gap-4 font-serif text-[clamp(30px,2.8vw,40px)] italic leading-tight tracking-[-0.01em]">
                    <span className="label-mono not-italic text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {s.heading}
                  </h2>
                  <div className="mt-5 text-[17px] leading-relaxed text-ink/80 [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-2 [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-brand">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
