import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "web-design" as const,
  title: "Web Design",
  eyebrow: "UI/UX & visual design",
  intro:
    "Good design isn't decoration — it's the difference between a visitor who finds what they need and one who leaves. We design interfaces that are researched and tested, not just pretty.",
  deliverables: [
    "UX research and user flows mapped before any screen is designed",
    "UI design systems — components, type, and color built to stay consistent as the site grows",
    "Interactive prototypes you can click through before a single line of code is written",
    "Responsive layouts tested across real devices, not just a desktop preview",
    "Full design files handed over — Figma source, not just a PDF",
  ],
  process: [
    { title: "Assess", desc: "Research into who actually uses the site and what they're trying to do." },
    { title: "Plan", desc: "Wireframes and user flows agreed before visual design starts." },
    { title: "Implement", desc: "High-fidelity UI design and an interactive prototype you can test." },
    { title: "Support", desc: "Design QA through development, so the build matches the design." },
  ],
  whyTitle: "Why design and development from one team",
  whyBody:
    "A design that doesn't account for how it'll actually be built either gets watered down in development or blows the budget. We design and build together, so what you approve is what ships.",
};

export const metadata: Metadata = pageMetadata({
  title: content.title,
  description:
    "Web design for businesses across Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar — UI/UX design, design systems, and prototypes, researched and tested before launch.",
  path: "/services/web-design",
});

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Web Design",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: SITE.serviceCities.map((city) => ({ "@type": "City", name: city })),
  description: metadata.description,
};

export default function WebDesignPage() {
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
