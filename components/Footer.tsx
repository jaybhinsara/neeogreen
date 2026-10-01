"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Container } from "./Container";
import { scrollToHash } from "@/lib/lenis-singleton";
import { SERVICES, SITE } from "@/lib/site";

function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  if (scrollToHash(href.slice(hashIndex))) e.preventDefault();
}

const PAGES = [
  { href: "/about", label: "About" },
  { href: "/approach", label: "Approach" },
  { href: "/contact", label: "Get in touch" },
];

const SOCIALS = [
  { href: SITE.social.instagram, label: "Instagram" },
  { href: SITE.social.linkedin, label: "LinkedIn" },
  { href: SITE.social.twitter, label: "X (Twitter)" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand text-white">
      <Container className="relative z-10 pb-10 pt-24 md:pt-32">
        <div className="grid gap-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-8">
            <h2 className="max-w-[12ch] font-heading text-[clamp(36px,4vw,64px)] font-medium leading-[1.02] tracking-[-0.04em]">
              Let&rsquo;s build what&rsquo;s next.
            </h2>
            <Link
              href="/contact"
              className="label-mono rounded-md bg-white px-6 py-4 text-brand transition-colors hover:bg-white/90"
            >
              Contact us
            </Link>
          </div>

          <nav className="flex flex-col gap-3">
            <span className="label-mono mb-2 text-white/60">Services</span>
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="text-[15px] hover:underline">
                {s.title}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="label-mono mb-2 text-white/60">Studio</span>
            {PAGES.map((p) => (
              <Link key={p.href} href={p.href} className="text-[15px] hover:underline">
                {p.label}
              </Link>
            ))}
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-[15px] hover:underline">
                {s.label}
              </a>
            ))}
          </nav>

          <address className="flex flex-col gap-3 not-italic">
            <span className="label-mono mb-2 text-white/60">HQ &mdash; {SITE.locality}, India</span>
            <a href={`mailto:${SITE.email}`} className="text-[15px] hover:underline">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-[15px] hover:underline">
              {SITE.phone}
            </a>
            <span className="mt-3 text-[15px] text-white/70">Working with teams worldwide.</span>
          </address>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/20 pt-6 text-white/70">
          <span className="label-mono">&copy; {SITE.name} {new Date().getFullYear()}</span>
          <Link href="/#top" onClick={(e) => handleAnchorClick(e, "/#top")} className="label-mono hover:text-white">
            Back to top &uarr;
          </Link>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none -mb-[3.5vw] select-none whitespace-nowrap text-center font-display text-[15.5vw] font-semibold uppercase leading-[0.8] tracking-[-0.04em] text-glass"
      >
        NeeoGreen
      </div>
    </footer>
  );
}
