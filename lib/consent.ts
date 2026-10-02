// Cookie consent, stored in a first-party cookie so the choice survives
// visits. "essential" means only strictly necessary storage; "all" also
// allows analytics. Anything optional added later (analytics, embeds) must
// check hasAnalyticsConsent() before loading, and listen for CONSENT_EVENT.
export type Consent = "all" | "essential";

const COOKIE_NAME = "ng_consent";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const CONSENT_EVENT = "ng:consent-change";
export const OPEN_SETTINGS_EVENT = "ng:open-cookie-settings";

export function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|;\s*)ng_consent=(all|essential)(?:;|$)/);
  return match ? (match[1] as Consent) : null;
}

export function writeConsent(value: Consent) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: value }));
}

export function hasAnalyticsConsent() {
  return readConsent() === "all";
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
