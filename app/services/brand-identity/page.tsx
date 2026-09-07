import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "brand-identity" as const,
  title: "Brand Identity",
  eyebrow: "Brand strategy & identity design",
  intro:
    "Your logo is the smallest part of your brand — the real work is a visual system disciplined enough to carry across a cup, a Reels template, and a delivery bag without ever looking like three different companies.",
  deliverables: [
    "Brand strategy: positioning, audience, and competitor read before any design starts",
    "Logo, wordmark, and icon system, built to work as small as a sticker and as large as signage",
    "Brand guidelines: color, type, voice, and usage rules your team can actually follow",
    "A visual system designed to extend into packaging and social from day one, not retrofitted later",
    "Full asset library — source files, exports, and templates handed over, not held hostage",
  ],
  process: [
    { title: "Discover", desc: "Audience, competitors, and positioning — we learn the business before we sketch a logo." },
    { title: "Concept", desc: "Multiple logo and system directions, each with a real point of view, not ten weak options." },
    { title: "Refine", desc: "One direction, pressure-tested against packaging, social, and signage before it's final." },
    { title: "Deliver", desc: "Guidelines document and full asset library — ready for your team or your printer." },
  ],
  whyTitle: "Why brand identity from a packaging studio",
  whyBody:
    "Most identity studios hand you a PDF and disappear before it ever touches a real product. We design identity and packaging together, so by the time your guidelines are final, we've already proven they hold up on a cup, a box, and a bag — not just a screen.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Brand identity design for restaurants, cafés, and food brands — logo, brand guidelines, and a visual system built to carry across packaging and digital from day one.",
  alternates: { canonical: "/services/brand-identity" },
  openGraph: { url: `${SITE.url}/services/brand-identity`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Brand Identity Design",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function BrandIdentityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, non-user-controlled structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ServicePage content={content} />
    </>
  );
}
