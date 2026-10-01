import type { Metadata } from "next";
import { clashDisplay, inter, jetbrainsMono } from "./fonts";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollThumb } from "@/components/ScrollThumb";
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
    "web development Surat",
    "web design Surat",
    "software engineering Gujarat",
    "web development company Ahmedabad",
    "web design studio Vadodara",
    "software development company Rajkot",
    "website development Gandhinagar",
    "managed IT services Gujarat",
    "cybersecurity services Surat",
    "cloud migration services",
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  icons: { icon: "/logo/favicon-source.svg" },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": SITE.serviceCities.join(", "),
  },
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
  areaServed: SITE.serviceCities.map((city) => ({ "@type": "City", name: city })),
  sameAs: Object.values(SITE.social),
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Design" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Software Engineering" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Managed IT Support" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cybersecurity & Data Protection" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cloud Solutions" } },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-page text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger -- static, non-user-controlled structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SmoothScroll />
        <CustomCursor />
        <ScrollThumb />
        {children}
      </body>
    </html>
  );
}
