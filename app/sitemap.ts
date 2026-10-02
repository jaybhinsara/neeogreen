import type { MetadataRoute } from "next";
import { SITE, SERVICES } from "@/lib/site";

// Legal pages change only when the policy text does, so they carry the
// date shown on the pages rather than the build time. Update both together.
const LEGAL_UPDATED = new Date("2026-10-02");
const LEGAL_PATHS = ["/privacy", "/terms", "/cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/approach`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...SERVICES.map((s) => ({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...LEGAL_PATHS.map((path) => ({
      url: `${SITE.url}${path}`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
