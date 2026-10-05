import type { SocialNetwork } from "@/components/SocialIcon";

export const SITE = {
  name: "NeeoGreen",
  tagline: "AI Engineering, Web Development & Software Studio",
  // The apex is the primary domain on Vercel (www 308-redirects to it), so
  // canonicals and the sitemap must use it. Not read from an env var: a
  // stale www value there pointed every canonical at a redirect.
  url: "https://neeogreen.com",
  description:
    "NeeoGreen is an AI engineering, web development, and software studio based in Surat, Gujarat. We build AI chatbots, LLM integrations, and AI automation alongside websites and custom software, for businesses across Surat, Ahmedabad, Vadodara, Rajkot, Gandhinagar, and worldwide.",
  email: "hello@neeogreen.com",
  phone: "+91 75679 36593",
  locality: "Surat",
  region: "Gujarat",
  country: "IN",
  // Cities actively targeted for local/GEO SEO, in addition to the base
  // locality above. Used in metadata keywords and the LocalBusiness JSON-LD
  // areaServed list.
  serviceCities: ["Surat", "Ahmedabad", "Vadodara", "Rajkot", "Gandhinagar"],
  // Real profile URLs only: these feed the footer and the structured-data
  // sameAs list, where a generic homepage would confuse the brand entity.
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/neeogreen/" },
    { label: "Instagram", href: "https://www.instagram.com/neeo.green/" },
    { label: "X", href: "https://x.com/Neeogreen" },
  ] as { label: SocialNetwork; href: string }[],
} as const;

export const SERVICES = [
  {
    slug: "ai-engineering",
    n: "01",
    title: "AI Engineering",
    short: "AI chatbots, LLM integrations, and AI agents built into your business, grounded in your own data and measured on real results.",
    eyebrow: "AI systems, chatbots & automation",
    keywords: ["AI engineering company", "AI chatbot development", "LLM integration services", "AI development company Surat", "AI automation services India"],
  },
  {
    slug: "web-development",
    n: "02",
    title: "Web Development",
    short: "Business websites and web apps built fast, built right — from a marketing site to a full product, shipped and maintained.",
    eyebrow: "Websites & web applications",
    keywords: ["web development Surat", "web development Gujarat", "website development company Surat", "web development Ahmedabad"],
  },
  {
    slug: "web-design",
    n: "03",
    title: "Web Design",
    short: "Interfaces people actually want to use — researched, designed, and tested before a single line of code ships.",
    eyebrow: "UI/UX & visual design",
    keywords: ["web design Surat", "web design studio Gujarat", "UI UX design Surat", "website design company Vadodara"],
  },
  {
    slug: "software-engineering",
    n: "04",
    title: "Software Engineering",
    short: "Custom software and internal tools engineered around how your business actually operates, not a generic template.",
    eyebrow: "Custom software & internal tools",
    keywords: ["software engineering Surat", "custom software development Gujarat", "software development company Surat", "software engineers Rajkot"],
  },
  {
    slug: "managed-it-support",
    n: "05",
    title: "Managed IT Support",
    short: "Remote and on-site support, 24/7 monitoring, and a help desk that answers — for businesses and home offices alike.",
    eyebrow: "Help desk & proactive monitoring",
    keywords: ["managed IT services Surat", "IT support Gujarat", "helpdesk support India", "proactive IT monitoring"],
  },
  {
    slug: "cybersecurity",
    n: "06",
    title: "Cybersecurity & Data Protection",
    short: "Firewalls, endpoint protection, and backup and disaster recovery built around how your business actually operates.",
    eyebrow: "Endpoint security & backup",
    keywords: ["cybersecurity services Gujarat", "endpoint protection", "backup and disaster recovery", "data protection Surat"],
  },
  {
    slug: "cloud-solutions",
    n: "07",
    title: "Cloud Solutions",
    short: "Migration to Microsoft 365, Google Workspace, AWS, or Azure — then managed, monitored, and cost-optimized.",
    eyebrow: "Migration & cloud management",
    keywords: ["cloud migration services", "Microsoft 365 setup Surat", "AWS Azure managed services", "cloud IT consulting Gujarat"],
  },
] as const;
