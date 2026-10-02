import { SITE } from "./site";
import { toWhatsAppNumber } from "./phone";

export const OPEN_BOOK_CALL_EVENT = "ng:open-book-call";
// The prepared WhatsApp message, kept for the thank-you page's "Open
// WhatsApp" fallback in case the browser blocked the new tab.
export const WHATSAPP_TEXT_KEY = "ng_wa_text";

export function openBookCall() {
  window.dispatchEvent(new Event(OPEN_BOOK_CALL_EVENT));
}

export function whatsappChatUrl(text?: string) {
  const base = `https://wa.me/${toWhatsAppNumber(SITE.phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
