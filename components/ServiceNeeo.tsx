"use client";

import { useEffect, useRef } from "react";
import { NeeoBot } from "./NeeoBot";

// Neeo in a service page hero. On phones it stands on the hero's bottom edge,
// right of the Book a call button, talking from down by its feet so the bubble
// clears the button. From md up it sits in the empty corner beside the
// headline and walks toward it, stopping short of `avoidId`.
export function ServiceNeeo({ avoidId }: { avoidId: string }) {
  const avoidRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    avoidRef.current = document.getElementById(avoidId);
  }, [avoidId]);

  return (
    <div className="pointer-events-none absolute bottom-0 right-4 z-10 md:bottom-auto md:right-8 md:top-36 xl:right-[5%] xl:top-32">
      <div className="pointer-events-auto w-[96px] md:w-[124px] xl:w-[200px]">
        <NeeoBot range={240} avoidRef={avoidRef} bubbleClassName="bottom-[6%] md:bottom-auto md:top-[6%]" />
      </div>
    </div>
  );
}
