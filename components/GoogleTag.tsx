"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";

// Google Ads tag, loaded only for visitors who chose "Accept all" (see the
// cookie policy). Page views are sent manually on every route change: the
// site navigates client-side (e.g. contact form → /thank-you), which the
// standard snippet would miss, and /thank-you is the conversion URL.
const GOOGLE_ADS_ID = "AW-18490191953";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};
const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

function loadTag() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  // gtag must push the arguments object itself, not an array copy.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", GRANTED);
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  document.head.appendChild(script);
}

// Google Ads' first-party cookies (_gcl_au etc.), set on this host or the
// registrable domain depending on the browser.
function clearGoogleCookies() {
  const domain = window.location.hostname.replace(/^www\./, "");
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name.startsWith("_gcl_")) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${domain}`;
  }
}

function sendPageView() {
  window.gtag?.("event", "page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    send_to: GOOGLE_ADS_ID,
  });
}

export function GoogleTag() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function apply(consent: Consent | null) {
      if (consent === "all") {
        const firstLoad = !window.gtag;
        loadTag();
        window.gtag!("consent", "update", GRANTED);
        if (firstLoad) sendPageView();
      } else if (window.gtag) {
        // Withdrawn after the tag loaded: it can't be unloaded, but it stops
        // storing or reading anything, and its existing cookies are removed.
        window.gtag("consent", "update", DENIED);
        clearGoogleCookies();
      }
    }
    apply(readConsent());
    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Every client-side navigation after the first page, whose view is sent
  // when the tag loads above.
  const search = searchParams.toString();
  const isFirstRoute = useRef(true);
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    if (readConsent() === "all") sendPageView();
  }, [pathname, search]);

  return null;
}
