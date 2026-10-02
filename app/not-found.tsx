import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Emphasis } from "@/components/Emphasis";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <>
      <Header onDark />
      <main className="relative overflow-hidden bg-night text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(120vw,900px)] w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_closest-side,#000_34%,rgba(0,0,0,0.6)_44%,rgba(10,154,101,0.28)_58%,transparent_100%)]"
        />
        <Container className="relative flex min-h-svh flex-col justify-center py-40">
          <span className="label-mono text-accent-1">Error 404</span>
          <h1 className="mt-6 max-w-[12ch] font-heading text-[clamp(48px,7vw,112px)] font-medium leading-[0.98] tracking-[-0.045em]">
            Lost in <Emphasis>space</Emphasis>.
          </h1>
          <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-white/80 md:text-xl">
            This page has drifted out of orbit, or it never existed. Try one of these instead.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="label-mono rounded-[12px_3px_12px_3px] bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep"
            >
              Back to home
            </Link>
            <Link
              href="/contact"
              className="label-mono rounded-[12px_3px_12px_3px] px-6 py-4 text-white/85 ring-1 ring-white/25 transition-colors hover:text-white hover:ring-white/50"
            >
              Contact us
            </Link>
          </div>

          <nav aria-label="Services" className="mt-16 max-w-xl border-t border-white/15 pt-6">
            <span className="label-mono text-white/60">Our services</span>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-[15px] text-white/85 hover:text-accent-1">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </main>
      <Footer />
    </>
  );
}
