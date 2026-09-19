import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "cloud-solutions" as const,
  title: "Cloud Solutions",
  eyebrow: "Migration & cloud management",
  intro:
    "Moving to the cloud shouldn't mean a weekend of downtime or a surprise bill three months later. We migrate you to Microsoft 365, Google Workspace, AWS, or Azure, then keep it managed, monitored, and cost-optimized.",
  deliverables: [
    "Migration planning and execution with a rollback plan, not just a hope",
    "Microsoft 365 or Google Workspace setup, licensing, and mailbox migration",
    "AWS or Azure infrastructure setup, sized to what you actually need",
    "Ongoing cost monitoring so you're not paying for capacity you don't use",
    "Access and identity management configured correctly from day one",
  ],
  process: [
    { title: "Assess", desc: "A read of your current systems, data, and what actually needs to move." },
    { title: "Plan", desc: "A migration plan with a real timeline, rollback path, and minimal downtime window." },
    { title: "Implement", desc: "Migration executed and verified — data, permissions, and integrations checked." },
    { title: "Support", desc: "Ongoing management, monitoring, and cost optimization after the move." },
  ],
  whyTitle: "Why manage the cloud, not just migrate to it",
  whyBody:
    "A migration that ends the day you go live is half a job — the other half is watching for cost creep, misconfigured access, and the updates that break something two months later. We stay on it after the migration is done.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Cloud migration and management for businesses — Microsoft 365, Google Workspace, AWS, and Azure, migrated carefully and then monitored and cost-optimized.",
  alternates: { canonical: "/services/cloud-solutions" },
  openGraph: { url: `${SITE.url}/services/cloud-solutions`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cloud Migration and Management",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function CloudSolutionsPage() {
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
