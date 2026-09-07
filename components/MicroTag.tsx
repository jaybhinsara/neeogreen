import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const GLYPHS = {
  design: "●",
  build: "△",
  ship: "⁂",
} as const;

export function MicroTag({
  glyph,
  children,
  className,
}: {
  glyph: keyof typeof GLYPHS;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-muted-on-dark",
        className
      )}
    >
      <span aria-hidden="true" className="accent-gradient-text">
        {GLYPHS[glyph]}
      </span>
      {children}
    </span>
  );
}
