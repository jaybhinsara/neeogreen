"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { Container } from "./Container";
import { scrollToHash } from "@/lib/lenis-singleton";
import { SERVICES, SITE } from "@/lib/site";
import { Emphasis } from "./Emphasis";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { LinkedInIcon } from "./LinkedInIcon";

function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  if (scrollToHash(href.slice(hashIndex))) e.preventDefault();
}

const LEGAL = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

const PAGES = [
  { href: "/about", label: "About" },
  { href: "/approach", label: "Approach" },
  { href: "/contact", label: "Get in touch" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand text-white">
      <Container className="relative z-10 pb-10 pt-24 md:pt-32">
        <div className="grid gap-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-8">
            <h2 className="max-w-[12ch] font-heading text-[clamp(36px,4vw,64px)] font-medium leading-[1.02] tracking-[-0.04em]">
              Let&rsquo;s build what&rsquo;s{" "}
              <span className="whitespace-nowrap">
                <Emphasis tone="brand">next</Emphasis>.
              </span>
            </h2>
            <Link
              href="/contact"
              className="label-mono rounded-md bg-white px-6 py-4 text-brand transition-colors hover:bg-white/90"
            >
              Contact us
            </Link>
            {SITE.social.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="label-mono text-white/80">Follow us</span>
                <div className="flex gap-3">
                  {SITE.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${SITE.name} on ${s.label}`}
                      className="group"
                    >
                      {s.label === "LinkedIn" ? (
                        <LinkedInIcon className="h-12 w-12 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105" />
                      ) : (
                        <span className="label-mono">{s.label}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-3">
            <span className="mb-3 border-b border-white/30 pb-3 font-serif text-[28px] italic leading-none text-white">Services</span>
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="text-[15px] hover:underline">
                {s.title}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="mb-3 border-b border-white/30 pb-3 font-serif text-[28px] italic leading-none text-white">Studio</span>
            {PAGES.map((p) => (
              <Link key={p.href} href={p.href} className="text-[15px] hover:underline">
                {p.label}
              </Link>
            ))}
          </nav>

          <address className="flex flex-col gap-3 not-italic">
            <span className="mb-3 border-b border-white/30 pb-3 font-serif text-[28px] italic leading-none text-white">{SITE.locality}, India</span>
            <a href={`mailto:${SITE.email}`} className="text-[15px] hover:underline">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-[15px] hover:underline">
              {SITE.phone}
            </a>
            <span className="mt-3 text-[15px] text-white/85">Working with teams worldwide.</span>
          </address>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-white/20 pt-6 text-white/80 md:flex-row md:items-center md:justify-between">
          <span className="label-mono">&copy; {SITE.name} {new Date().getFullYear()}</span>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-3">
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className="label-mono hover:text-white">
                {l.label}
              </Link>
            ))}
            <CookieSettingsButton className="label-mono text-left hover:text-white" />
          </nav>
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
