import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToY(y: number) {
  if (instance) instance.scrollTo(y, { immediate: true });
  else window.scrollTo(0, y);
}

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return false;
  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset: -88 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return true;
}
