import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "NeeoGreen is a brand, packaging, and digital studio based in Surat, India — one team building identity, eco-friendly packaging, and the digital push to launch them, not three vendors handed off in sequence.",
  alternates: { canonical: "/studio" },
  openGraph: { url: `${SITE.url}/studio`, title: `Studio — ${SITE.name}` },
};

const PROCESS = [
  {
    n: "01",
    title: "Discover",
    desc: "Menu, margins, and shipping realities — we learn the brand before we sketch a single die-line.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Concepts, material options, and a packaging system that carries the brand across every SKU.",
  },
  {
    n: "03",
    title: "Prototype & Sample",
    desc: "Physical samples in hand before commitment — structure, print, and material tested together.",
  },
  {
    n: "04",
    title: "Produce & Launch",
    desc: "Production handoff, quality checks, and launch-ready social assets shipped alongside the packaging.",
  },
] as const;

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Studio — NeeoGreen",
  description: metadata.description,
  url: `${SITE.url}/studio`,
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
};

export default function StudioPage() {
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
              Who we are
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(36px,7vw,96px)] font-semibold uppercase leading-[0.96] tracking-[-0.02em] text-ink-on-dark">
              A studio, not a stack of vendors
              <span className="accent-gradient-text">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg text-muted-on-dark md:text-xl">
              NeeoGreen is a small brand, packaging, and digital studio based
              in Surat, India. We work on one thing at a time, end to end —
              which mostly just means the person who names your brand is the
              same one who specs the box it ships in.
            </p>
          </Reveal>

          <div className="mt-20 border-t border-line-on-dark pt-16">
            <Reveal>
              <p className="max-w-4xl font-display text-[clamp(24px,3.6vw,44px)] font-medium leading-[1.2] tracking-[-0.01em] text-ink-on-dark">
                A brand isn&rsquo;t just a logo, and it isn&rsquo;t just a
                box. It&rsquo;s the name someone remembers, the packaging
                they photograph, the feed they follow.{" "}
                <span className="accent-gradient-text">
                  One studio builds all three — not three vendors
                  who&rsquo;ve never spoken.
                </span>
              </p>
            </Reveal>
          </div>

          <div className="mt-20 border-t border-line-on-dark pt-16">
            <Reveal>
              <span className="font-accent text-2xl italic text-muted-on-dark md:text-3xl">
                How we work
              </span>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-4 md:gap-8">
              {PROCESS.map((step, i) => (
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

          <div className="mt-20 flex flex-col items-start gap-8 border-t border-line-on-dark pt-16 md:flex-row md:items-center md:justify-between">
            <Reveal>
              <h2 className="max-w-lg font-display text-[clamp(26px,3.6vw,44px)] font-semibold uppercase leading-[1.05] tracking-[-0.01em] text-ink-on-dark">
                See the system we build for ourselves
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Link
                href="/work"
                className="inline-flex items-center rounded-full accent-gradient px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
              >
                View the work
              </Link>
            </Reveal>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
