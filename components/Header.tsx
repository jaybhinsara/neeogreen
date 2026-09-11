"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/lenis-singleton";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/studio", label: "Studio" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  if (scrollToHash(href.slice(hashIndex))) e.preventDefault();
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        // No transition while the menu is open: this background must snap to
        // fully opaque instantly, not fade in over 300ms (which was a real,
        // visible window of partial transparency, not just a testing artifact).
        menuOpen ? "" : "transition-[background-color,backdrop-filter,border-color] duration-300",
        // Desktop chrome moves onto the floating pill below — the bar itself
        // stays transparent at md: and up. Mobile keeps the exact classes it
        // had before (full-width bar, opaque while the menu is open); that
        // path is untouched.
        menuOpen
          ? "border-b border-line-on-dark bg-bg-primary md:border-none md:bg-transparent"
          : scrolled
            ? "border-b border-line-on-dark bg-bg-primary/70 backdrop-blur-md md:border-none md:bg-transparent md:backdrop-blur-none"
            : "border-b border-transparent bg-transparent"
      )}
    >
      <Container>
        <div
          className={cn(
            "flex h-20 items-center justify-between md:h-auto md:rounded-full md:border md:border-line-on-dark md:px-6 md:py-3 md:mt-4 md:transition-colors md:duration-300",
            scrolled
              ? "md:bg-bg-primary/80 md:backdrop-blur-xl md:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              : "md:bg-bg-primary/40 md:backdrop-blur-xl"
          )}
        >
          <Link
            href="/#top"
            onClick={(e) => handleAnchorClick(e, "/#top")}
            aria-label="NeeoGreen home"
            className="relative z-10"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="text-xs uppercase tracking-[0.12em] text-muted-on-dark transition-colors hover:text-ink-on-dark"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Link
            href="/contact"
            className="hidden items-center rounded-full accent-gradient px-5 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 md:inline-flex"
          >
            Start a project
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-10 flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={cn(
                "block h-px w-6 bg-ink-on-dark transition-transform duration-300",
                menuOpen && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-6 bg-ink-on-dark transition-transform duration-300",
                menuOpen && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </Container>

      {/* Opaque backdrop: a plain, unanimated element tied 1:1 to menuOpen so
          full-screen coverage is guaranteed the instant the menu opens,
          independent of whether the slide-in animation below has run yet. */}
      {menuOpen && <div className="fixed inset-0 top-20 z-40 bg-bg-primary md:hidden" />}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-20 z-40 flex flex-col justify-between px-6 pb-10 pt-6 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {LINKS.map((link, i) => (
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
                  className="border-b border-line-on-dark py-5 font-display text-3xl uppercase tracking-[-0.02em] text-ink-on-dark"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full accent-gradient px-5 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-bg-primary"
            >
              Start a project
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
