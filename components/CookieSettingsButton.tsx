"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={
        className ??
        "label-mono rounded-[12px_3px_12px_3px] bg-brand px-5 py-3 text-white transition-colors hover:bg-brand-deep"
      }
    >
      Cookie settings
    </button>
  );
}
