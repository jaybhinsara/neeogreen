import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden border-y border-line-on-dark py-24 md:py-40">
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-60"
      >
        <source src="/video/hero-leaf.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-bg-primary/50"
      />

      <Container className="relative z-10">
        <Reveal>
          <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
            Our philosophy
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-5xl font-display text-[clamp(26px,4.2vw,56px)] font-medium leading-[1.18] tracking-[-0.01em] text-ink-on-dark">
            Downtime, a breach, and a system that can&rsquo;t scale
            aren&rsquo;t three separate problems.{" "}
            <span className="accent-gradient-text">
              One team should own all three — not three vendors
              who&rsquo;ve never spoken.
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
