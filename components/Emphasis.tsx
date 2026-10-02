import type { ReactNode } from "react";

// The premium word treatment shared by the statement sections: italic serif
// with a slow white-to-mint shimmer and a soft glow, set slightly larger than
// the sans copy around it.
export const EMPHASIS_CLASS =
  "inline-block bg-[linear-gradient(100deg,#ffffff_0%,#f0fff8_35%,#8ef5cd_58%,#ffffff_88%)] bg-[length:220%_100%] bg-clip-text -mx-[0.06em] -my-[0.2em] px-[0.12em] py-[0.2em] font-serif text-[1.2em] italic leading-none tracking-[-0.01em] text-transparent [filter:drop-shadow(0_0_18px_rgba(52,211,153,0.45))] motion-safe:animate-[shimmer-text_7s_ease-in-out_infinite]";

export function Emphasis({ children }: { children: ReactNode }) {
  return <span className={EMPHASIS_CLASS}>{children}</span>;
}
