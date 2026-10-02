"use client";

import { useSyncExternalStore } from "react";
import { WHATSAPP_TEXT_KEY, whatsappChatUrl } from "@/lib/book-call";

const noopSubscribe = () => () => {};
function readText() {
  try {
    return sessionStorage.getItem(WHATSAPP_TEXT_KEY);
  } catch {
    return null;
  }
}

// Re-opens the WhatsApp chat with the visitor's prepared message, for when
// the browser blocked the tab the Book a call dialog tried to open.
export function WhatsAppReopen({ className }: { className?: string }) {
  const text = useSyncExternalStore(noopSubscribe, readText, () => null);
  return (
    <a href={whatsappChatUrl(text ?? undefined)} target="_blank" rel="noreferrer" className={className}>
      Open WhatsApp
    </a>
  );
}
