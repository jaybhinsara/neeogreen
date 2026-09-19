"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { scrollToHash } from "@/lib/lenis-singleton";
import { SERVICES } from "@/lib/site";

function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  if (scrollToHash(href.slice(hashIndex))) e.preventDefault();
}

const SITEMAP = [
  ...SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
  { href: "/about", label: "About" },
  { href: "/approach", label: "Approach" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="7.5" y1="10" x2="7.5" y2="16.5" />
        <circle cx="7.5" cy="7" r="0.9" fill="currentColor" stroke="none" />
        <path d="M11.5 16.5V10M11.5 12.5c0-1.4 1-2.5 2.5-2.5s2.5 1.1 2.5 2.5v4" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.9 2H22l-7.6 8.7L23 22h-7l-5.5-6.6L4.1 22H1l8.1-9.3L1 2h7.2l5 6.1zm-1.2 18h1.7L7.4 4H5.6z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line-on-dark pb-8 pt-20 md:pt-28">
      <Container>
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm text-muted-on-dark">
              Managed IT support, cybersecurity, cloud, and custom software
              for businesses and individuals — based in Surat, India.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
              Sitemap
            </span>
            <ul className="flex flex-col gap-3">
              {SITEMAP.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="text-sm text-ink-on-dark transition-colors hover:accent-gradient-text"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
              Contact
            </span>
            <ul className="flex flex-col gap-3 text-sm text-ink-on-dark">
              <li>
                <a href="mailto:hello@neeogreen.com" className="hover:accent-gradient-text">
                  hello@neeogreen.com
                </a>
              </li>
              <li>
                <a href="tel:+917567936593" className="hover:accent-gradient-text">
                  +91 75679 36593
                </a>
              </li>
              <li className="text-muted-on-dark">Surat, Gujarat, India</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
              Social
            </span>
            <ul className="flex flex-col gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-ink-on-dark transition-colors hover:accent-gradient-text"
                  >
                    {s.icon}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line-on-dark pt-8 text-xs text-muted-on-dark md:flex-row">
          <span>&copy; NeeoGreen {new Date().getFullYear()}</span>
          <Link
            href="/#top"
            onClick={(e) => handleAnchorClick(e, "/#top")}
            className="inline-flex items-center gap-2 uppercase tracking-[0.1em] transition-colors hover:text-ink-on-dark"
          >
            Back to top
            <span aria-hidden="true">&uarr;</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}
