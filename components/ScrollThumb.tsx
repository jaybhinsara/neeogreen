"use client";

import { useEffect, useRef } from "react";
import { scrollToY } from "@/lib/lenis-singleton";

const MIN_THUMB = 48;
const IDLE_MS = 1200;

// The native scrollbar is hidden in globals.css because its track reserves a
// strip of page color beside every dark section. This thumb floats over the
// content instead, appears while scrolling or on hover, and can be dragged.
export function ScrollThumb() {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;

    let thumbHeight = MIN_THUMB;
    let maxScroll = 0;
    let hideTimer = 0;
    let drag: { startY: number; startScroll: number } | null = null;

    function update() {
      const doc = document.documentElement;
      maxScroll = doc.scrollHeight - window.innerHeight;
      rail!.style.display = maxScroll > 0 ? "" : "none";
      if (maxScroll <= 0) return;
      thumbHeight = Math.max(MIN_THUMB, (window.innerHeight * window.innerHeight) / doc.scrollHeight);
      const y = (window.scrollY / maxScroll) * (window.innerHeight - thumbHeight);
      thumb!.style.height = `${thumbHeight}px`;
      thumb!.style.transform = `translateY(${y}px)`;
    }

    function reveal() {
      rail!.dataset.active = "true";
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        if (!drag) delete rail!.dataset.active;
      }, IDLE_MS);
    }

    function onScroll() {
      update();
      reveal();
    }

    function onPointerDown(e: PointerEvent) {
      // Fingers scroll the page natively. A touch landing on the thumb near
      // the screen edge must never start a drag, which moves the page ~20x
      // faster than the finger and jumped whole sections on phones.
      if (e.pointerType === "touch") return;
      e.preventDefault();
      thumb!.setPointerCapture(e.pointerId);
      drag = { startY: e.clientY, startScroll: window.scrollY };
      rail!.dataset.active = "true";
    }

    function onPointerMove(e: PointerEvent) {
      if (!drag) return;
      const ratio = maxScroll / (window.innerHeight - thumbHeight);
      scrollToY(drag.startScroll + (e.clientY - drag.startY) * ratio);
    }

    function onPointerUp(e: PointerEvent) {
      if (!drag) return;
      thumb!.releasePointerCapture(e.pointerId);
      drag = null;
      reveal();
    }

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    thumb.addEventListener("pointerdown", onPointerDown);
    thumb.addEventListener("pointermove", onPointerMove);
    thumb.addEventListener("pointerup", onPointerUp);
    thumb.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.clearTimeout(hideTimer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      thumb.removeEventListener("pointerdown", onPointerDown);
      thumb.removeEventListener("pointermove", onPointerMove);
      thumb.removeEventListener("pointerup", onPointerUp);
      thumb.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={railRef}
      aria-hidden="true"
      className="group fixed inset-y-0 right-0 z-[60] w-3 opacity-0 transition-opacity duration-300 hover:opacity-100 data-active:opacity-100 pointer-coarse:pointer-events-none"
    >
      <div
        ref={thumbRef}
        className="absolute right-[3px] top-0 w-[5px] cursor-grab touch-none rounded-full pointer-coarse:pointer-events-none bg-[rgba(128,132,128,0.55)] backdrop-blur-sm transition-[width,background-color] duration-200 group-hover:w-[7px] group-hover:bg-[rgba(128,132,128,0.8)] active:cursor-grabbing"
      />
    </div>
  );
}
