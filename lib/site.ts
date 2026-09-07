export const SITE = {
  name: "NeeoGreen",
  tagline: "Brand, Packaging & Digital Studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://neeogreen.vercel.app",
  description:
    "NeeoGreen builds complete brand systems — identity, eco-friendly packaging, and digital & social marketing — for restaurants, cafés, cloud kitchens, and D2C food brands. Based in Surat, India.",
  email: "hello@neeogreen.com",
  phone: "+91 00000 00000",
  locality: "Surat",
  region: "Gujarat",
  country: "IN",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    behance: "https://behance.net",
  },
} as const;

export const SERVICES = [
  {
    slug: "brand-identity",
    n: "01",
    title: "Brand Identity",
    short: "Logo, guidelines, and a visual system built to carry across packaging, social, and everywhere else your brand shows up.",
    eyebrow: "Brand strategy & identity design",
    keywords: ["brand identity design", "logo design studio", "brand guidelines", "brand strategy India"],
  },
  {
    slug: "packaging-design",
    n: "02",
    title: "Packaging Design",
    short: "Custom paper cups, food boxes, mailers and bags — from concept sketches to print-ready dielines, with eco material sourcing built in.",
    eyebrow: "Eco-friendly packaging design",
    keywords: ["eco friendly packaging design", "custom packaging design India", "sustainable packaging Surat", "food packaging design"],
  },
  {
    slug: "digital-marketing",
    n: "03",
    title: "Digital & Social Marketing",
    short: "Content design, social templates, campaigns, and launch assets that put your brand — and your packaging — in front of the right people.",
    eyebrow: "Social media & digital marketing",
    keywords: ["digital marketing agency", "social media marketing for restaurants", "brand launch campaigns", "content design studio"],
  },
] as const;
