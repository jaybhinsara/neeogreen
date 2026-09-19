import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "it-consulting" as const,
  title: "IT Consulting & Digital Transformation",
  eyebrow: "Technology roadmaps & systems",
  intro:
    "Most businesses don't need more software — they need a technology roadmap that actually matches how they plan to grow. We build that roadmap, then manage the vendors and systems that make it real.",
  deliverables: [
    "A technology roadmap tied to your actual growth plan, not a vendor's sales quota",
    "Vendor management, so you have one point of contact instead of five",
    "CRM and ERP selection and integration — Salesforce, HubSpot, Odoo, or custom",
    "Systems integration between the tools you already run",
    "Ongoing advisory as your business and technology needs change",
  ],
  process: [
    { title: "Assess", desc: "A read of your current systems, gaps, and where technology is actually costing you." },
    { title: "Plan", desc: "A roadmap prioritized by impact, not by whatever's newest." },
    { title: "Implement", desc: "Systems selected, integrated, and rolled out with your team's actual workflow in mind." },
    { title: "Support", desc: "Ongoing advisory as priorities and systems evolve." },
  ],
  whyTitle: "Why a technology roadmap, not just a vendor recommendation",
  whyBody:
    "A vendor will always recommend their own product. We don't sell software — we recommend what actually fits your growth plan, then manage the integration so it doesn't become another disconnected system.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "IT consulting and digital transformation — technology roadmaps, vendor management, and CRM/ERP systems integration matched to your actual growth plan.",
  alternates: { canonical: "/services/it-consulting" },
  openGraph: { url: `${SITE.url}/services/it-consulting`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "IT Consulting",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function ItConsultingPage() {
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
