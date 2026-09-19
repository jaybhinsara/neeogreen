import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How a NeeoGreen engagement actually runs — assess, plan, implement, and support — explained in detail, not a fabricated portfolio.",
  alternates: { canonical: "/approach" },
  openGraph: { url: `${SITE.url}/approach`, title: `Approach — ${SITE.name}` },
};

const STEPS = [
  {
    n: "01",
    title: "Assess",
    desc: "We start with a real audit — every device, account, and system currently in use — before recommending anything. No sales pitch disguised as a diagnosis.",
  },
  {
    n: "02",
    title: "Plan",
    desc: "A prioritized roadmap matched to your budget, team size, and actual growth plan. You see the plan and the reasoning behind it before anything changes.",
  },
  {
    n: "03",
    title: "Implement",
    desc: "Migrations, security rollouts, and setup work scheduled around your business hours — with a rollback plan for anything that touches production systems.",
  },
  {
    n: "04",
    title: "Support",
    desc: "Ongoing monitoring, patching, and a help desk that answers. Support doesn't end when the invoice is paid.",
  },
] as const;

const PRINCIPLES = [
  {
    n: "01",
    title: "One team, whole picture",
    desc: "The engineer who sets up your firewall is the same one who owns your backup plan — nothing falls through a seam between two vendors.",
  },
  {
    n: "02",
    title: "Transparent, flat-rate pricing",
    desc: "You know the cost before work starts. No surprise line items, no billed-by-the-minute anxiety.",
  },
  {
    n: "03",
    title: "Proactive, not just reactive",
    desc: "Monitoring and maintenance run in the background so small issues get caught before they become downtime.",
  },
] as const;

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Approach — NeeoGreen",
  description: metadata.description,
  url: `${SITE.url}/approach`,
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
};

export default function ApproachPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, non-user-controlled structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <Header />
      <main className="pb-24 pt-40 md:pb-40 md:pt-48">
        <Container>
          <Reveal>
            <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
              How we work
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(36px,7vw,96px)] font-semibold uppercase leading-[0.96] tracking-[-0.02em] text-ink-on-dark">
              How an engagement runs
              <span className="accent-gradient-text">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg text-muted-on-dark md:text-xl">
              NeeoGreen is a growing team — we&rsquo;d rather show you exactly
              how we work than pad this page with client logos we don&rsquo;t
              have yet. Here&rsquo;s what every engagement actually looks
              like, start to finish.
            </p>
          </Reveal>

          <div className="mt-20 border-t border-line-on-dark pt-16">
            <div className="grid gap-10 md:grid-cols-4 md:gap-8">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={0.08 * i}>
                  <div className="flex flex-col gap-3">
                    <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                      {step.n}
                    </span>
                    <h3 className="font-display text-lg font-semibold uppercase tracking-[-0.01em] text-ink-on-dark">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 border-t border-line-on-dark pt-16">
            <Reveal>
              <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
                What this means for you
              </span>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.n} delay={0.08 * i}>
                  <div className="flex flex-col gap-3">
                    <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                      {p.n}
                    </span>
                    <h3 className="font-display text-lg font-semibold uppercase tracking-[-0.01em] text-ink-on-dark">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark">
                      {p.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-start gap-8 border-t border-line-on-dark pt-16 md:flex-row md:items-center md:justify-between">
            <Reveal>
              <h2 className="max-w-lg font-display text-[clamp(26px,3.6vw,44px)] font-semibold uppercase leading-[1.05] tracking-[-0.01em] text-ink-on-dark">
                Ready to see it in action
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full accent-gradient px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
              >
                Get a free consultation
              </Link>
            </Reveal>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
