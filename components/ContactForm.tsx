"use client";

import { useState, type FormEvent } from "react";

const PROJECT_TYPES = ["Web development", "Web design", "Software engineering", "Managed IT & cloud", "Not sure yet"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

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
          company: data.get("company"),
          projectType: data.get("projectType"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3 rounded-lg bg-paper px-8 py-12 text-center">
        <span className="font-heading text-3xl font-medium tracking-[-0.03em]">Message sent.</span>
        <p className="text-[15px] text-muted">
          We reply to every inquiry within two business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Company (optional)" name="company" type="text" />

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

      {status === "error" && error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="label-mono inline-flex w-fit items-center rounded-md bg-brand px-8 py-4 text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-mono text-muted">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="border-b border-line bg-transparent py-3 text-lg outline-none transition-colors focus:border-brand"
      />
    </label>
  );
}
