"use client";

import { useState, type FormEvent } from "react";

const PROJECT_TYPES = ["Packaging design", "Brand identity", "Social & digital", "Not sure yet"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend wired yet — connect to an API route or form service before launch.
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-3 border border-line-on-dark px-8 py-12 text-center">
        <span className="font-display text-2xl font-semibold uppercase tracking-[-0.01em] text-ink-on-dark">
          Message sent
        </span>
        <p className="text-sm text-muted-on-dark">
          We reply to every project inquiry within two business days.
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
      <Field label="Company / Brand" name="company" type="text" />

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.12em] text-muted-on-dark">
          Project type
        </span>
        <div className="flex flex-wrap gap-3">
          {PROJECT_TYPES.map((type) => (
            <label
              key={type}
              className="cursor-pointer rounded-full border border-line-on-dark px-4 py-2 text-xs uppercase tracking-[0.06em] text-muted-on-dark transition-colors has-checked:border-transparent has-checked:accent-gradient has-checked:text-bg-primary"
            >
              <input type="radio" name="projectType" value={type} className="sr-only" />
              {type}
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.12em] text-muted-on-dark">
          Project details
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none border-b border-line-on-dark bg-transparent py-3 text-base text-ink-on-dark outline-none transition-colors placeholder:text-muted-on-dark focus:border-accent-1"
          placeholder="Tell us about the brand, the packaging you need, and rough timeline."
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-fit items-center rounded-full accent-gradient px-8 py-4 text-sm font-medium uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90"
      >
        Send message
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
      <span className="text-xs uppercase tracking-[0.12em] text-muted-on-dark">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="border-b border-line-on-dark bg-transparent py-3 text-base text-ink-on-dark outline-none transition-colors placeholder:text-muted-on-dark focus:border-accent-1"
      />
    </label>
  );
}
