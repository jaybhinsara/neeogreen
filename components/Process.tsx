import { Container } from "./Container";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    desc: "We learn your business, your users, and the systems you already run before recommending anything.",
  },
  {
    n: "02",
    title: "Plan",
    desc: "A scoped plan, timeline, and fixed price, matched to your budget and growth, agreed before work starts.",
  },
  {
    n: "03",
    title: "Build",
    desc: "Design, development, and rollout in stages you can see and test, never a black box until launch day.",
  },
  {
    n: "04",
    title: "Support",
    desc: "Hosting, updates, monitoring, and a help desk that answers, so the work keeps performing after launch.",
  },
];

export function Process() {
  return (
    <section className="bg-page py-28 md:py-40">
      <Container>
        <Reveal>
          <span className="label-mono text-brand">How we work</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[18ch] font-heading text-[clamp(32px,4vw,64px)] font-medium leading-[1.05] tracking-[-0.035em]">
            Four steps from first call to launch.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={0.08 * i}>
              <div className="flex flex-col gap-4 border-t border-line pt-6">
                <span className="label-mono text-brand">{step.n}</span>
                <h3 className="font-heading text-2xl font-medium tracking-[-0.03em]">{step.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
