import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Manifesto() {
  return (
    <section id="studio" className="border-y border-line-on-dark py-24 md:py-40">
      <Container>
        <Reveal>
          <p className="max-w-5xl font-display text-[clamp(26px,4.2vw,56px)] font-medium leading-[1.18] tracking-[-0.01em] text-ink-on-dark">
            A brand isn&rsquo;t just a logo, and it isn&rsquo;t just a box.
            It&rsquo;s the name someone remembers, the packaging they
            photograph, the feed they follow.{" "}
            <span className="accent-gradient-text">
              NeeoGreen builds all three as one studio — not three separate
              vendors who&rsquo;ve never spoken to each other.
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
