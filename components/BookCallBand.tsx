import { BookCallTrigger } from "./BookCallTrigger";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Emphasis } from "./Emphasis";

const COMMITMENTS = [
  { value: "< 60 min", label: "Typical response time on support tickets" },
  { value: "Fixed", label: "Price agreed before any work starts" },
  { value: "One team", label: "From first design to ongoing support" },
];

export function BookCallBand() {
  return (
    <section className="bg-night py-28 text-white md:py-40">
      <Container className="grid gap-16 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col items-start gap-10 md:sticky md:top-36 md:self-start">
          <Reveal>
            <h2 className="max-w-[14ch] font-heading text-[clamp(36px,4.4vw,72px)] font-medium leading-[1.02] tracking-[-0.04em]">
              Ready when <Emphasis>you</Emphasis> are.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <BookCallTrigger className="label-mono inline-flex items-center rounded-md bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep">
              Book a call
            </BookCallTrigger>
          </Reveal>
        </div>

        <div className="flex flex-col gap-10">
          <Reveal>
            <p className="max-w-[40ch] text-lg leading-relaxed text-white/80">
              Our work goes past the handover. Every project is designed,
              built, and supported by the same team, so what you approved is
              what ships, and someone you know answers when it needs you.
            </p>
          </Reveal>
          <dl>
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.value} delay={0.06 * i}>
                <div className="grid grid-cols-[1fr_auto] items-center gap-6 border-t border-white/15 py-7 md:py-8">
                  <dt className="font-serif text-[clamp(52px,5.4vw,88px)] italic leading-none tracking-[-0.01em]">
                    {c.value}
                  </dt>
                  <dd className="max-w-[20ch] text-right text-[15px] leading-snug text-white/75">{c.label}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
