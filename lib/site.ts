export const SITE = {
  name: "NeeoGreen",
  tagline: "Managed IT & Technology Services",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://neeogreen.com",
  description:
    "NeeoGreen keeps businesses and individuals running with managed IT support, cybersecurity, cloud, and custom software — responsive, senior-led, and transparent. Based in Surat, India.",
  email: "hello@neeogreen.com",
  phone: "+91 75679 36593",
  locality: "Surat",
  region: "Gujarat",
  country: "IN",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
} as const;

export const SERVICES = [
  {
    slug: "managed-it-support",
    n: "01",
    title: "Managed IT Support",
    short: "Remote and on-site support, 24/7 monitoring, and a help desk that answers — for businesses and home offices alike.",
    eyebrow: "Help desk & proactive monitoring",
    keywords: ["managed IT services", "IT support Surat", "helpdesk support India", "proactive IT monitoring"],
  },
  {
    slug: "cybersecurity",
    n: "02",
    title: "Cybersecurity & Data Protection",
    short: "Firewalls, endpoint protection, and backup and disaster recovery built around how your business actually operates.",
    eyebrow: "Endpoint security & backup",
    keywords: ["cybersecurity services India", "endpoint protection", "backup and disaster recovery", "data protection Surat"],
  },
  {
    slug: "cloud-solutions",
    n: "03",
    title: "Cloud Solutions",
    short: "Migration to Microsoft 365, Google Workspace, AWS, or Azure — then managed, monitored, and cost-optimized.",
    eyebrow: "Migration & cloud management",
    keywords: ["cloud migration services", "Microsoft 365 setup", "AWS Azure managed services", "cloud IT consulting"],
  },
  {
    slug: "software-web-development",
    n: "04",
    title: "Custom Software & Web Development",
    short: "Internal tools, business web apps, and websites built to fit how your team actually works, not a generic template.",
    eyebrow: "Business apps & websites",
    keywords: ["custom software development India", "business web application development", "website development Surat"],
  },
  {
    slug: "networking-infrastructure",
    n: "05",
    title: "Networking & Infrastructure",
    short: "Office networks, Wi-Fi, servers, and structured cabling specified and installed to actually hold up.",
    eyebrow: "Wi-Fi, servers & structured cabling",
    keywords: ["network setup services", "office IT infrastructure", "structured cabling India", "server setup Surat"],
  },
  {
    slug: "it-consulting",
    n: "06",
    title: "IT Consulting & Digital Transformation",
    short: "A technology roadmap, vendor management, and systems integration (CRM/ERP) that matches your actual growth plan.",
    eyebrow: "Technology roadmaps & systems",
    keywords: ["IT consulting India", "digital transformation services", "CRM ERP integration", "technology roadmap consulting"],
  },
] as const;
