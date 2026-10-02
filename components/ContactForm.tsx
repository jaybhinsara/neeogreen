"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const PROJECT_TYPES = ["Web development", "Web design", "Software engineering", "Managed IT & cloud", "Not sure yet"];

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const sending = status === "sending";

  // Fetch the thank-you page ahead of time so the hand-off after a
  // successful send is instant rather than a second wait.
  useEffect(() => {
    router.prefetch("/thank-you");
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
          projectType: data.get("projectType"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "We couldn't send your message just now. Please email hello@neeogreen.com or call/WhatsApp +91 75679 36593.");
      }

      // Stay in the sending state until the thank-you page replaces this
      // one: a dedicated URL that only loads after a successful send, so ad
      // platforms can count it as a conversion.
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We couldn't send your message just now. Please email hello@neeogreen.com or call/WhatsApp +91 75679 36593.");
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={sending} className="flex flex-col gap-8">
      <fieldset disabled={sending} className="flex flex-col gap-8 transition-opacity disabled:opacity-60">
        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Name" name="name" type="text" autoComplete="name" required />
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field
            label="Mobile number"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91 98765 43210"
            required
          />
          <Field label="Company (optional)" name="company" type="text" autoComplete="organization" />
        </div>

        <div className="flex flex-col gap-3">
          <span className="label-mono text-muted">What do you need?</span>
          <div className="flex flex-wrap gap-3">
            {PROJECT_TYPES.map((type) => (
              <label
                key={type}
                className="label-mono cursor-pointer rounded-md border border-line px-4 py-2.5 text-muted transition-colors hover:border-ink hover:text-ink has-checked:border-brand has-checked:bg-brand has-checked:text-white"
              >
                <input type="radio" name="projectType" value={type} className="sr-only" />
                {type}
              </label>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="label-mono text-muted">How can we help?</span>
          <textarea
            name="message"
            required
            rows={5}
            className="resize-none border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-faint focus:border-brand"
            placeholder="Tell us what you're building, and roughly when you need it."
          />
        </label>
      </fieldset>

      {status === "error" && error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="label-mono inline-flex w-fit items-center gap-3 rounded-md bg-brand px-8 py-4 text-white transition-colors hover:bg-brand-deep disabled:cursor-wait disabled:bg-brand-deep"
      >
        {sending && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
          />
        )}
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  inputMode,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "text";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-mono text-muted">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        className="border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-faint focus:border-brand"
      />
    </label>
  );
}
