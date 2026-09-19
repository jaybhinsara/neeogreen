import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "networking-infrastructure" as const,
  title: "Networking & Infrastructure",
  eyebrow: "Wi-Fi, servers & structured cabling",
  intro:
    "A network that drops calls or a Wi-Fi signal that dies in the back office isn't a minor annoyance — it's lost time every single day. We spec and install networks built to actually hold up.",
  deliverables: [
    "Office Wi-Fi design and installation, sized for real device density",
    "Structured cabling done to code, not a bundle of cables zip-tied together",
    "Server setup and configuration for on-premise or hybrid environments",
    "Network security basics — segmentation, firewalls, and guest-network isolation",
    "Documentation of the finished network, so the next person isn't guessing",
  ],
  process: [
    { title: "Assess", desc: "A site walkthrough and device count before any equipment is specified." },
    { title: "Plan", desc: "A network design matched to the space, not a generic router-and-switch kit." },
    { title: "Implement", desc: "Installation scheduled around your operating hours, tested before handoff." },
    { title: "Support", desc: "Monitoring and support for the network after installation." },
  ],
  whyTitle: "Why spec it properly the first time",
  whyBody:
    "Underspecced networks are the single most common cause of the IT complaints we hear — a dead Wi-Fi corner, a switch that can't handle load, cabling nobody labeled. Getting it right once costs less than fixing it twice.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Networking and infrastructure services — office Wi-Fi, structured cabling, and server setup specified and installed to actually hold up.",
  alternates: { canonical: "/services/networking-infrastructure" },
  openGraph: { url: `${SITE.url}/services/networking-infrastructure`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Networking and Infrastructure",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function NetworkingInfrastructurePage() {
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
