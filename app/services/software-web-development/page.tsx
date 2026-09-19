import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "software-web-development" as const,
  title: "Custom Software & Web Development",
  eyebrow: "Business apps & websites",
  intro:
    "A generic template can only take a business so far. We build internal tools, business web apps, and websites shaped around how your team actually works, not the other way around.",
  deliverables: [
    "Custom internal tools that replace the spreadsheet nobody trusts anymore",
    "Business web applications built to your actual workflow, not a template's",
    "Marketing and business websites — fast, mobile-ready, and easy for your team to update",
    "API integrations that connect the tools you already use",
    "Source code and documentation handed over, not held hostage",
  ],
  process: [
    { title: "Assess", desc: "We learn the actual workflow before we design a single screen." },
    { title: "Plan", desc: "A scoped build plan and timeline, agreed before development starts." },
    { title: "Implement", desc: "Built in stages you can see and test, not a black box until launch day." },
    { title: "Support", desc: "Bug fixes, updates, and hosting support after launch." },
  ],
  whyTitle: "Why build custom instead of buying another tool",
  whyBody:
    "Off-the-shelf software is built for everyone, which means it's really built for no one. When the workaround becomes the workflow, it's usually cheaper in the long run to build the tool that fits — and we build it to last past the first year.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Custom software and web development for businesses — internal tools, business web apps, and websites built around your actual workflow.",
  alternates: { canonical: "/services/software-web-development" },
  openGraph: { url: `${SITE.url}/services/software-web-development`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Custom Software and Web Development",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function SoftwareWebDevelopmentPage() {
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
