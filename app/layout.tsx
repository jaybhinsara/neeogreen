import type { Metadata } from "next";
import { clashDisplay, inter, instrumentSerif } from "./fonts";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { GridLines } from "@/components/GridLines";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "managed IT services",
    "IT support Surat",
    "cybersecurity services India",
    "cloud migration services",
    "custom software development India",
    "IT consulting India",
    "network setup services",
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  icons: { icon: "/logo/favicon-source.svg" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  logo: `${SITE.url}/logo/icon.svg`,
  image: `${SITE.url}/logo/icon.svg`,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  areaServed: "IN",
  sameAs: Object.values(SITE.social),
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Managed IT Support" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cybersecurity & Data Protection" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cloud Solutions" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software & Web Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Networking & Infrastructure" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "IT Consulting & Digital Transformation" } },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary text-ink-on-dark">
        {/* React hoists this into <head>. The Hero's leaf mark is the LCP
            element on first paint (before hydration swaps in the WebGL
            canvas). This SVG is also referenced by other <img> tags without
            fetchPriority, and Next's own auto-generated preload for it
            doesn't inherit "high" from any single instance — so declare it
            explicitly here rather than depending on that. */}
        <link rel="preload" as="image" href="/logo/icon.svg" fetchPriority="high" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- static, non-user-controlled structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SmoothScroll />
        <CustomCursor />
        <GridLines />
        {children}
      </body>
    </html>
  );
}
