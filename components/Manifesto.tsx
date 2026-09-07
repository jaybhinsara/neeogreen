import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function Manifesto() {
  return (
    <section id="studio" className="border-y border-line-on-dark py-24 md:py-40">
      <Container>
        <Reveal>
          <p className="max-w-5xl font-display text-[clamp(26px,4.2vw,56px)] font-medium leading-[1.18] tracking-[-0.01em] text-ink-on-dark">
            Every cup, box, and bag a customer touches is a brand moment. Most
            eco packaging still looks like an afterthought.{" "}
            <span className="accent-gradient-text">
              NeeoGreen exists to make sustainable packaging look — and feel —
              like it belongs to a brand people already love.
            </span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
