export const SITE = {
  name: "NeeoGreen",
  tagline: "Web Development, Design & Software Engineering Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://neeogreen.com",
  description:
    "NeeoGreen is a web development, web design, and software engineering studio based in Surat, Gujarat — serving businesses and individuals across Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar, plus managed IT, cloud, and cybersecurity support.",
  email: "hello@neeogreen.com",
  phone: "+91 75679 36593",
  locality: "Surat",
  region: "Gujarat",
  country: "IN",
  // Cities actively targeted for local/GEO SEO, in addition to the base
  // locality above. Used in metadata keywords and the LocalBusiness JSON-LD
  // areaServed list.
  serviceCities: ["Surat", "Ahmedabad", "Vadodara", "Rajkot", "Gandhinagar"],
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
} as const;

export const SERVICES = [
  {
    slug: "web-development",
    n: "01",
    title: "Web Development",
    short: "Business websites and web apps built fast, built right — from a marketing site to a full product, shipped and maintained.",
    eyebrow: "Websites & web applications",
    keywords: ["web development Surat", "web development Gujarat", "website development company Surat", "web development Ahmedabad"],
  },
  {
    slug: "web-design",
    n: "02",
    title: "Web Design",
    short: "Interfaces people actually want to use — researched, designed, and tested before a single line of code ships.",
    eyebrow: "UI/UX & visual design",
    keywords: ["web design Surat", "web design studio Gujarat", "UI UX design Surat", "website design company Vadodara"],
  },
  {
    slug: "software-engineering",
    n: "03",
    title: "Software Engineering",
    short: "Custom software and internal tools engineered around how your business actually operates, not a generic template.",
    eyebrow: "Custom software & internal tools",
    keywords: ["software engineering Surat", "custom software development Gujarat", "software development company Surat", "software engineers Rajkot"],
  },
  {
    slug: "managed-it-support",
    n: "04",
    title: "Managed IT Support",
    short: "Remote and on-site support, 24/7 monitoring, and a help desk that answers — for businesses and home offices alike.",
    eyebrow: "Help desk & proactive monitoring",
    keywords: ["managed IT services Surat", "IT support Gujarat", "helpdesk support India", "proactive IT monitoring"],
  },
  {
    slug: "cybersecurity",
    n: "05",
    title: "Cybersecurity & Data Protection",
    short: "Firewalls, endpoint protection, and backup and disaster recovery built around how your business actually operates.",
    eyebrow: "Endpoint security & backup",
    keywords: ["cybersecurity services Gujarat", "endpoint protection", "backup and disaster recovery", "data protection Surat"],
  },
  {
    slug: "cloud-solutions",
    n: "06",
    title: "Cloud Solutions",
    short: "Migration to Microsoft 365, Google Workspace, AWS, or Azure — then managed, monitored, and cost-optimized.",
    eyebrow: "Migration & cloud management",
    keywords: ["cloud migration services", "Microsoft 365 setup Surat", "AWS Azure managed services", "cloud IT consulting Gujarat"],
  },
] as const;
