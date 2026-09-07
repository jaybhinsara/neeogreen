import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-line-on-dark py-28 md:py-40">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative brand mark */}
      <img
        src="/logo/icon.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[160%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
      />
      <Container className="relative z-10 flex flex-col items-center gap-10 text-center">
        <Reveal>
          <h2 className="max-w-4xl font-display text-[clamp(32px,7vw,96px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark [overflow-wrap:anywhere]">
            Let&rsquo;s build a brand
            <br />
            people remember
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full accent-gradient px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
          >
            Start a project
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
