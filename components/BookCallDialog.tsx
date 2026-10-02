"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Emphasis } from "./Emphasis";
import { OPEN_BOOK_CALL_EVENT, WHATSAPP_TEXT_KEY, whatsappChatUrl } from "@/lib/book-call";
import { isValidPhone } from "@/lib/phone";

// "Book a call": a two-field shortcut that records the lead, opens a WhatsApp
// chat to the studio with the details already typed, and moves this tab to
// the thank-you page (the ad conversion).
export function BookCallDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const show = () => {
      setError(null);
      setOpen(true);
    };
    window.addEventListener(OPEN_BOOK_CALL_EVENT, show);
    return () => window.removeEventListener(OPEN_BOOK_CALL_EVENT, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    router.prefetch("/thank-you");
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, router]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!isValidPhone(phone)) {
      setError("Enter a valid mobile number, with country code if outside India.");
      return;
    }

    // Saved in the background; the visitor shouldn't wait on it, and the
    // WhatsApp message carries the same details either way.
    fetch("/api/call-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
      keepalive: true,
    }).catch(() => {});

    const text = `Hi NeeoGreen, I'd like to book a call.\n\nName: ${name}\nNumber: ${phone}`;
    try {
      sessionStorage.setItem(WHATSAPP_TEXT_KEY, text);
    } catch {}
    // Opened synchronously inside the submit so browsers treat it as a
    // user action and don't block it.
    window.open(whatsappChatUrl(text), "_blank", "noopener,noreferrer");
    setOpen(false);
    router.push("/thank-you?via=whatsapp");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="book-call"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[95] flex items-end justify-center bg-night/60 p-4 backdrop-blur-sm md:items-center"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-call-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[24px_6px_24px_6px] bg-[#06140e]/95 p-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(52,211,153,0.16),0_30px_80px_-20px_rgba(5,7,6,0.8)] md:p-9"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                &times;
              </span>
            </button>

            <h2 id="book-call-title" className="font-heading text-3xl font-medium tracking-[-0.03em]">
              Book a <Emphasis>call</Emphasis>.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              Leave your name and number. WhatsApp opens with them ready to send, and we&rsquo;ll reply there.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="label-mono text-white/70">Name</span>
                <input
                  ref={nameRef}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="autofill-dark border-b border-white/25 bg-transparent py-3 text-lg text-white outline-none transition-colors focus:border-accent-1"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="label-mono text-white/70">Mobile number</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="+91 98765 43210"
                  onChange={() => error && setError(null)}
                  className="autofill-dark border-b border-white/25 bg-transparent py-3 text-lg text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent-1"
                />
              </label>

              {error && (
                <p className="text-sm text-[#ffb4a8]" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="label-mono mt-1 rounded-[12px_3px_12px_3px] bg-brand px-6 py-4 text-white transition-colors hover:bg-brand-deep"
              >
                Continue on WhatsApp &rarr;
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
