import { Fragment } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "< 1hr", label: "Typical response time on support tickets" },
  { value: "Flat", label: "Transparent, flat-rate pricing — no surprise invoices" },
  { value: "0", label: "Call-center scripts — you talk to the engineer who fixes it" },
];

const COMMITMENTS = [
  "Senior engineers, not a script",
  "Proactive monitoring, not just break-fix",
  "Transparent flat-rate pricing",
  "A help desk that actually answers",
];

export function WhyNeeoGreen() {
  return (
    <section className="py-24 md:py-40">
      <Container>
        <div className="grid gap-16 md:grid-cols-[1.15fr_1fr] md:gap-16">
          <div className="flex flex-col items-start">
            <Reveal>
              <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
                Why NeeoGreen
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 max-w-xl font-display text-[clamp(32px,5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark">
                Commitments, not a pitch<span className="accent-gradient-text">.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-base text-muted-on-dark md:text-lg">
                Reliability is a set of commitments we hold ourselves to, not
                a marketing claim. Every engagement runs on the same
                response-time and pricing standards, whether you&rsquo;re a
                growing business or a single home office.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="w-full">
              <ul className="mt-10 flex max-w-lg flex-wrap gap-3">
                {COMMITMENTS.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-line-on-dark px-4 py-2 text-xs uppercase tracking-[0.08em] text-muted-on-dark"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-8 border-t border-line-on-dark pt-10 md:gap-y-10 md:border-t-0 md:border-l md:pl-10 md:pt-0">
            {STATS.map((stat, i) => (
              <Fragment key={stat.label}>
                <Reveal delay={0.08 * i}>
                  <span className="font-display text-5xl font-semibold tracking-[-0.02em] accent-gradient-text md:text-6xl">
                    {stat.value}
                  </span>
                </Reveal>
                <Reveal delay={0.08 * i + 0.04}>
                  <span className="block max-w-[26ch] pt-2 text-sm text-muted-on-dark md:pt-3 md:text-base">
                    {stat.label}
                  </span>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
