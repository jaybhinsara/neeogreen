import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { Process } from "@/components/Process";
import { SITE } from "@/lib/site";
import { Emphasis } from "@/components/Emphasis";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "NeeoGreen is a web development, web design, and software engineering team based in Surat, Gujarat — serving Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar, plus managed IT and cloud support.",
  path: "/about",
});

const COMMITMENTS = [
  { value: "< 60 min", label: "Typical support response time" },
  { value: "Fixed", label: "Price agreed before work starts" },
  { value: "One team", label: "Design, build, and support" },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About — NeeoGreen",
  description: metadata.description,
  url: `${SITE.url}/about`,
  isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
};

export default function AboutPage() {
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
              <span className="label-mono text-brand">About us</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 max-w-[14ch] font-heading text-[clamp(44px,7vw,112px)] font-medium leading-[0.98] tracking-[-0.045em]">
                A <Emphasis tone="light">team</Emphasis>, not a stack of vendors.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-12 max-w-[50ch] text-lg leading-relaxed text-muted md:text-xl">
                NeeoGreen is a web development, web design, and software
                engineering studio headquartered in Surat, India, working with
                businesses in any time zone who&rsquo;d rather have one team
                own their technology than juggle a different vendor for every
                problem.
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="bg-brand py-28 text-white md:py-40">
          <Container className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <Reveal>
                <span className="label-mono text-white/70">Our philosophy</span>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-8 max-w-[30ch] font-heading text-[clamp(26px,2.6vw,40px)] font-medium leading-[1.2] tracking-[-0.03em]">
                  Technology should make running your business{" "}
                  <Emphasis tone="brand">simpler</Emphasis>, not more complicated. So we build fast, clear, maintainable
                  products, and stay around to keep them that way.
                </p>
              </Reveal>
            </div>
            <dl className="md:pt-24">
              {COMMITMENTS.map((c, i) => (
                <Reveal key={c.value} delay={0.06 * i}>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-6 border-t border-white/25 py-7 md:py-8">
                    <dt className="font-serif text-[clamp(52px,5.6vw,92px)] italic leading-none tracking-[-0.01em]">
                      {c.value}
                    </dt>
                    <dd className="max-w-[18ch] text-right text-[15px] leading-snug text-white/90">{c.label}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>

        <Process />
      </main>
      <Footer />
    </>
  );
}
