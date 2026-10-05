import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

const CAPABILITIES = [
  "AI chatbots and assistants for your website, WhatsApp, and customer support",
  "LLM integration into your product or internal tools, using models such as GPT, Claude, and Gemini",
  "Knowledge assistants that answer from your own documents, policies, and data (RAG)",
  "AI agents and workflow automation that take repetitive work off your team",
  "Document AI: reading invoices, forms, and contracts and turning them into structured data",
  "Evaluation, guardrails, monitoring, and cost control so AI stays accurate and affordable",
];

const content = {
  slug: "ai-engineering" as const,
  title: "AI Engineering",
  eyebrow: "AI systems, chatbots & automation",
  intro:
    "AI only helps a business when it's built into real work: answering customers, finding answers in your documents, and taking repetitive tasks off your team. We design, build, and run AI systems that do that reliably, grounded in your data and measured on results.",
  deliverables: CAPABILITIES,
  process: [
    { title: "Discover", desc: "We find the tasks where AI saves real time or money, and the ones where it shouldn't be used." },
    { title: "Prototype", desc: "A working prototype on your own data within weeks, tested against real questions and edge cases." },
    { title: "Build", desc: "Production integration with your systems, guardrails, evaluation, and a clear cost per use." },
    { title: "Operate", desc: "Monitoring, model updates, and improvements as your data and the models change." },
  ],
  whyTitle: "Why AI that's engineered, not just plugged in",
  whyBody:
    "Dropping a chatbot widget on a site is easy; making AI accurate, safe with your data, and worth what it costs is engineering. We test answers against your real questions, keep your data private, and design every system so a person stays in control.",
};

export const metadata: Metadata = pageMetadata({
  title: "AI Engineering",
  description:
    "AI engineering and integration for businesses in Surat, across Gujarat, and worldwide: AI chatbots, LLM integration, RAG knowledge assistants, AI agents, and workflow automation, built and supported end to end.",
  path: "/services/ai-engineering",
});

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "AI Engineering",
  name: "AI Engineering",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: [
    ...SITE.serviceCities.map((city) => ({ "@type": "City", name: city })),
    { "@type": "Country", name: "India" },
    "Worldwide",
  ],
  description: metadata.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI engineering services",
    itemListElement: [
      "AI chatbot development",
      "LLM integration",
      "RAG knowledge assistants",
      "AI agents and workflow automation",
      "Document AI and data extraction",
      "AI evaluation, guardrails, and monitoring",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};

export default function AiEngineeringPage() {
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
