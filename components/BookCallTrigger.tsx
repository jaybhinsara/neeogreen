"use client";

import type { ReactNode } from "react";
import { openBookCall } from "@/lib/book-call";

export function BookCallTrigger({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openBookCall();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
