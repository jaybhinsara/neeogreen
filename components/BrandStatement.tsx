import { Reveal } from "./Reveal";

export function BrandStatement() {
  return (
    <section className="flex min-h-svh items-center justify-center bg-brand px-6 py-32">
      <Reveal>
        <p className="mx-auto max-w-[24ch] text-center font-heading text-[clamp(28px,3.2vw,52px)] font-medium leading-[1.12] tracking-[-0.03em] text-white">
          We build for what comes next, where design, engineering, and
          reliable IT work as one.
        </p>
      </Reveal>
    </section>
  );
}
