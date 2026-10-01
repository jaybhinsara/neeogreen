import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

const COMMITMENTS = [
  { value: "< 1hr", label: "Typical response time on support tickets" },
  { value: "Fixed", label: "Price agreed before any work starts" },
  { value: "1 team", label: "From first design to ongoing support" },
];

export function BookCallBand() {
  return (
    <section className="bg-night py-28 text-white md:py-40">
      <Container className="grid gap-16 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col items-start gap-10">
          <Reveal>
            <h2 className="max-w-[14ch] font-heading text-[clamp(36px,4.4vw,72px)] font-medium leading-[1.02] tracking-[-0.04em]">
              Ready when you are.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Link
              href="/contact"
              className="label-mono inline-flex items-center rounded-md bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep"
            >
              Book a call
            </Link>
          </Reveal>
        </div>

        <div className="flex flex-col gap-10">
          <Reveal>
            <p className="max-w-[40ch] text-lg leading-relaxed text-white/70">
              Our work goes past the handover. Every project is designed,
              built, and supported by the same team, so what you approved is
              what ships, and someone you know answers when it needs you.
            </p>
          </Reveal>
          <dl>
            {COMMITMENTS.map((c, i) => (
              <Reveal key={c.value} delay={0.06 * i}>
                <div className="flex items-baseline justify-between gap-6 border-t border-white/15 py-6">
                  <dt className="font-heading text-[clamp(40px,4vw,64px)] font-medium leading-none tracking-[-0.04em]">
                    {c.value}
                  </dt>
                  <dd className="max-w-[20ch] text-right text-sm text-white/60">{c.label}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
