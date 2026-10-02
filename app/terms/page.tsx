import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Emphasis } from "@/components/Emphasis";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that apply when you use the NeeoGreen website, including enquiries, intellectual property, liability, and governing law.",
  path: "/terms",
});

const email = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Using this website",
    body: (
      <p>
        These terms apply to your use of {SITE.url.replace("https://", "")} (the &ldquo;website&rdquo;), operated
        by {SITE.name}, {SITE.locality}, {SITE.region}, India. By using the website you agree to them. If you do
        not agree, please do not use the website.
      </p>
    ),
  },
  {
    id: "our-services",
    heading: "Our services",
    body: (
      <p>
        The website describes the services we offer. Any project, support plan, or other engagement is governed
        by a separate written proposal or agreement between you and {SITE.name}. Where that agreement conflicts
        with these terms, the agreement takes priority.
      </p>
    ),
  },
  {
    id: "enquiries",
    heading: "Enquiries and quotes",
    body: (
      <p>
        Sending an enquiry does not create a contract. Estimates, timelines, and prices we share during early
        conversations are indicative until both parties confirm them in writing.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <>
        <p>When using the website you agree not to:</p>
        <ul>
          <li>attempt to gain unauthorised access to the website, its servers, or its admin area;</li>
          <li>interfere with its operation, for example through malware or excessive automated requests;</li>
          <li>submit false, misleading, or unlawful information through our forms;</li>
          <li>use the website in any way that breaks applicable law.</li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <p>
        The website&rsquo;s design, text, graphics, logos, 3D assets, and code belong to {SITE.name} or its
        licensors. You may view and share pages for personal or internal business use, but you may not copy,
        modify, or reuse them commercially without our written permission. Ownership of work we create for
        clients is set out in each client agreement.
      </p>
    ),
  },
  {
    id: "third-party-links",
    heading: "Third-party links",
    body: (
      <p>
        The website may link to other websites. We are not responsible for their content or practices, and a
        link does not mean we endorse them.
      </p>
    ),
  },
  {
    id: "disclaimer",
    heading: "Disclaimer",
    body: (
      <p>
        We keep the website accurate and available, but it is provided &ldquo;as is&rdquo;. Information on it is
        general and is not professional advice for your specific situation, and we do not guarantee that the
        website will always be uninterrupted or error-free.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <p>
        To the extent the law allows, {SITE.name} is not liable for any indirect or consequential loss arising
        from your use of the website. Nothing in these terms limits liability that cannot be limited by law.
      </p>
    ),
  },
  {
    id: "privacy",
    heading: "Privacy",
    body: (
      <p>
        How we handle personal data is explained in our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India. Any dispute relating to the website is subject to the
        exclusive jurisdiction of the courts at {SITE.locality}, {SITE.region}.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes and contact",
    body: (
      <p>
        We may update these terms from time to time; the date at the top shows the latest version. Questions are
        welcome at {email}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Terms of <Emphasis tone="light">use</Emphasis>
        </>
      }
      updated="2 October 2026"
      intro={<p>The ground rules for using this website. Client projects are covered by their own agreements.</p>}
      sections={SECTIONS}
    />
  );
}
