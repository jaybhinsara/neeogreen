import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Emphasis } from "@/components/Emphasis";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "Which cookies the NeeoGreen website uses, why, and how to change your cookie preferences at any time.",
  path: "/cookies",
});

const SECTIONS: LegalSection[] = [
  {
    id: "what-are-cookies",
    heading: "What cookies are",
    body: (
      <p>
        Cookies are small text files a website stores in your browser. Some are essential for a site to work;
        others, such as analytics cookies, are optional and need your consent.
      </p>
    ),
  },
  {
    id: "cookies-we-use",
    heading: "Cookies we use",
    body: (
      <>
        <p>
          <strong>Essential.</strong> We set a single cookie, <code>ng_consent</code>, to remember whether you
          chose &ldquo;Accept all&rdquo; or &ldquo;Essential only&rdquo;, so we don&rsquo;t ask again on every
          visit. It contains no personal data and expires after 12 months.
        </p>
        <p>
          <strong>Analytics and advertising measurement (optional).</strong> Only if you choose &ldquo;Accept
          all&rdquo;, we load the Google tag for Google Analytics and Google Ads, so we can see how visitors use
          the site and which of our ads lead to enquiries. Google may set cookies on our domain such as{" "}
          <code>_ga</code> and <code>_ga_&lt;id&gt;</code> (Analytics, up to 2 years) and <code>_gcl_au</code>{" "}
          (Ads, up to 90 days), plus its own cookies on Google domains. It receives information such as the
          pages you visit here, your device and approximate location, and the ad you came from. If you choose
          &ldquo;Essential only&rdquo;, the tag is never loaded; if you switch later, it stops storing or reading
          cookies and we remove the ones it set.
        </p>
        <p>
          <strong>Third parties.</strong> Our fonts are served from our own domain. Google, through the tag
          above, is the only third party that can set cookies through this website, and only with your consent.
          See{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
            how Google uses information from sites that use its services
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    heading: "Your choices",
    body: (
      <>
        <p>
          When you first visit, we ask for your choice. You can change it at any time here or from the
          &ldquo;Cookie settings&rdquo; link in the footer:
        </p>
        <p>
          <CookieSettingsButton />
        </p>
        <p>
          You can also delete or block cookies in your browser settings. Blocking the essential cookie only means
          we&rsquo;ll ask for your choice again.
        </p>
      </>
    ),
  },
  {
    id: "more",
    heading: "More information",
    body: (
      <p>
        For how we handle personal data more broadly, see our <Link href="/privacy">Privacy Policy</Link>.
        Questions are welcome at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Cookie <Emphasis tone="light">policy</Emphasis>
        </>
      }
      updated="19 October 2026"
      intro={
        <p>
          We keep cookies to the minimum: one essential cookie, and Google&rsquo;s analytics and ad measurement
          only if you say yes.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
