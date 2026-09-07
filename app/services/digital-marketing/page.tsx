import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "digital-marketing" as const,
  title: "Digital & Social Marketing",
  eyebrow: "Social media & digital marketing",
  intro:
    "A beautiful box that nobody sees online is only half the job. We design the content system and campaign assets that put your brand — and your packaging — in front of the people who'll actually buy it.",
  deliverables: [
    "Social media content systems: templates, pillars, and a posting rhythm your team can keep up",
    "Launch campaign assets, timed to your packaging and menu launches, not designed in isolation",
    "Product photography and reels direction, shot to make packaging the hero of the frame",
    "Paid and organic campaign creative, built on the same visual system as your identity",
    "A brand voice guide for captions and comments, so social sounds like one person wrote it",
  ],
  process: [
    { title: "Audit", desc: "What's already working, what isn't, and where your audience actually spends time." },
    { title: "Content system", desc: "Templates and pillars built once, reused often — consistency without a redesign every week." },
    { title: "Launch", desc: "Campaign assets timed to your packaging, menu, or brand launch for one coordinated moment." },
    { title: "Iterate", desc: "Performance-informed adjustments — more of what works, less of what doesn't." },
  ],
  whyTitle: "Why digital marketing from a packaging studio",
  whyBody:
    "We already know what your packaging looks like under real light, on a real table, in a real delivery bag — because we designed it. That means the content we build to sell it doesn't need a separate photoshoot or a guessing game about what the product actually looks like.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Digital and social media marketing for restaurants and food brands — content systems, launch campaign assets, and social templates built on your actual brand and packaging.",
  alternates: { canonical: "/services/digital-marketing" },
  openGraph: { url: `${SITE.url}/services/digital-marketing`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Digital and Social Media Marketing",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function DigitalMarketingPage() {
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
