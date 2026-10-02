import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Emphasis } from "@/components/Emphasis";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How NeeoGreen collects, uses, stores, and protects personal data from this website and our contact form, and the rights you have over it.",
  path: "/privacy",
});

const email = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <>
        <p>
          {SITE.name} is a web development, design, and software engineering studio based in{" "}
          {SITE.locality}, {SITE.region}, India. We are the data fiduciary (or &ldquo;controller&rdquo;) for the
          personal data described in this policy.
        </p>
        <p>You can reach us about anything in this policy at {email}.</p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>
          <strong>Information you give us.</strong> When you use our contact form we collect your name, email
          address, mobile number, company (if you add one), the type of project you select, and your message.
        </p>
        <p>
          <strong>Technical information.</strong> Like most websites, our hosting provider automatically records
          basic request data such as your IP address, browser type, the pages requested, and the time of the
          request. We use this only to keep the site secure and working.
        </p>
        <p>
          <strong>Cookies.</strong> We set one essential cookie to remember your cookie choice, and, only with
          your consent, Google&rsquo;s advertising measurement cookies. See our{" "}
          <Link href="/cookies">Cookie Policy</Link> for details.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    body: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>reply to your enquiry by email, phone, or WhatsApp, and prepare a proposal if you ask for one;</li>
          <li>deliver and support the work if you become a client;</li>
          <li>keep the website secure and prevent misuse;</li>
          <li>meet our legal and accounting obligations.</li>
        </ul>
        <p>We do not sell your personal data, and we do not use it for advertising.</p>
      </>
    ),
  },
  {
    id: "legal-basis",
    heading: "Legal basis",
    body: (
      <>
        <p>
          We process the details you submit through the contact form on the basis of your consent, given when you
          send the form, under India&rsquo;s Digital Personal Data Protection Act, 2023. For visitors in the
          European Union or United Kingdom, we rely on your consent and on taking steps at your request before
          entering into a contract (Article 6(1)(a) and (b) GDPR).
        </p>
        <p>
          Technical request data is processed for the legitimate purpose of operating and securing the website.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    body: (
      <>
        <p>We share personal data only with service providers that help us run this website:</p>
        <ul>
          <li>
            <strong>Vercel</strong>, which hosts the website and processes request data;
          </li>
          <li>
            <strong>Neon</strong>, which hosts the database where contact form submissions are stored;
          </li>
          <li>
            <strong>Google</strong>, only if you accept optional cookies: the Google Ads tag measures which of our
            ads lead to enquiries. See our <Link href="/cookies">Cookie Policy</Link>.
          </li>
        </ul>
        <p>
          These providers may store and process data on servers outside India. They act on our instructions and
          are bound to protect it. We may also disclose information where the law requires us to.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep it",
    body: (
      <p>
        We keep contact form submissions for up to 24 months after our last conversation, unless you become a
        client, in which case we keep project records for as long as the engagement and our legal obligations
        require. You can ask us to delete your data sooner at any time.
      </p>
    ),
  },
  {
    id: "security",
    heading: "Security",
    body: (
      <p>
        The website is served only over HTTPS, submissions are stored in an access-controlled database, and our
        admin area is password-protected. No method of transmission or storage is completely secure, but we take
        reasonable measures to protect your data.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you and how we use it;</li>
          <li>correct or complete inaccurate data;</li>
          <li>erase your data;</li>
          <li>withdraw your consent at any time, without affecting processing that already took place;</li>
          <li>nominate another person to exercise these rights on your behalf, as the DPDP Act allows.</li>
        </ul>
        <p>
          Visitors in the EU or UK also have the rights to restrict or object to processing, to data
          portability, and to complain to their local data protection authority.
        </p>
        <p>Email {email} to make a request. We respond within 30 days.</p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <p>
        This website and our services are intended for businesses and adults. We do not knowingly collect
        personal data from anyone under 18. If you believe a child has sent us their details, contact us and we
        will delete them.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our services or the law change. The date at the top shows when it was last
        revised, and significant changes will be highlighted on this page.
      </p>
    ),
  },
  {
    id: "grievances",
    heading: "Questions and grievances",
    body: (
      <p>
        If you have a question or concern about how we handle your data, email {email} with the subject
        &ldquo;Privacy&rdquo;. If you are not satisfied with our response, you may approach the Data Protection
        Board of India, or your local data protection authority if you are outside India.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title={
        <>
          Privacy <Emphasis tone="light">policy</Emphasis>
        </>
      }
      updated="2 October 2026"
      intro={
        <p>
          What we collect when you visit this website or contact us, why we collect it, and the control you have
          over it. In short: we only collect what we need to reply to you, and we never sell it.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
