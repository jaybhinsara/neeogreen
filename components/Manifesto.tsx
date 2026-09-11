import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Manifesto() {
  return (
    <section id="studio" className="border-y border-line-on-dark py-24 md:py-40">
      <Container>
        <Reveal>
          <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
            Our philosophy
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-5xl font-display text-[clamp(26px,4.2vw,56px)] font-medium leading-[1.18] tracking-[-0.01em] text-ink-on-dark">
            A brand isn&rsquo;t just a logo, and it isn&rsquo;t just a box.
            It&rsquo;s the name someone remembers, the packaging they
            photograph, the feed they follow.{" "}
            <span className="accent-gradient-text">
              One studio builds all three — not three vendors
              who&rsquo;ve never spoken.
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
