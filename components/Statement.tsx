import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Statement() {
  return (
    <section className="bg-block-emerald py-20 md:py-32">
      <Container>
        <Reveal>
          <p className="text-center font-display text-[clamp(24px,4vw,52px)] font-semibold uppercase leading-[1.12] tracking-[-0.01em] text-ink-on-dark">
            Web, software, and IT —{" "}
            <span className="text-accent-2">one team, not three vendors.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
