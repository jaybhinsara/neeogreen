"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Reveal } from "./Reveal";

const LeafScene = dynamic(() => import("./LeafScene"), { ssr: false });

let can3d: boolean | undefined;

function canRender3d() {
  if (can3d === undefined) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {}
    can3d = !reduced && webgl;
  }
  return can3d;
}

const noopSubscribe = () => () => {};

export function EngineeringStatement() {
  const use3d = useSyncExternalStore(noopSubscribe, canRender3d, () => false);

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-night px-6 py-32">
      {use3d && <LeafScene className="pointer-events-none absolute inset-0 z-0 opacity-70" />}

      <Reveal className="relative z-10">
        <p className="mx-auto max-w-[26ch] text-center font-heading text-[clamp(28px,3.2vw,52px)] font-medium leading-[1.12] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
          Websites are where we start, not where we stop. We engineer
          products, internal tools, and the systems behind them, built to
          solve real problems and grow with your business.
        </p>
      </Reveal>
    </section>
  );
}
