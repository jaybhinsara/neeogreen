import type { ReactNode } from "react";

// The premium word treatment used across headlines: italic serif set slightly
// larger than the sans around it, filled with a gradient tuned per surface.
// Padding with matching negative margins gives the italic glyphs room inside
// the clipped background without changing line spacing. Static on purpose: an
// animated gradient here repainted every frame and stalled scrolling.
const BASE =
  "inline-block bg-clip-text -mx-[0.06em] -my-[0.2em] px-[0.12em] py-[0.2em] font-serif text-[1.2em] italic leading-none tracking-[-0.01em] text-transparent";

const TONES = {
  // Night sections: white into mint with a soft glow.
  dark: "bg-[linear-gradient(100deg,#ffffff_0%,#f0fff8_40%,#8ef5cd_75%,#ffffff_100%)] [filter:drop-shadow(0_0_18px_rgba(52,211,153,0.45))]",
  // Cream and white sections: ink into the deep brand green.
  light: "bg-[linear-gradient(100deg,#0b0f0d_0%,#077a50_60%,#0a9a65_100%)]",
  // Emerald sections: white into a pale mint that still reads on green.
  brand: "bg-[linear-gradient(100deg,#ffffff_0%,#effff8_55%,#c4f7e0_100%)]",
};

export type EmphasisTone = keyof typeof TONES;

export const EMPHASIS_CLASS = `${BASE} ${TONES.dark}`;

export function Emphasis({ children, tone = "dark" }: { children: ReactNode; tone?: EmphasisTone }) {
  return <span className={`${BASE} ${TONES[tone]}`}>{children}</span>;
}
