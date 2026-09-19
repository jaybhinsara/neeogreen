import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "cybersecurity" as const,
  title: "Cybersecurity & Data Protection",
  eyebrow: "Endpoint security & backup",
  intro:
    "A single phishing click or a failed drive shouldn't be able to take your business down. We build security and backup around how you actually work, so a bad day doesn't become a bad year.",
  deliverables: [
    "Endpoint protection and firewall configuration across every device",
    "Automated, tested backups with a real recovery-time target, not just a checkbox",
    "Disaster recovery planning — documented, and actually rehearsed",
    "Security awareness basics for your team, since most breaches start with a click",
    "A clear incident-response plan so everyone knows what to do on day one of a problem",
  ],
  process: [
    { title: "Assess", desc: "A risk audit across devices, accounts, and existing backups — no assumptions." },
    { title: "Plan", desc: "A security and backup plan sized to your actual risk, not a one-size template." },
    { title: "Implement", desc: "Endpoint protection, backups, and access controls rolled out and verified." },
    { title: "Support", desc: "Ongoing monitoring, backup testing, and incident response on call." },
  ],
  whyTitle: "Why security from your IT provider",
  whyBody:
    "Security bolted on after the fact leaves gaps — the firewall vendor doesn't talk to the backup vendor, and nobody owns the whole picture. We handle your infrastructure and your security together, so nothing falls through a seam between two contracts.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Cybersecurity and data protection for businesses and individuals — endpoint protection, tested backups, and disaster recovery planning that actually works when you need it.",
  alternates: { canonical: "/services/cybersecurity" },
  openGraph: { url: `${SITE.url}/services/cybersecurity`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cybersecurity Services",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function CybersecurityPage() {
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
