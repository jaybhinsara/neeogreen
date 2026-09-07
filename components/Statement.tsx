import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Statement() {
  return (
    <section className="border-y border-line-on-dark py-16 md:py-24">
      <Container>
        <Reveal>
          <p className="text-center font-display text-[clamp(22px,3.4vw,40px)] font-semibold uppercase leading-[1.15] tracking-[-0.01em] text-ink-on-dark">
            Where brand, packaging, and digital stop being three vendors{" "}
            <span className="accent-gradient-text">and start being one studio.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
