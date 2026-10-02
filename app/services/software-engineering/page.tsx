import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "software-engineering" as const,
  title: "Software Engineering",
  eyebrow: "Custom software & internal tools",
  intro:
    "A generic template can only take a business so far. We engineer internal tools and custom software shaped around how your team actually works, not the other way around.",
  deliverables: [
    "Custom internal tools that replace the spreadsheet nobody trusts anymore",
    "Business software built to your actual workflow, not a template's",
    "API integrations that connect the tools you already use",
    "Database and systems architecture built to handle real growth",
    "Source code and documentation handed over, not held hostage",
  ],
  process: [
    { title: "Assess", desc: "We learn the actual workflow before we design a single system." },
    { title: "Plan", desc: "A scoped build plan and timeline, agreed before development starts." },
    { title: "Implement", desc: "Built in stages you can see and test, not a black box until launch day." },
    { title: "Support", desc: "Bug fixes, updates, and ongoing engineering support after launch." },
  ],
  whyTitle: "Why build custom instead of buying another tool",
  whyBody:
    "Off-the-shelf software is built for everyone, which means it's really built for no one. When the workaround becomes the workflow, it's usually cheaper in the long run to build the tool that fits — and we build it to last past the first year.",
};

export const metadata: Metadata = pageMetadata({
  title: content.title,
  description:
    "Software engineering for businesses across Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar — custom software and internal tools built around your actual workflow.",
  path: "/services/software-engineering",
});

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Software Engineering",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: SITE.serviceCities.map((city) => ({ "@type": "City", name: city })),
  description: metadata.description,
};

export default function SoftwareEngineeringPage() {
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
