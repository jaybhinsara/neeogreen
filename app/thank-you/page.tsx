import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { Emphasis } from "@/components/Emphasis";
import { SITE } from "@/lib/site";

// Shown only after a successful contact form submission; ad platforms use
// this URL as the lead conversion. Kept out of search and the sitemap.
export const metadata: Metadata = {
  title: "Thank you",
  description: "Your message has reached NeeoGreen. We reply within one business day.",
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  { title: "We read it", desc: "A real person on the team reads your message, not an auto-responder." },
  { title: "We reply", desc: "Within one business day, usually sooner, by email or phone." },
  { title: "We talk", desc: "A short call to understand what you need before we propose anything." },
];

export default function ThankYouPage() {
  const whatsapp = `https://wa.me/${SITE.phone.replace(/\D/g, "")}`;

  return (
    <>
      <Header />
      <main className="bg-page pb-24 pt-40 md:pb-32 md:pt-52">
        <Container>
          <span className="label-mono text-brand">Message received</span>
          <h1 className="mt-6 max-w-[14ch] font-heading text-[clamp(44px,7vw,112px)] font-medium leading-[0.98] tracking-[-0.045em]">
            Thank <Emphasis tone="light">you</Emphasis>.
          </h1>
          <p className="mt-10 max-w-[48ch] text-lg leading-relaxed text-muted md:text-xl">
            Your message is with us. We&rsquo;ll reply within one business day. If it&rsquo;s urgent, call or
            WhatsApp us on{" "}
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-ink underline underline-offset-2">
              {SITE.phone}
            </a>
            .
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {NEXT_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-4 border-t border-line pt-6">
                <span className="label-mono text-brand">0{i + 1}</span>
                <h2 className="font-serif text-[clamp(34px,3vw,44px)] italic leading-none tracking-[-0.01em]">
                  {step.title}
                </h2>
                <p className="text-base leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-3">
            <Link
              href="/"
              className="label-mono rounded-[12px_3px_12px_3px] bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep"
            >
              Back to home
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="label-mono rounded-[12px_3px_12px_3px] px-6 py-4 text-ink ring-1 ring-line transition-colors hover:ring-ink"
            >
              WhatsApp us
            </a>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
