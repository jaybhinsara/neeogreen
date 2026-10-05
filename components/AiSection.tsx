"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Emphasis } from "./Emphasis";
import { BookCallTrigger } from "./BookCallTrigger";
import { NeeoBot } from "./NeeoBot";

const CAPABILITIES = [
  { title: "AI chatbots", desc: "Assistants for your website, WhatsApp, and support that answer like your best staff member." },
  { title: "LLM integration", desc: "GPT, Claude, or Gemini built into your product and internal tools, not bolted on." },
  { title: "Knowledge assistants", desc: "Answers grounded in your own documents, policies, and data, with sources." },
  { title: "AI agents", desc: "Automations that read, decide, and act across your tools, with a person in control." },
  { title: "Document AI", desc: "Invoices, forms, and contracts turned into clean, structured data automatically." },
  { title: "Guardrails & evals", desc: "Testing, monitoring, and cost control so AI stays accurate, private, and affordable." },
];

// An illustrative exchange (not a client's) showing what an assistant built
// on a business's own data feels like.
const CHAT = [
  { from: "user", text: "Do you deliver to Ahmedabad, and how fast?" },
  { from: "ai", text: "Yes. Orders to Ahmedabad usually arrive in 2–3 business days. Want me to check stock for something?" },
  { from: "user", text: "The 5L steel pressure cooker." },
  { from: "ai", text: "In stock, 14 left. I've saved it to a cart for you. Shall I send the checkout link here on WhatsApp?" },
];

function ChatDemo() {
  const reduced = useReducedMotion();
  return (
    <div className="rounded-[24px_6px_24px_6px] bg-night p-5 text-white shadow-[0_0_0_1px_rgba(52,211,153,0.14),0_40px_80px_-30px_rgba(5,7,6,0.6)] md:p-7">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent-1 opacity-75 motion-reduce:animate-none" />
            <span className="relative h-2 w-2 rounded-full bg-accent-1" />
          </span>
          <span className="text-[15px] font-medium">Store assistant</span>
        </div>
        <span className="label-mono text-white/50">Example</span>
      </div>

      <motion.ul
        className="mt-5 flex flex-col gap-3"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ shown: { transition: { staggerChildren: reduced ? 0 : 0.9 } } }}
      >
        {CHAT.map((m, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 10 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
            }}
            className={
              m.from === "user"
                ? "max-w-[82%] self-end rounded-[16px_16px_4px_16px] bg-white/10 px-4 py-3 text-[15px] leading-snug"
                : "max-w-[88%] self-start rounded-[16px_16px_16px_4px] bg-brand/90 px-4 py-3 text-[15px] leading-snug"
            }
          >
            {m.text}
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-5 flex items-center gap-2 rounded-full bg-white/5 px-4 py-3 text-[14px] text-white/40">
        Ask anything&hellip;
      </div>
    </div>
  );
}

export function AiSection() {
  return (
    <section id="ai" className="relative bg-page py-28 md:py-40">
      <div className="pointer-events-none absolute right-4 top-8 z-10 md:right-[6%] md:top-24">
        <div className="pointer-events-auto w-[76px] md:w-[124px]">
          <NeeoBot range={240} />
        </div>
      </div>
      <Container>
        <Reveal>
          <span className="label-mono text-brand">AI Engineering</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-[16ch] font-heading text-[clamp(36px,4.6vw,76px)] font-medium leading-[1.02] tracking-[-0.04em]">
            AI that does real{" "}
            <span className="whitespace-nowrap">
              <Emphasis tone="light">work</Emphasis>.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-[56ch] text-lg leading-relaxed text-muted md:text-xl">
            We design, build, and run AI systems for businesses worldwide: chatbots that answer customers,
            assistants that know your documents, and agents that take repetitive work off your team. Grounded in
            your data, measured on results.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-[1.15fr_1fr] md:gap-16">
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={0.04 * i}>
                <li className="flex flex-col gap-3 border-t border-line py-6">
                  <span className="label-mono text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-[clamp(28px,2.4vw,36px)] italic leading-none tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted">{c.desc}</p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="md:sticky md:top-32">
              <ChatDemo />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/services/ai-engineering"
                  className="label-mono rounded-[12px_3px_12px_3px] bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep"
                >
                  Explore AI Engineering &rarr;
                </Link>
                <BookCallTrigger className="label-mono rounded-[12px_3px_12px_3px] px-6 py-4 text-ink ring-1 ring-line transition-colors hover:ring-ink">
                  Book a call
                </BookCallTrigger>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
