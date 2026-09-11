import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ProductShowcase } from "@/components/BrandInAction";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The NeeoGreen brand system in hand — our own identity applied across paper cups, food boxes, mailer bags, and cards — and the process behind it, from concept to production.",
  alternates: { canonical: "/work" },
  openGraph: { url: `${SITE.url}/work`, title: `Work — ${SITE.name}` },
};

const STAGES = [
  {
    n: "01",
    title: "One identity, every format",
    desc: "The same wordmark, palette, and leaf mark carried across a paper cup, a food box, a mailer bag, and a card — proof the system holds up under real material constraints, not just on a screen.",
  },
  {
    n: "02",
    title: "Material-first thinking",
    desc: "PLA-lined cups, kraft stock boxes, compostable bags, FSC paper cards — the eco angle isn't a sticker on top, it's decided before a single die-line is drawn.",
  },
  {
    n: "03",
    title: "Built to reorder",
    desc: "Specs, dielines, and print-ready files handed over in a state a printer can run without a back-and-forth — the same discipline we'd bring to a client's SKU sheet.",
  },
] as const;

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work — NeeoGreen",
  description: metadata.description,
  url: `${SITE.url}/work`,
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
};

export default function WorkPage() {
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
              What we&rsquo;ve built
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(36px,7vw,96px)] font-semibold uppercase leading-[0.96] tracking-[-0.02em] text-ink-on-dark">
              Our own brand, in hand
              <span className="accent-gradient-text">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg text-muted-on-dark md:text-xl">
              NeeoGreen is a young studio — we don&rsquo;t have a decade of
              client logos to show off. What we can show is the system we
              built for ourselves, applied honestly across the packaging
              formats we design every day.
            </p>
          </Reveal>

          <ProductShowcase />

          <div className="mt-20 border-t border-line-on-dark pt-16">
            <Reveal>
              <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
                What this proves
              </span>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
              {STAGES.map((stage, i) => (
                <Reveal key={stage.n} delay={0.08 * i}>
                  <div className="flex flex-col gap-3">
                    <span className="font-display text-sm font-medium tracking-[-0.01em] accent-gradient-text">
                      {stage.n}
                    </span>
                    <h3 className="font-display text-lg font-semibold uppercase tracking-[-0.01em] text-ink-on-dark">
                      {stage.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-on-dark">
                      {stage.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-start gap-8 border-t border-line-on-dark pt-16 md:flex-row md:items-center md:justify-between">
            <Reveal>
              <h2 className="max-w-lg font-display text-[clamp(26px,3.6vw,44px)] font-semibold uppercase leading-[1.05] tracking-[-0.01em] text-ink-on-dark">
                Want your brand built the same way
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full accent-gradient px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
              >
                Start a project
              </Link>
            </Reveal>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
