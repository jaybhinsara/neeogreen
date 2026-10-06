import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { BookCallBand } from "@/components/BookCallBand";
import { SITE } from "@/lib/site";
import { Emphasis } from "@/components/Emphasis";

export const metadata: Metadata = pageMetadata({
  title: "Approach",
  description:
    "How a NeeoGreen project actually runs — discover, plan, build, and support — for web development, web design, and software engineering clients across Gujarat.",
  path: "/approach",
});

const STEPS = [
  {
    n: "01",
    title: "Discover",
    desc: "We start by learning the business: who your users are, what they need, and every system you already run, before recommending anything. No sales pitch disguised as a diagnosis.",
  },
  {
    n: "02",
    title: "Plan",
    desc: "A scoped plan, timeline, and fixed price matched to your budget and growth. You see the plan and the reasoning behind it before any work starts.",
  },
  {
    n: "03",
    title: "Build",
    desc: "Design and development in stages you can see and test, with a rollback plan for anything that touches live systems. Never a black box until launch day.",
  },
  {
    n: "04",
    title: "Support",
    desc: "Hosting, updates, monitoring, and a help desk that answers. Support doesn't end when the invoice is paid.",
  },
] as const;

const PRINCIPLES = [
  {
    title: "One team, whole picture",
    desc: "The people who design your site are the ones who build it and keep it running, so nothing falls through a seam between vendors.",
  },
  {
    title: "Fixed, transparent pricing",
    desc: "You know the cost before work starts. No surprise line items, no billed-by-the-minute anxiety.",
  },
  {
    title: "Proactive, not just reactive",
    desc: "Monitoring and maintenance run in the background so small issues get caught before they cost you.",
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
      <main>
        <section className="bg-page pb-24 pt-40 md:pb-32 md:pt-52">
          <Container>
            <Reveal>
              <span className="eyebrow text-brand-deep">Our approach</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 max-w-[14ch] font-heading text-[clamp(44px,7vw,112px)] font-medium leading-[0.98] tracking-[-0.045em]">
                How a project <Emphasis tone="light">actually</Emphasis> runs.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-12 max-w-[50ch] text-lg leading-relaxed text-muted md:text-xl">
                We&rsquo;re a growing team, and we&rsquo;d rather show you
                exactly how we work than pad this page with client logos we
                don&rsquo;t have yet. Here&rsquo;s every project, start to
                finish.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-paper py-24 md:py-32">
          <Container>
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={0.05 * i}>
                <div className="grid gap-4 border-t border-line py-10 md:grid-cols-[120px_1fr_1.4fr] md:gap-10 md:py-14">
                  <span className="label-mono pt-3 text-brand">{step.n}</span>
                  <h2 className="font-serif text-[clamp(40px,4.6vw,72px)] italic leading-none tracking-[-0.01em]">
                    {step.title}
                  </h2>
                  <p className="max-w-[48ch] text-lg leading-relaxed text-muted">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </Container>
        </section>

        <section className="bg-brand py-28 text-white md:py-40">
          <Container>
            <Reveal>
              <span className="eyebrow text-white/80">What this means for you</span>
            </Reveal>
            <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.title} delay={0.08 * i}>
                  <div className="flex flex-col gap-4 border-t border-white/25 pt-6">
                    <h3 className="font-serif text-[clamp(30px,2.6vw,38px)] italic leading-tight tracking-[-0.01em]">
                      {p.title}
                    </h3>
                    <p className="text-base leading-relaxed text-white/90">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <BookCallBand />
      </main>
      <Footer />
    </>
  );
}
