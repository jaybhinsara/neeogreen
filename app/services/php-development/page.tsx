import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";
import { SITE } from "@/lib/site";

// Facts about the October 2026 vulnerabilities follow the public reporting
// (PHP team release on 21 October 2026; remote code execution without
// authentication; updating is the only complete fix). Keep them that way:
// no version numbers or CVE IDs we haven't confirmed from the PHP project.
const content = {
  slug: "php-development" as const,
  title: "PHP Development",
  eyebrow: "PHP, Laravel & security patching",
  intro:
    "On 21 October 2026 the PHP project shipped emergency fixes for critical flaws that let attackers take over servers without logging in, and exploit code appeared within hours. We patch and harden PHP servers fast, upgrade old applications to supported PHP 8 releases, and build and maintain Laravel and WordPress sites that stay secure.",
  deliverables: [
    "Emergency PHP security patching: PHP, PHP-FPM, and extensions updated on your servers, then a check for signs of compromise",
    "PHP version upgrades from PHP 5 and 7 to a supported PHP 8 release, with the code changes the upgrade needs",
    "Laravel and Symfony development, from APIs and admin panels to full web applications",
    "WordPress and WooCommerce development: custom themes and plugins, updates, and hardening",
    "Legacy PHP maintenance and refactoring, so older code keeps running safely",
    "Performance tuning with OPcache, caching, and faster database queries",
    "Security audits, malware clean-up, and an ongoing patch schedule",
  ],
  process: [
    { title: "Audit", desc: "We list every server and site running PHP, its version, and what's exposed to the internet." },
    { title: "Patch", desc: "Critical updates first, tested on a copy of your site so nothing breaks in production." },
    { title: "Upgrade", desc: "Out-of-support PHP versions moved to a current release, with the code fixed along the way." },
    { title: "Maintain", desc: "Monitoring and a standing patch schedule, so the next security release lands in days, not months." },
  ],
  whyTitle: "Why PHP needs an engineer, not just a host",
  whyBody:
    "Most of the web still runs on PHP, WordPress included, and a lot of it sits on versions that stopped getting security fixes years ago. A host can update the server; it takes an engineer to make sure your application still works afterwards. We do both, and we're still here for the next release.",
  faq: [
    {
      q: "Is my website affected by the October 2026 PHP vulnerabilities?",
      a: "If your site or server runs PHP and hasn't been updated since 21 October 2026, treat it as at risk. The flaws allow remote code execution without logging in and were reported to affect PHP versions going back many years. Updating to the latest patched release is the only complete fix; configuration changes only reduce your exposure.",
    },
    {
      q: "How do I check which PHP version my site uses?",
      a: "Run php -v on the server, or look under PHP settings in your hosting control panel, such as cPanel or Plesk. In WordPress, go to Tools, then Site Health, then Info, and open Server. If you can't find it, we can check for you.",
    },
    {
      q: "My site runs PHP 7 or PHP 5. Can it still be patched?",
      a: "Versions past their end of life generally don't receive official security fixes, so the safe path is upgrading to a supported PHP 8 release. We make the code changes the upgrade needs and test everything on a copy of your site before switching over.",
    },
    {
      q: "Do you offer emergency PHP patching?",
      a: "Yes. Book a call or message us on WhatsApp and we'll start with your internet-facing servers, then review logs for signs of access since mid-October, when attacks were first reported.",
    },
    {
      q: "Do you work with Laravel, Symfony, and WordPress?",
      a: "Yes: new builds, upgrades, and maintenance of existing applications, including custom WordPress plugins and WooCommerce stores.",
    },
    {
      q: "Can I hire a dedicated PHP developer?",
      a: "Yes. Alongside fixed-scope projects, we offer ongoing PHP development and maintenance, so you have developers who know your codebase for new features, fixes, and every security update.",
    },
  ],
};

export const metadata: Metadata = pageMetadata({
  title: "PHP Development & Security Patching",
  description:
    "PHP developers in Surat, Gujarat, working worldwide: emergency PHP security patching, PHP 8 upgrades, Laravel and WordPress development, and ongoing maintenance.",
  path: "/services/php-development",
});

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "PHP Development",
  name: "PHP Development & Security Patching",
  provider: { "@type": "ProfessionalService", name: SITE.name, url: SITE.url },
  areaServed: [
    ...SITE.serviceCities.map((city) => ({ "@type": "City", name: city })),
    { "@type": "Country", name: "India" },
    "Worldwide",
  ],
  description: metadata.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "PHP development services",
    itemListElement: [
      "Emergency PHP security patching",
      "PHP 8 upgrades and migration",
      "Laravel development",
      "Symfony development",
      "WordPress and WooCommerce development",
      "Legacy PHP maintenance",
      "PHP performance optimization",
      "PHP security audits",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};

export default function PhpDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ServicePage content={content} />
    </>
  );
}
