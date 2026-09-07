import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const content = {
  slug: "packaging-design" as const,
  title: "Packaging Design",
  eyebrow: "Eco-friendly packaging design",
  intro:
    "Custom paper cups, food boxes, mailers, and bags — designed to look like they belong to a brand people already love, and specified on real materials, not vague \"eco\" claims.",
  deliverables: [
    "Concept sketches and structural direction for cups, boxes, mailers, and bags",
    "Print-ready dielines, matched to your printer's press and stock",
    "Eco material sourcing: kraft, PLA-lined, and compostable stock options, named and compared",
    "Colour, print, and finish specification — Pantone-matched, not \"close enough\"",
    "Production liaison through the first run, so the sample matches the file",
  ],
  process: [
    { title: "Discover", desc: "Menu, margins, and shipping realities — we learn the product before we sketch a die-line." },
    { title: "Design", desc: "Concepts and material options, built as one system that carries your brand across every SKU." },
    { title: "Prototype & Sample", desc: "Physical samples in hand before commitment — structure, print, and material tested together." },
    { title: "Produce & Launch", desc: "Production handoff and quality checks, with launch-ready social assets shipped alongside." },
  ],
  whyTitle: "Why packaging design from a brand studio",
  whyBody:
    "Packaging ordered separately from your brand almost always looks separate from your brand. We design the two together, so your cup or your box reads as unmistakably yours the moment it's on a table or in a delivery bag — and the eco material specs are things we can point to, not marketing language.",
};

export const metadata: Metadata = {
  title: content.title,
  description:
    "Eco-friendly packaging design in Surat, India — custom paper cups, food boxes, mailers, and bags, from concept sketches to print-ready dielines, with real material sourcing.",
  alternates: { canonical: "/services/packaging-design" },
  openGraph: { url: `${SITE.url}/services/packaging-design`, title: `${content.title} — ${SITE.name}` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Eco-Friendly Packaging Design",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: "IN",
  description: metadata.description,
};

export default function PackagingDesignPage() {
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
