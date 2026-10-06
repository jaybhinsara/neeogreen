import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { Emphasis } from "@/components/Emphasis";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get a free consultation with NeeoGreen — web development, web design, and software engineering, plus managed IT and cloud support. Serving Surat, Ahmedabad, Vadodara, Rajkot, and Gandhinagar.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="bg-page pb-24 pt-40 md:pb-40 md:pt-52">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1fr_1.2fr] md:gap-20">
            <div className="flex flex-col gap-8">
              <span className="eyebrow text-brand-deep">Book a call</span>
              <h1 className="max-w-[12ch] font-heading text-[clamp(44px,6vw,96px)] font-medium leading-[0.98] tracking-[-0.045em]">
                Let&rsquo;s build what&rsquo;s{" "}
                <span className="whitespace-nowrap">
                  <Emphasis tone="light">next</Emphasis>.
                </span>
              </h1>
              <p className="max-w-[40ch] text-lg leading-relaxed text-muted">
                Tell us what you&rsquo;re building, a website, a web app,
                custom software, or IT that just needs to work. We reply to
                every inquiry within one business day.
              </p>

              <div className="flex flex-col gap-3 border-t border-line pt-8 text-[15px]">
                <a href={`mailto:${SITE.email}`} className="hover:text-brand">
                  {SITE.email}
                </a>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                  {SITE.phone}
                </a>
                <span className="text-muted">
                  {SITE.locality}, {SITE.region}, India
                </span>
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
