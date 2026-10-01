import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "web-development" as const,
  title: "Web Development",
  eyebrow: "Websites & web applications",
  intro:
    "A website that's slow, hard to update, or just doesn't work on a phone costs you customers before they even see what you offer. We build fast, maintainable sites and web apps, shipped and supported.",
  deliverables: [
    "Marketing and business websites — fast, mobile-ready, built to actually rank",
    "Web applications and customer portals built around your real workflow",
    "API integrations that connect the tools you already run",
    "Clean, documented code your team or ours can keep building on",
    "Hosting, deployment, and ongoing support after launch",
  ],
  process: [
    { title: "Assess", desc: "We learn the actual goal and workflow before we design a single screen." },
    { title: "Plan", desc: "A scoped build plan and timeline, agreed before development starts." },
    { title: "Implement", desc: "Built in stages you can see and test, not a black box until launch day." },
    { title: "Support", desc: "Bug fixes, updates, and hosting support after launch." },
  ],
  whyTitle: "Why work with a local development team",
  whyBody:
    "A freelancer disappears after the invoice clears, and an overseas agency is asleep when something breaks. We're based in Surat, working with businesses across Gujarat — reachable, accountable, and still here next year.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Web development for businesses across Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar — fast, mobile-ready websites and web applications, built and supported locally.",
  alternates: { canonical: "/services/web-development" },
  openGraph: { url: `${SITE.url}/services/web-development`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Web Development",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: SITE.serviceCities.map((city) => ({ "@type": "City", name: city })),
  description: metadata.description,
};

export default function WebDevelopmentPage() {
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
