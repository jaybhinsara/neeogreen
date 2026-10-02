import { useId } from "react";

export type SocialNetwork = "LinkedIn" | "Instagram";

// Frosted-glass social marks in the site's style: leaf-cut corners (two
// rounded, two nearly square, like the buttons), a translucent white fill,
// and a hairline edge that catches the light at opposite corners. Drawn from
// scratch rather than taken from an icon pack.
export function SocialIcon({ network, className }: { network: SocialNetwork; className?: string }) {
  const id = useId();
  const fill = `${id}-fill`;
  const edge = `${id}-edge`;
  const mark = `${id}-mark`;

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={fill} x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={edge} x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={mark} x1="26" y1="26" x2="75" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.82" />
        </linearGradient>
      </defs>

      <path
        d="M32.5 12.5H81.5Q87.5 12.5 87.5 18.5V67.5Q87.5 87.5 67.5 87.5H18.5Q12.5 87.5 12.5 81.5V32.5Q12.5 12.5 32.5 12.5Z"
        fill={`url(#${fill})`}
        stroke={`url(#${edge})`}
        strokeWidth="1.5"
      />

      {network === "LinkedIn" ? (
        <g fill={`url(#${mark})`}>
          <circle cx="32.2" cy="31.6" r="5.4" />
          <rect x="27" y="41.7" width="10.5" height="29.1" rx="1.2" />
          <path d="M46.2 41.7H56.4V45.9C58 43.4 60.9 41.2 65.6 41.2C71.3 41.2 75.2 45 75.2 53.8V70.8H64.8V55.4C64.8 51.4 63.2 49.4 60.3 49.4C57.6 49.4 56.6 51.4 56.6 55.4V70.8H46.2Z" />
        </g>
      ) : (
        <g>
          <rect
            x="28.5"
            y="28.5"
            width="43"
            height="43"
            rx="12.5"
            fill="none"
            stroke={`url(#${mark})`}
            strokeWidth="5.5"
          />
          <circle cx="50" cy="50" r="10.2" fill="none" stroke={`url(#${mark})`} strokeWidth="5.5" />
          <circle cx="62.6" cy="37.4" r="3.4" fill={`url(#${mark})`} />
        </g>
      )}
    </svg>
  );
}
