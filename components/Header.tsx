"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
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

// Leaf silhouette: two opposite corners rounded, two nearly sharp.
const LEAF_PILL = "rounded-[22px_6px_22px_6px]";
const LEAF_BUTTON = "rounded-[12px_3px_12px_3px]";

function NavLink({
  href,
  label,
  index,
  active,
}: {
  href: string;
  label: string;
  index: number;
  active: boolean;
}) {
  return (
    <a
      href={href}
      onClick={(e) => handleAnchorClick(e, href)}
      aria-current={active ? "page" : undefined}
      className="group relative flex items-baseline gap-1.5 py-1 text-sm"
    >
      <span className="font-mono text-[10px] text-brand transition-colors group-hover:text-accent-1 in-data-pill:text-accent-1/80">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className={cn("transition-opacity", active ? "opacity-100" : "opacity-75 group-hover:opacity-100")}>
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-linear-to-r from-brand to-accent-1 transition-transform duration-500 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </a>
  );
}

function BookCallButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/contact"
      onClick={onClick}
      className={cn(
        "label-mono inline-flex items-center gap-2.5 whitespace-nowrap bg-brand text-white transition-colors hover:bg-brand-deep",
        LEAF_BUTTON,
        className
      )}
    >
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent-1 opacity-75 motion-reduce:animate-none" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent-1" />
      </span>
      Book a call
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const isActive = (href: string) => !href.includes("#") && pathname === href;

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
      {/* Desktop: a full-width split nav at the top that collapses into a
          leaf-shaped, forest-tinted glass bar once you scroll. It carries
          its own dark backdrop so it reads over cream, emerald and black. */}
      <div
        data-pill={scrolled || undefined}
        className={cn(
          "relative mx-auto hidden grid-cols-[1fr_auto_1fr] items-center overflow-hidden transition-[max-width,margin,padding,background-color,box-shadow,color] duration-500 ease-out md:grid",
          LEAF_PILL,
          scrolled
            ? "mt-4 max-w-[920px] bg-[#06140e]/75 px-6 py-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(52,211,153,0.14),0_18px_40px_-18px_rgba(5,7,6,0.6)] backdrop-blur-xl"
            : "mt-0 max-w-[1440px] px-10 py-7 text-ink"
        )}
      >
        <nav className="flex items-center gap-8">
          {LEFT_LINKS.map((link, i) => (
            <NavLink key={link.href} {...link} index={i} active={isActive(link.href)} />
          ))}
        </nav>

        <Link href="/#top" onClick={(e) => handleAnchorClick(e, "/#top")} aria-label="NeeoGreen home">
          <Logo />
        </Link>

        <nav className="flex items-center justify-end gap-8">
          {RIGHT_LINKS.map((link, i) => (
            <NavLink
              key={link.href}
              {...link}
              index={LEFT_LINKS.length + i}
              active={isActive(link.href)}
            />
          ))}
          <BookCallButton className="px-4 py-2.5" />
        </nav>

        {/* Growth vein: tracks how far down the page you are. */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-linear-to-r from-brand via-accent-1 to-accent-2 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />
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
                  className="flex items-baseline gap-3 border-b border-line py-5 font-heading text-4xl font-medium tracking-[-0.03em] text-ink"
                >
                  <span className="font-mono text-xs tracking-normal text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <BookCallButton onClick={() => setMenuOpen(false)} className="justify-center px-5 py-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
