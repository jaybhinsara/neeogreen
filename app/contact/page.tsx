import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — NeeoGreen",
  description:
    "Start a packaging or brand project with NeeoGreen. Based in Surat, India, working with restaurants, cafes, and food brands everywhere.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pb-24 pt-40 md:pb-40 md:pt-48">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1fr_1.3fr] md:gap-10">
            <div className="flex flex-col gap-8">
              <span className="text-xs uppercase tracking-[0.14em] text-muted-on-dark">
                Start a project
              </span>
              <h1 className="max-w-md font-display text-[clamp(36px,5.5vw,64px)] font-semibold uppercase leading-[0.98] tracking-[-0.02em] text-ink-on-dark">
                Let&rsquo;s talk packaging
              </h1>
              <p className="max-w-sm text-base text-muted-on-dark">
                Tell us about the brand and what you need on the shelf. We
                reply to every inquiry within two business days.
              </p>

              <div className="flex flex-col gap-3 border-t border-line-on-dark pt-8 text-sm">
                <a href="mailto:hello@neeogreen.com" className="text-ink-on-dark hover:accent-gradient-text">
                  hello@neeogreen.com
                </a>
                <a href="tel:+910000000000" className="text-ink-on-dark hover:accent-gradient-text">
                  +91 00000 00000
                </a>
                <span className="text-muted-on-dark">Surat, Gujarat, India</span>
              </div>
            </div>

            <ContactForm />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
