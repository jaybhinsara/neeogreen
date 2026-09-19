import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "managed-it-support" as const,
  title: "Managed IT Support",
  eyebrow: "Help desk & proactive monitoring",
  intro:
    "Most IT problems get caught after they've already cost you an afternoon. We monitor your systems around the clock and staff a help desk that actually answers, so small issues get fixed before they become downtime.",
  deliverables: [
    "24/7 monitoring of servers, workstations, and network devices",
    "A help desk you can reach by phone, email, or chat — real engineers, not a script",
    "Remote support for most issues, with on-site visits when hands-on work is needed",
    "Patch management and routine maintenance handled in the background",
    "Monthly reporting so you can see exactly what was fixed and why",
  ],
  process: [
    { title: "Assess", desc: "A baseline audit of every device and system currently on your network." },
    { title: "Plan", desc: "A support plan matched to your team size, hours, and risk tolerance." },
    { title: "Implement", desc: "Monitoring agents and help desk access rolled out with zero disruption." },
    { title: "Support", desc: "Ongoing monitoring, patching, and a help desk that answers when you call." },
  ],
  whyTitle: "Why managed support, not a break-fix call",
  whyBody:
    "A break-fix technician shows up after something's already broken. We'd rather catch the failing hard drive or the expiring certificate before it takes your systems down — that's the difference between an IT bill and an IT partner.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Managed IT support for businesses and individuals — 24/7 monitoring, a help desk that answers, and proactive maintenance instead of a break-fix bill.",
  alternates: { canonical: "/services/managed-it-support" },
  openGraph: { url: `${SITE.url}/services/managed-it-support`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Managed IT Support",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function ManagedItSupportPage() {
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
