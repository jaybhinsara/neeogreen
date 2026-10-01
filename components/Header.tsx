"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/lenis-singleton";

const LEFT_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
];
const RIGHT_LINKS = [
  { href: "/approach", label: "Approach" },
  { href: "/contact", label: "Contact" },
];
const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  if (scrollToHash(href.slice(hashIndex))) e.preventDefault();
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      onClick={(e) => handleAnchorClick(e, href)}
      className="text-sm opacity-80 transition-opacity hover:opacity-100"
    >
      {label}
    </a>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 md:px-6">
      {/* Desktop: a full-width split nav over the page at the top, which
          collapses into a centered translucent pill once you scroll — the
          pill stays legible over cream, the emerald block, and the black
          block alike because it carries its own dark backdrop. */}
      <div
        className={cn(
          "mx-auto hidden grid-cols-[1fr_auto_1fr] items-center transition-[max-width,margin,padding,background-color,border-radius,color] duration-500 ease-out md:grid",
          scrolled
            ? "mt-4 max-w-[920px] rounded-xl bg-ink/55 px-6 py-3.5 text-white backdrop-blur-xl"
            : "mt-0 max-w-[1440px] px-10 py-7 text-ink"
        )}
      >
        <nav className="flex items-center gap-8">
          {LEFT_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <Link href="/#top" onClick={(e) => handleAnchorClick(e, "/#top")} aria-label="NeeoGreen home">
          <Logo />
        </Link>

        <nav className="flex items-center justify-end gap-8">
          {RIGHT_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
          <Link
            href="/contact"
            className="label-mono whitespace-nowrap rounded-md bg-brand px-4 py-2.5 text-white transition-colors hover:bg-brand-deep"
          >
            Book a call
          </Link>
        </nav>
      </div>

      {/* Mobile */}
      <div
        className={cn(
          "-mx-4 flex h-16 items-center justify-between px-5 transition-colors duration-300 md:hidden",
          menuOpen || scrolled ? "bg-page/90 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <Link href="/#top" onClick={(e) => handleAnchorClick(e, "/#top")} aria-label="NeeoGreen home" className="text-ink">
          <Logo />
        </Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-10 flex h-9 w-9 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={cn(
              "block h-px w-6 bg-ink transition-transform duration-300",
              menuOpen && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-px w-6 bg-ink transition-transform duration-300",
              menuOpen && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      {menuOpen && <div className="fixed inset-0 top-16 z-40 bg-page md:hidden" />}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-16 z-40 flex flex-col justify-between px-6 pb-10 pt-6 md:hidden"
          >
            <nav className="flex flex-col">
              {ALL_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href);
                    setMenuOpen(false);
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="border-b border-line py-5 font-heading text-4xl font-medium tracking-[-0.03em] text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="label-mono inline-flex items-center justify-center rounded-md bg-brand px-5 py-4 text-white"
            >
              Book a call
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
