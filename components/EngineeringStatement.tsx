"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Emphasis } from "./Emphasis";

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

      {/* Arrives out of the black the statement above collapses into: it
          grows from the center and fades up, continuing that motion. */}
      <motion.figure
        initial={{ opacity: 0, scale: 0.82 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center"
      >
        <p className="mx-auto max-w-[24ch] font-heading text-[clamp(30px,3.6vw,60px)] font-normal leading-[1.16] tracking-[-0.03em] text-white/90 [text-shadow:0_2px_28px_rgba(0,0,0,0.75)]">
          Websites are where we{" "}
          <span className="whitespace-nowrap">
            <Emphasis>start</Emphasis>,
          </span>{" "}
          not where we{" "}
          <span className="whitespace-nowrap">
            <Emphasis>stop</Emphasis>.
          </span>{" "}
          We engineer products, internal tools, and
          the systems behind them, built to solve real problems and{" "}
          <Emphasis>grow</Emphasis> with your business.
        </p>
        <figcaption className="label-mono mt-12 text-white/60">&mdash; Beyond the website</figcaption>
      </motion.figure>
    </section>
  );
}
